import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { useT } from "@/utils/i18n";
import { commonGetAPICalls, commonPostAPICall } from "@/utils/ApiCallUtils";
import { PRIMARY_COLOR } from "@/lib/theme";

const rupees = (n?: number | null) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

/** Razorpay Checkout script, loaded once when a student first taps Buy. */
const loadCheckout = () => new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
});

/** The agency's services: the student buys and pays online (on the agency's own Razorpay account). */
const ServicesStore = () => {
    const { t } = useT();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [busy, setBusy] = useState("");
    const [done, setDone] = useState<any>(null);
    const [error, setError] = useState("");
    const agencyName = (() => { try { return JSON.parse(localStorage.getItem("app_config") || "{}").APP_NAME || ""; } catch { return ""; } })();

    const { data, isLoading } = useQuery({
        queryKey: ["student_services"],
        queryFn: async () => {
            const { data, success } = await commonGetAPICalls("/student/services");
            return success ? data : null;
        },
    });
    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    const services: any[] = data?.services || [];

    const buy = async (svc: any) => {
        setError(""); setBusy(svc.id);
        const [ready, order] = await Promise.all([loadCheckout(), commonPostAPICall({}, `student/services/${svc.id}/order`, true)]);
        if (!order?.success || !ready) { setBusy(""); if (!ready) setError("Could not load the payment window - check your internet and try again."); return; }
        const o = order.data;
        const rzp = new (window as any).Razorpay({
            key: o.key_id, order_id: o.order_id, amount: o.amount, currency: o.currency, name: o.name, description: o.description, image: o.image,
            prefill: o.prefill, theme: { color: o.color || PRIMARY_COLOR },
            handler: async (resp: any) => {
                const r = await commonPostAPICall(resp, "student/services/verify", true);
                setBusy("");
                if (r?.success) { setDone({ ...r.data, service: svc.name, total: svc.total }); qc.invalidateQueries({ queryKey: ["student_services"] }); qc.invalidateQueries({ queryKey: ["student_fees"] }); }
            },
            modal: { ondismiss: () => setBusy("") },
        });
        rzp.on("payment.failed", (e: any) => { setBusy(""); setError(e?.error?.description || "Payment failed - no money was taken. Please try again."); });
        rzp.open();
    };

    if (done) {
        return (
            <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center text-center gap-3 mt-6">
                <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 grid place-items-center"><CheckCircle2 size={36} /></div>
                <h1 className="text-xl font-bold">{t("payment_done")}</h1>
                <p className="text-gray-600 dark:text-gray-300">{done.service} · {rupees(done.total)}</p>
                <p className="text-sm text-gray-500">{t("payment_done_text", { n: done.number })}</p>
                <button type="button" onClick={() => navigate("/my_fees")} className="mt-2 w-full rounded-xl px-4 py-3 font-medium text-white" style={{ background: PRIMARY_COLOR }}>{t("view_invoice")}</button>
                <button type="button" onClick={() => setDone(null)} className="text-sm text-gray-500">{t("services")}</button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 p-3 sm:p-4">
            <div>
                <h1 className="text-xl font-bold flex items-center gap-2"><Sparkles size={22} style={{ color: PRIMARY_COLOR }} /> {t("services")}</h1>
                <p className="text-sm text-gray-500 mt-1">{t("services_intro", { agency: agencyName || "your agency" })}</p>
            </div>

            {!data?.can_pay && services.length > 0 && <div className="rounded-xl bg-yellow-50 text-yellow-800 text-sm px-3 py-2">{t("pay_not_ready")}</div>}
            {error && <div className="rounded-xl bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}
            {services.length === 0 && <p className="text-gray-500">{t("no_services")}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s) => (
                    <div key={s.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-4 flex flex-col gap-3">
                        <div>
                            {s.category && <span className="text-[11px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5" style={{ color: PRIMARY_COLOR, background: `${PRIMARY_COLOR}14` }}>{s.category}</span>}
                            <div className="font-semibold text-lg leading-snug mt-1.5">{s.name}</div>
                            {s.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{s.description}</p>}
                        </div>
                        {s.delivery && <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={13} /> {s.delivery}</div>}
                        <div className="mt-auto flex items-end justify-between gap-2">
                            <div>
                                <div className="text-2xl font-bold">{rupees(s.total)}</div>
                                {s.gst_percent > 0 && <div className="text-xs text-gray-500">{t("incl_gst", { n: s.gst_percent })}</div>}
                            </div>
                            <button type="button" disabled={!data?.can_pay || Boolean(busy)} onClick={() => buy(s)}
                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium text-white disabled:opacity-50" style={{ background: PRIMARY_COLOR }}>
                                {busy === s.id ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />} {t("buy_now")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {services.length > 0 && <div className="text-xs text-gray-500 flex items-center gap-1.5"><ShieldCheck size={14} /> {t("secure_payment")}</div>}

            {data?.purchases?.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                    <h2 className="font-semibold">{t("my_purchases")}</h2>
                    {data.purchases.map((p: any) => (
                        <button key={p.invoice_id} type="button" onClick={() => navigate("/my_fees")} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-left">
                            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                            <div className="min-w-0 flex-1"><div className="text-sm font-medium truncate">{p.service}</div><div className="text-xs text-gray-500">{p.number} · {new Date(p.at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</div></div>
                            <div className="text-sm font-medium">{rupees(p.total)}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicesStore;
