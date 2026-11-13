import { LANGUAGES, Lang, setLang, useT } from "@/utils/i18n";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { getAppName, getConfig, getSupportNumber } from "@/utils/config";

/** Agency logo, or its first letter in the brand colour when there is no logo (or it fails to load). */
export const AgencyLogo = ({ size = 32 }: { size?: number }) => {
    const [broken, setBroken] = useState(false);
    const url = getConfig("FAVICON_URL");
    const name = getAppName() || "A";
    const ok = url && !broken && url !== "/logo.png";
    return ok
        ? <img src={url} alt="" onError={() => setBroken(true)} className="rounded-lg object-cover shrink-0" style={{ width: size, height: size }} />
        : <div className="rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold shrink-0" style={{ width: size, height: size, fontSize: size * 0.45 }}>{name.slice(0, 1).toUpperCase()}</div>;
};

const TITLES: [string, string][] = [
    ["/my_progress", "@my_progress"], ["/my_fees", "@my_fees"], ["/profile", "My profile"], ["/visa", "Visa consultation"],
    ["/accepted", "My applications"], ["/career", "Careers"], ["/health", "Health insurance"], ["/sim", "SIM cards"],
];

/** Top bar of the student portal: agency logo + name, current page, WhatsApp the agency. */
export const StudentTopBar = () => {
    const { pathname } = useLocation();
    const { t, lang } = useT();
    const raw = TITLES.find(([p]) => pathname.startsWith(p))?.[1] || "";
    const title = raw.startsWith("@") ? t(raw.slice(1)) : raw;
    const support = String(getSupportNumber() || "").replace(/\D/g, "");
    return (
        <div className="flex items-center gap-2 min-w-0 flex-1">
            <AgencyLogo size={28} />
            <div className="min-w-0 leading-tight">
                <div className="text-sm font-semibold truncate">{title || getAppName() || "Student portal"}</div>
                {title && <div className="text-[11px] text-default-500 truncate">{getAppName()}</div>}
            </div>
            <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value as Lang)}
                className="ml-auto rounded-full border border-default-200 bg-transparent px-2 py-1 text-xs">
                {LANGUAGES.map((l) => <option key={l.key} value={l.key}>{l.short}</option>)}
            </select>
            {support && (
                <a href={`https://wa.me/${support.length === 10 ? `91${support}` : support}`} target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1 rounded-full bg-success-50 text-success-700 px-3 py-1.5 text-xs font-medium shrink-0">
                    <MessageCircle size={14} /><span className="max-sm:hidden">{t("chat_with_us")}</span>
                </a>
            )}
        </div>
    );
};
