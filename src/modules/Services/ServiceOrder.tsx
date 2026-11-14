import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, CheckCircle2, Download, FileText, Loader2, Paperclip, Send, X } from "lucide-react";
import { useT } from "@/utils/i18n";
import { commonGetAPICalls, commonPostAPICall } from "@/utils/ApiCallUtils";
import { PRIMARY_COLOR } from "@/lib/theme";

const STEPS = ["new", "in_progress", "delivered", "completed"];
const size = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const when = (v: string) => new Date(v).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

/** A service the student bought: progress, files to download, and messages with the agency. */
const ServiceOrder = () => {
    const { id } = useParams();
    const { t } = useT();
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [mode, setMode] = useState<"message" | "changes">("message");
    const [busy, setBusy] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["service_order", id],
        queryFn: async () => { const { data, success } = await commonGetAPICalls(`/student/service_orders/${id}`); return success ? data : null; },
    });
    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div className="p-6 text-gray-500">Order not found.</div>;
    const { order, deliveries, updates } = data;
    const at = order.status === "changes_requested" ? 1 : STEPS.indexOf(order.status);

    const send = async (action: string) => {
        const fd = new FormData();
        fd.append("action", action);
        if (text.trim()) fd.append("message", text.trim());
        files.forEach((f) => fd.append("files", f));
        setBusy(action);
        const r = await commonPostAPICall(fd, `student/service_orders/${id}/reply`, true);
        setBusy("");
        if (r?.success) { setText(""); setFiles([]); setMode("message"); refetch(); }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-3 sm:p-4">
            <button type="button" onClick={() => navigate("/services")} className="self-start inline-flex items-center gap-1 text-sm text-gray-500"><ArrowLeft size={16} /> {t("services")}</button>
            <div>
                <h1 className="text-xl font-bold">{order.title}</h1>
                <p className="text-xs text-gray-500">{order.invoice_number} · {when(order.at)}{order.handled_by ? ` · ${t("handled_by", { n: order.handled_by })}` : ""}</p>
            </div>

            {/* progress */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-start justify-between">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex-1 flex flex-col items-center text-center gap-1 relative">
                            {i > 0 && <div className="absolute top-3.5 right-1/2 w-full h-0.5" style={{ background: i <= at ? PRIMARY_COLOR : "#e5e7eb" }} />}
                            <div className="relative z-10 h-7 w-7 rounded-full grid place-items-center text-xs font-semibold text-white" style={{ background: i <= at ? PRIMARY_COLOR : "#d1d5db" }}>{i < at || (i === at && s === "completed") ? <Check size={14} /> : i + 1}</div>
                            <div className={`text-[11px] leading-tight ${i === at ? "font-semibold" : "text-gray-500"}`}>{t(`order_${s}`)}</div>
                        </div>
                    ))}
                </div>
                {order.status === "changes_requested" && <div className="mt-3 text-xs rounded-lg bg-yellow-50 text-yellow-800 px-3 py-2 text-center">{t("order_changes_requested")}</div>}
            </div>

            {/* files */}
            <div className="flex flex-col gap-2">
                <h2 className="font-semibold">{t("your_files")}</h2>
                {deliveries.length === 0 ? <p className="text-sm text-gray-500">{t("no_files_yet")}</p> : deliveries.map((f: any, i: number) => (
                    <a key={i} href={f.url} target="_blank" rel="noopener" className="no-underline flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-3">
                        <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 grid place-items-center shrink-0"><FileText size={20} /></div>
                        <div className="min-w-0 flex-1"><div className="text-sm font-medium truncate">{f.name}</div><div className="text-xs text-gray-500">{size(f.size)} · {when(f.at)}</div></div>
                        <span className="inline-flex items-center gap-1 text-sm font-medium shrink-0" style={{ color: PRIMARY_COLOR }}><Download size={16} /> {t("download")}</span>
                    </a>
                ))}
            </div>

            {order.status === "delivered" && mode === "message" && (
                <div className="rounded-2xl p-4 flex flex-col gap-3 text-white" style={{ background: PRIMARY_COLOR }}>
                    <div className="text-sm">{t("delivered_review")}</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button type="button" disabled={Boolean(busy)} onClick={() => send("approve")} className="rounded-xl bg-white px-3 py-2.5 font-medium inline-flex items-center justify-center gap-1.5" style={{ color: PRIMARY_COLOR }}>{busy === "approve" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} {t("approve")}</button>
                        <button type="button" onClick={() => setMode("changes")} className="rounded-xl border border-white/60 px-3 py-2.5 font-medium">{t("ask_changes")}</button>
                    </div>
                </div>
            )}

            {/* messages */}
            <div className="flex flex-col gap-2">
                <h2 className="font-semibold">{t("messages")}</h2>
                {updates.filter((u: any) => u.kind !== "status").map((u: any) => {
                    const mine = u.author_type === "student";
                    return (
                        <div key={u.id} className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 flex flex-col gap-1.5 ${mine ? "self-end text-white rounded-br-md" : "self-start bg-gray-100 dark:bg-gray-800 rounded-bl-md"}`} style={mine ? { background: PRIMARY_COLOR } : undefined}>
                            <div className={`text-[11px] ${mine ? "text-white/80" : "text-gray-500"}`}>{u.author_name} · {when(u.at)}</div>
                            {u.message && <div className="text-sm whitespace-pre-wrap break-words">{u.message}</div>}
                            {u.files.map((f: any, i: number) => (
                                <a key={i} href={f.url} target="_blank" rel="noopener" className={`text-sm underline inline-flex items-center gap-1 ${mine ? "text-white" : ""}`}><Paperclip size={13} /> {f.name}</a>
                            ))}
                        </div>
                    );
                })}
            </div>

            {order.status !== "completed" && (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 flex flex-col gap-2">
                    {mode === "changes" && <div className="text-sm font-medium flex items-center justify-between">{t("ask_changes")}<button type="button" aria-label="Cancel" onClick={() => setMode("message")}><X size={16} /></button></div>}
                    <textarea className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent p-3 text-sm min-h-[80px]" placeholder={mode === "changes" ? t("changes_placeholder") : t("message_placeholder")} value={text} onChange={(e) => setText(e.target.value)} />
                    {files.length > 0 && <div className="flex flex-wrap gap-1.5">{files.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs">{f.name}<button type="button" aria-label="Remove" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X size={12} /></button></span>
                    ))}</div>}
                    <input ref={fileRef} type="file" multiple hidden accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.txt,.zip" onChange={(e) => { const picked = e.target.files ? Array.from(e.target.files) : []; if (picked.length) setFiles((f) => [...f, ...picked].slice(0, 5)); e.target.value = ""; }} />
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm"><Paperclip size={15} /> {t("attach")}</button>
                        <button type="button" disabled={Boolean(busy) || (!text.trim() && !files.length)} onClick={() => send(mode === "changes" ? "changes" : "message")} className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ background: PRIMARY_COLOR }}>
                            {busy && busy !== "approve" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} {mode === "changes" ? t("ask_changes") : t("send")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceOrder;
