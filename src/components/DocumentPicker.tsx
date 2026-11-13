import { useT } from "@/utils/i18n";
import { useEffect, useRef, useState } from "react";
import { Camera, FileText, FolderOpen, TriangleAlert, X } from "lucide-react";

/**
 * Pick a document: take a photo with the phone camera or choose a file.
 * Photos are checked (blurry / dark / small) and large ones are shrunk before upload, so they send faster.
 * The student can still send a photo with a warning - the consultant decides.
 */

const MAX_SIDE = 2200;

const loadImage = (file: File) => new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
});

/** Sharpness = variance of a Laplacian on a small grey copy; brightness = mean grey. */
const checkPhoto = (img: HTMLImageElement) => {
    const w = 400, h = Math.max(1, Math.round((img.height / img.width) * 400));
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return { sharp: 999, bright: 128 };
    ctx.drawImage(img, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    const g = new Float32Array(w * h);
    let sum = 0;
    for (let i = 0; i < w * h; i++) { const v = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]; g[i] = v; sum += v; }
    let mean = 0, sq = 0, n = 0;
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const lap = g[i - w] + g[i + w] + g[i - 1] + g[i + 1] - 4 * g[i];
        mean += lap; sq += lap * lap; n++;
    }
    mean /= n;
    return { sharp: sq / n - mean * mean, bright: sum / (w * h) };
};

const shrink = async (file: File, img: HTMLImageElement): Promise<File> => {
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
    if (scale === 1 && file.size < 2.5 * 1024 * 1024) return file;
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
    const blob: Blob | null = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
};

const DocumentPicker = ({ value, onChange }: { value: File | null; onChange: (file: File | null) => void }) => {
    const { t } = useT();
    const camera = useRef<HTMLInputElement>(null);
    const picker = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [busy, setBusy] = useState(false);

    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
    useEffect(() => { if (!value) { setPreview(null); setWarnings([]); } }, [value]);

    const take = async (file?: File | null) => {
        if (!file) return;
        setWarnings([]);
        if (!file.type.startsWith("image/")) {
            setPreview(null);
            if (file.size > 20 * 1024 * 1024) setWarnings([t("file_big")]);
            onChange(file);
            return;
        }
        setBusy(true);
        try {
            const img = await loadImage(file);
            const { sharp, bright } = checkPhoto(img);
            const w: string[] = [];
            if (sharp < 60) w.push(t("photo_blurry"));
            if (bright < 60) w.push(t("photo_dark"));
            if (Math.max(img.width, img.height) < 900) w.push(t("photo_small"));
            setWarnings(w);
            const out = await shrink(file, img);
            setPreview(URL.createObjectURL(out));
            onChange(out);
        } catch {
            onChange(file);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input ref={camera} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} />
            <input ref={picker} type="file" accept="image/*,application/pdf,.doc,.docx" className="hidden" onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} />
            {!value ? (
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => camera.current?.click()} disabled={busy}
                        className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 py-4 flex flex-col items-center gap-1 text-sm font-medium text-primary">
                        <Camera size={22} />{t("take_photo")}
                    </button>
                    <button type="button" onClick={() => picker.current?.click()} disabled={busy}
                        className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 py-4 flex flex-col items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <FolderOpen size={22} />{t("choose_file")}
                    </button>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-3">
                    {preview ? <img src={preview} alt="" className="h-16 w-16 rounded-lg object-cover" /> : <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 grid place-items-center"><FileText size={24} className="text-gray-500" /></div>}
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{value.name}</div>
                        <div className="text-xs text-gray-500">{(value.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                    <button type="button" aria-label="Remove" onClick={() => onChange(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
                </div>
            )}
            {busy && <div className="text-xs text-gray-500">{t("checking_photo")}</div>}
            {warnings.map((w) => (
                <div key={w} className="flex items-start gap-2 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 px-3 py-2 text-xs">
                    <TriangleAlert size={14} className="shrink-0 mt-0.5" /><span>{w} <button type="button" className="underline font-medium" onClick={() => camera.current?.click()}>{t("retake")}</button></span>
                </div>
            ))}
        </div>
    );
};

export default DocumentPicker;
