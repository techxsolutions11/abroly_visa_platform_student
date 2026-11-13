import { useT } from "@/utils/i18n";
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

/** The case's journey, so students see where they are (same stages as the agency's case board). */
const STAGES = ["documents", "application", "offer", "funds", "visa_filed", "decision"].map((key) => ({ key, label: `stage_${key}` }));
const stageIndex = (stage?: string | null) => {
    if (stage === "biometrics") return 4; // shown together with "Visa filed"
    const i = STAGES.findIndex((s) => s.key === stage);
    return i >= 0 ? i : 0;
};

const Ring = ({ pct }: { pct: number }) => {
    const r = 22, c = 2 * Math.PI * r;
    return (
        <div className="relative h-14 w-14 shrink-0" aria-label={`${pct}% done`}>
            <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
                <circle cx="28" cy="28" r={r} fill="none" strokeWidth="6" className="stroke-gray-100 dark:stroke-gray-800" />
                <circle cx="28" cy="28" r={r} fill="none" strokeWidth="6" strokeLinecap="round" stroke={PRIMARY_COLOR} strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-xs font-bold">{pct}%</span>
        </div>
    );
};

const StagePath = ({ stage, done }: { stage?: string | null; done?: boolean }) => {
    const { t } = useT();
    const at = done ? STAGES.length - 1 : stageIndex(stage);
    return (
        <div className="mt-3">
            <div className="flex items-center">
                {STAGES.map((s, i) => (
                    <div key={s.key} className="flex items-center flex-1 last:flex-none">
                        <span className={`h-3 w-3 rounded-full shrink-0 ${i <= at ? "" : "bg-gray-200 dark:bg-gray-700"}`} style={i <= at ? { background: PRIMARY_COLOR } : undefined} />
                        {i < STAGES.length - 1 && <span className={`h-0.5 flex-1 ${i < at ? "" : "bg-gray-200 dark:bg-gray-700"}`} style={i < at ? { background: PRIMARY_COLOR } : undefined} />}
                    </div>
                ))}
            </div>
            <div className="mt-1 text-xs text-gray-500">{t("now")}: <span className="font-medium text-gray-800 dark:text-gray-200">{t(STAGES[at].label)}</span>{at < STAGES.length - 1 ? ` · ${t("next")}: ${t(STAGES[at + 1].label)}` : ""}</div>
        </div>
    );
};

/**
 * Mobile-first summary of the student's visa cases:
 * "Step 3 of 7", a progress bar, and the list of what the agency still needs from them.
 */
