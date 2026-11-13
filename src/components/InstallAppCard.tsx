import { useT } from "@/utils/i18n";
import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { canPromptInstall, isIos, isStandalone, onInstallChange, promptInstall } from "@/utils/installApp";
import { getAppName } from "@/utils/config";

const KEY = "install_card_closed";

/** Card on the student home: install the portal on the phone (Android: one tap, iPhone: Share -> Add to Home Screen). */
const InstallAppCard = () => {
    const { t } = useT();
    const [, force] = useState(0);
    const [closed, setClosed] = useState(() => { try { return localStorage.getItem(KEY) === "1"; } catch { return false; } });
    useEffect(() => onInstallChange(() => force((n) => n + 1)), []);
    if (closed || isStandalone()) return null;
    const ios = isIos();
    if (!ios && !canPromptInstall()) return null;
    const close = () => { setClosed(true); try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ } };
    return (
        <div className="w-full max-w-2xl mx-auto rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0"><Download size={20} /></div>
            <div className="min-w-0 flex-1 text-sm">
                <div className="font-semibold">{t("add_to_phone", { name: getAppName() || t("this_portal") })}</div>
                {ios
                    ? <div className="text-gray-600 dark:text-gray-300"><Share size={13} className="inline -mt-0.5 mr-1" />{t("install_ios")}</div>
                    : <div className="text-gray-600 dark:text-gray-300">{t("install_android")}</div>}
                {!ios && <button type="button" onClick={promptInstall} className="mt-2 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium">{t("install_app")}</button>}
            </div>
            <button type="button" aria-label="Close" onClick={close} className="p-1 rounded-lg hover:bg-black/5"><X size={16} /></button>
        </div>
    );
};

export default InstallAppCard;
