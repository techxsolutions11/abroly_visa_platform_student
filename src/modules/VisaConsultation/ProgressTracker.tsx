import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { commonGetAPICalls } from "@/utils/ApiCallUtils";
import { AlertCircle, CheckCircle2, ChevronRight, Clock, FileUp, PencilLine } from "lucide-react";
import { PRIMARY_COLOR } from "@/lib/theme";

const fmt = (v?: string | null) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};
const overdue = (v?: string | null) => Boolean(v) && String(v).slice(0, 10) < new Date().toISOString().slice(0, 10);

/**
 * Mobile-first summary of the student's visa cases:
 * "Step 3 of 7", a progress bar, and the list of what the agency still needs from them.
 */
const ProgressTracker = ({ compact = false }: { compact?: boolean }) => {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ["student_overview"],
        queryFn: async () => {
            const { data, success } = await commonGetAPICalls("/leads/lead_progress/student/overview");
            return success ? data : [];
        },
    });

    if (isLoading) return null;
    const cases: any[] = Array.isArray(data) ? data : [];
    if (!cases.length) {
        return compact ? null : (
            <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">
                Your visa process has not started yet. Your consultant will open it for you.
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-3 sm:p-4">
            {!compact && <h1 className="text-xl font-bold">My visa progress</h1>}
            {cases.map((c) => {
                const pct = c.steps_total ? Math.round((c.steps_done / c.steps_total) * 100) : 0;
                const approved = c.status === "visa_completed";
                const rejected = c.status === "visa_rejected";
                const open = (stepIndex = 0) => navigate(`/accepted_applications/${c.id}?step=${Math.max(0, stepIndex)}`);
                return (
                    <div key={c.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                        <button type="button" onClick={() => open(c.current_step ? c.current_step.number - 1 : 0)} className="w-full text-left p-4 flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">{[c.country, c.university].filter(Boolean).join(" · ") || "Visa application"}</div>
                                {c.course && <div className="text-xs text-gray-500 truncate">{c.course}</div>}
                                {approved ? (
                                    <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-100 rounded-full px-3 py-1"><CheckCircle2 size={16} /> Visa approved</div>
                                ) : rejected ? (
                                    <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red-700 bg-red-100 rounded-full px-3 py-1"><AlertCircle size={16} /> Visa not approved - talk to your consultant</div>
                                ) : c.steps_total > 0 ? (
                                    <>
                                        <div className="mt-2 text-sm">
                                            <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                                                {c.current_step ? `Step ${c.current_step.number} of ${c.steps_total}` : `All ${c.steps_total} steps done`}
                                            </span>
                                            {c.current_step && <span className="text-gray-600 dark:text-gray-300"> · {c.current_step.title}</span>}
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                                            <div className="h-2 rounded-full transition-all" style={{ width: `${Math.max(pct, 3)}%`, background: PRIMARY_COLOR }} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-2 text-sm text-gray-500">Your consultant is preparing your steps.</div>
                                )}
                            </div>
                            <ChevronRight className="text-gray-400 shrink-0 mt-1" size={20} />
                        </button>

                        {!approved && !rejected && (
                            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3">
                                {c.needed.length > 0 ? (
                                    <>
                                        <div className="text-sm font-semibold mb-2">What we need from you ({c.needed.length})</div>
                                        <ul className="flex flex-col gap-2">
                                            {c.needed.slice(0, compact ? 3 : 20).map((n: any) => (
                                                <li key={n.question_id}>
                                                    <button type="button" onClick={() => open(n.step_index)} className={`w-full text-left flex items-start gap-3 rounded-xl px-3 py-2.5 ${n.rejected ? "bg-red-50 dark:bg-red-950/30" : "bg-gray-50 dark:bg-gray-800"}`}>
                                                        {n.type === "file_selector" ? <FileUp size={18} className="shrink-0 mt-0.5" /> : <PencilLine size={18} className="shrink-0 mt-0.5" />}
                                                        <span className="flex-1 min-w-0">
                                                            <span className="block text-sm break-words">{n.text}</span>
                                                            {n.rejected && <span className="block text-xs text-red-700 break-words">Please redo: {n.reason || "not accepted"}</span>}
                                                            <span className={`block text-xs ${overdue(n.due_date) ? "text-red-600 font-medium" : "text-gray-500"}`}>
                                                                {n.step_title}{n.due_date ? ` · ${overdue(n.due_date) ? "was due" : "due"} ${fmt(n.due_date)}` : ""}
                                                            </span>
                                                        </span>
                                                        <span className="text-xs font-medium shrink-0 mt-0.5" style={{ color: PRIMARY_COLOR }}>{n.type === "file_selector" ? "Upload" : "Answer"}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        {compact && c.needed.length > 3 && (
                                            <button type="button" className="mt-2 text-sm font-medium" style={{ color: PRIMARY_COLOR }} onClick={() => navigate("/my_progress")}>See all {c.needed.length}</button>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        {c.waiting_review > 0 ? <><Clock size={16} /> Nothing needed right now. We are checking {c.waiting_review} item(s) you sent.</> : <><CheckCircle2 size={16} className="text-green-600" /> Nothing needed from you right now.</>}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProgressTracker;