const ProgressTracker = ({ compact = false }: { compact?: boolean }) => {
    const navigate = useNavigate();
    const { t } = useT();
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
                {t("not_started")}
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-3 sm:p-4">
            {!compact && <h1 className="text-xl font-bold">{t("my_progress")}</h1>}
            {cases.map((c) => {
                const pct = c.steps_total ? Math.round((c.steps_done / c.steps_total) * 100) : 0;
                const approved = c.status === "visa_completed";
                const rejected = c.status === "visa_rejected";
                const open = (stepIndex = 0) => navigate(`/accepted_applications/${c.id}?step=${Math.max(0, stepIndex)}`);
                return (
                    <div key={c.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                        <button type="button" onClick={() => open(c.current_step ? c.current_step.number - 1 : 0)} className="w-full text-left p-4 flex items-start gap-3">
                            {!approved && !rejected && c.steps_total > 0 && <Ring pct={pct} />}
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">{[c.country, c.university].filter(Boolean).join(" · ") || t("visa_application")}</div>
                                {c.course && <div className="text-xs text-gray-500 truncate">{c.course}</div>}
                                {approved ? (
                                    <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-100 rounded-full px-3 py-1"><CheckCircle2 size={16} /> {t("visa_approved")}</div>
                                ) : rejected ? (
                                    <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red-700 bg-red-100 rounded-full px-3 py-1"><AlertCircle size={16} /> {t("visa_not_approved")}</div>
                                ) : c.steps_total > 0 ? (
                                    <>
                                        <div className="mt-2 text-sm">
                                            <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                                                {c.current_step ? t("step_of", { n: c.current_step.number, total: c.steps_total }) : t("all_steps_done", { total: c.steps_total })}
                                            </span>
                                            {c.current_step && <span className="text-gray-600 dark:text-gray-300"> · {c.current_step.title}</span>}
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                                            <div className="h-2 rounded-full transition-all" style={{ width: `${Math.max(pct, 3)}%`, background: PRIMARY_COLOR }} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-2 text-sm text-gray-500">{t("preparing_steps")}</div>
                                )}
                                {!rejected && <StagePath stage={c.stage} done={approved} />}
                            </div>
                            <ChevronRight className="text-gray-400 shrink-0 mt-1" size={20} />
                        </button>

                        {!approved && !rejected && (
                            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3">
                                {c.needed.length > 0 ? (
                                    <>
                                        {(() => {
                                            const next = [...c.needed].sort((a: any, b: any) =>
                                                Number(Boolean(b.rejected)) - Number(Boolean(a.rejected)) ||
                                                Number(overdue(b.due_date)) - Number(overdue(a.due_date)) ||
                                                String(a.due_date || "9999").localeCompare(String(b.due_date || "9999")))[0];
                                            return (
                                                <button type="button" onClick={() => open(next.step_index)} className="w-full text-left rounded-xl p-3 mb-3 text-white flex items-center gap-3" style={{ background: PRIMARY_COLOR }}>
                                                    {next.type === "file_selector" ? <FileUp size={22} className="shrink-0" /> : <PencilLine size={22} className="shrink-0" />}
                                                    <span className="flex-1 min-w-0">
                                                        <span className="block text-xs opacity-90">{next.rejected ? t("please_redo") : t("next_thing")}</span>
                                                        <span className="block text-sm font-semibold break-words">{next.text}</span>
                                                        {next.due_date && <span className="block text-xs opacity-90">{overdue(next.due_date) ? t("was_due") : t("due")} {fmt(next.due_date)}</span>}
                                                    </span>
                                                    <ChevronRight size={20} className="shrink-0" />
                                                </button>
                                            );
                                        })()}
                                        <div className="text-sm font-semibold mb-2">{t("what_we_need", { n: c.needed.length })}</div>
                                        <ul className="flex flex-col gap-2">
                                            {c.needed.slice(0, compact ? 3 : 20).map((n: any) => (
                                                <li key={n.question_id}>
                                                    <button type="button" onClick={() => open(n.step_index)} className={`w-full text-left flex items-start gap-3 rounded-xl px-3 py-2.5 ${n.rejected ? "bg-red-50 dark:bg-red-950/30" : "bg-gray-50 dark:bg-gray-800"}`}>
                                                        {n.type === "file_selector" ? <FileUp size={18} className="shrink-0 mt-0.5" /> : <PencilLine size={18} className="shrink-0 mt-0.5" />}
                                                        <span className="flex-1 min-w-0">
                                                            <span className="block text-sm break-words">{n.text}</span>
                                                            {n.rejected && <span className="block text-xs text-red-700 break-words">{t("redo_reason", { reason: n.reason || t("not_accepted") })}</span>}
                                                            <span className={`block text-xs ${overdue(n.due_date) ? "text-red-600 font-medium" : "text-gray-500"}`}>
                                                                {n.step_title}{n.due_date ? ` · ${overdue(n.due_date) ? t("was_due") : t("due")} ${fmt(n.due_date)}` : ""}
                                                            </span>
                                                        </span>
                                                        <span className="text-xs font-medium shrink-0 mt-0.5" style={{ color: PRIMARY_COLOR }}>{n.type === "file_selector" ? t("upload") : t("answer")}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        {compact && c.needed.length > 3 && (
                                            <button type="button" className="mt-2 text-sm font-medium" style={{ color: PRIMARY_COLOR }} onClick={() => navigate("/my_progress")}>{t("see_all", { n: c.needed.length })}</button>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        {c.waiting_review > 0 ? <><Clock size={16} /> {t("nothing_needed_checking", { n: c.waiting_review })}</> : <><CheckCircle2 size={16} className="text-green-600" /> {t("nothing_needed")}</>}
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
