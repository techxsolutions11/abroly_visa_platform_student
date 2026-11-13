import { useT } from "@/utils/i18n";
import { useQuery } from "@tanstack/react-query";
import { commonGetAPICalls } from "@/utils/ApiCallUtils";
import { PRIMARY_COLOR } from "@/lib/theme";
import { CheckCircle2, Wallet } from "lucide-react";

const rupees = (n?: number | null) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const fmt = (v?: string | null) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

/** The student's invoices: what is due, by when, and how to pay. */
const MyFees = () => {
    const { t } = useT();
    const { data, isLoading } = useQuery({
        queryKey: ["student_fees"],
        queryFn: async () => {
            const { data, success } = await commonGetAPICalls("/student/fees");
            return success ? data : null;
        },
    });
    if (isLoading) return null;
    const invoices: any[] = data?.invoices || [];

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-3 sm:p-4">
            <h1 className="text-xl font-bold flex items-center gap-2"><Wallet size={22} /> {t("my_fees")}</h1>
            {invoices.length === 0 ? (
                <p className="text-gray-500">{t("no_invoices")}</p>
            ) : (
                <div className="rounded-2xl p-4 text-white" style={{ background: PRIMARY_COLOR }}>
                    <div className="text-sm opacity-90">{t("total_due")}</div>
                    <div className="text-3xl font-bold">{rupees(data.total_due)}</div>
                </div>
            )}
            {invoices.map((inv) => (
                <div key={inv.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="font-semibold">{inv.title || inv.number}</div>
                            <div className="text-xs text-gray-500">{inv.number} · {fmt(inv.issue_date)}</div>
                        </div>
                        {inv.balance <= 0 ? (
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-100 rounded-full px-3 py-1 shrink-0"><CheckCircle2 size={14} /> Paid</span>
                        ) : (
                            <span className={`text-sm font-medium rounded-full px-3 py-1 shrink-0 ${inv.overdue ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"}`}>{inv.overdue ? t("overdue") : t("due")}</span>
                        )}
                    </div>
                    <div className="grid grid-cols-3 text-sm">
                        <div><div className="text-xs text-gray-500">{t("total")}</div>{rupees(inv.total)}</div>
                        <div><div className="text-xs text-gray-500">{t("paid")}</div>{rupees(inv.amount_paid)}</div>
                        <div className="font-semibold"><div className="text-xs text-gray-500 font-normal">{t("balance")}</div>{rupees(inv.balance)}</div>
                    </div>
                    {inv.next_due && (
                        <div className={`text-sm rounded-xl px-3 py-2 ${inv.overdue ? "bg-red-50 text-red-700" : "bg-gray-50 dark:bg-gray-800"}`}>
                            {t("next_payment")}: <b>{rupees(inv.next_due.amount)}</b>{inv.next_due.due_date ? ` ${t("by")} ${fmt(inv.next_due.due_date)}` : ""}{inv.next_due.label ? ` (${inv.next_due.label})` : ""}
                        </div>
                    )}
                    {inv.balance > 0 && inv.payment_link_url && (
                        <a href={inv.payment_link_url} target="_blank" rel="noreferrer" className="text-center rounded-xl px-4 py-3 font-medium text-white" style={{ background: PRIMARY_COLOR }}>{t("pay_online")}</a>
                    )}
                </div>
            ))}
            {data?.total_due > 0 && (data.upi_id || data.bank_details) && (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-sm">
                    <div className="font-semibold mb-1">{t("other_ways")}</div>
                    {data.upi_id && <div>UPI: <b>{data.upi_id}</b></div>}
                    {data.bank_details && <div className="whitespace-pre-line text-gray-600 dark:text-gray-300">{data.bank_details}</div>}
                    <div className="text-xs text-gray-500 mt-2">{t("send_screenshot")}</div>
                </div>
            )}
        </div>
    );
};

export default MyFees;
