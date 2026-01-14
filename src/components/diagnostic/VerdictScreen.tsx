import { useState, useEffect } from 'react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { generateCoachResponse } from '../../lib/coachApi';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Target, TrendingDown, Loader2 } from 'lucide-react';

interface VerdictScreenProps {
    onAccept: () => void;
    onReview: () => void;
}

export const VerdictScreen = ({ onAccept, onReview }: VerdictScreenProps) => {
    const { context } = useBusinessStore();
    const { funnel, analysis, offer, goal, isPreRevenue } = context;

    const [coachExplanation, setCoachExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Only fetch if we have data
        if (funnel.leads > 0) {
            fetchExplanation();
        }
    }, [funnel.leads, funnel.calls, funnel.deals]);

    async function fetchExplanation() {
        setIsLoading(true);
        const text = await generateCoachResponse('verdict_explanation', {
            leads: funnel.leads,
            calls: funnel.calls,
            deals: funnel.deals,
            price: offer.price,
            margin: offer.margin,
            bottleneck: analysis.bottleneck,
            // NEW: Goal-Aware Context
            goal: goal ? {
                currentMonthly: goal.currentMonthly,
                targetMonthly: goal.targetMonthly,
                calculatedGap: goal.calculatedGap
            } : undefined,
            isPreRevenue: isPreRevenue
        });
        setCoachExplanation(text);
        setIsLoading(false);
    }


    // Prepare display data
    // Fallback to 0 to prevent NaN
    const leadToCallRate = funnel.leads > 0 ? ((funnel.calls / funnel.leads) * 100).toFixed(1) : '0';
    const callToDealRate = funnel.calls > 0 ? ((funnel.deals / funnel.calls) * 100).toFixed(0) : '0';

    // Bottleneck display helpers
    const getBottleneckTitle = (b: string | null) => {
        if (!b) return 'Unknown';
        if (b === 'volume_outreach') return 'Outreach Volume';
        if (b === 'volume_followup') return 'Follow-Up Volume';
        if (b === 'skill_messaging') return 'Messaging';
        if (b === 'skill_sales') return 'Sales Skill';
        if (b === 'price') return 'Pricing';
        return b;
    };

    const bottleneckTitle = getBottleneckTitle(analysis.bottleneck);
    const isCrisis = analysis.leadToCallRate < 0.15; // 15% benchmark

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 text-white min-h-[800px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <Target className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-400 text-sm font-medium">Diagnostic Complete</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Your Bottleneck is <span className="text-amber-400">{bottleneckTitle}</span>
                    </h1>
                </div>

                {/* VISUAL FUNNEL */}
                <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-3xl overflow-hidden p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Leads */}
                        <div>
                            <div className="flex justify-between mb-2 px-1">
                                <span className="text-sm font-bold text-slate-400">{funnel.leads} Leads</span>
                                <span className="text-xs font-mono text-emerald-400">100%</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-full bg-indigo-500" />
                            </div>
                        </div>

                        <div className="flex justify-center"><ArrowDownIcon /></div>

                        {/* Calls */}
                        <div>
                            <div className="flex justify-between mb-2 px-1">
                                <span className="text-sm font-bold text-slate-400">{funnel.calls} Calls</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${isCrisis ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {leadToCallRate}% Conversion
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {isCrisis ? '⚠️ Below Avg' : '✅ Healthy'}
                                    </span>
                                </div>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(funnel.calls / (funnel.leads || 1)) * 100}%` }}
                                    className={`h-full ${isCrisis ? 'bg-red-500' : 'bg-emerald-500'}`}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center"><ArrowDownIcon /></div>

                        {/* Deals */}
                        <div>
                            <div className="flex justify-between mb-2 px-1">
                                <span className="text-sm font-bold text-slate-400">{funnel.deals} Deals</span>
                                <span className="text-sm font-bold text-emerald-400">{callToDealRate}% Close Rate ✅</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(funnel.deals / (funnel.calls || 1)) * 100}%` }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Benchmarks & Impact */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                            <div className="text-sm text-slate-400 mb-1">Your Booking Rate</div>
                            <div className={`text-4xl font-black font-mono ${isCrisis ? 'text-red-400' : 'text-emerald-400'}`}>
                                {leadToCallRate}%
                            </div>
                            <div className="text-xs text-slate-500 mt-2">Target: 15%</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex flex-col justify-center">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                                    <TrendingDown className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <div className="text-red-200 font-bold mb-1">Leaking {analysis.leakingCalls} calls/mo</div>
                                    <div className="text-sm text-red-200/70">
                                        You are leaving <span className="text-white font-bold">${analysis.moneyLeftOnTable.toLocaleString()}</span> on the table every month.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COACH EXPLANATION */}
                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Coach Logic</span>
                        </div>

                        {isLoading ? (
                            <div className="space-y-2 opacity-50">
                                <div className="h-4 bg-blue-400/20 rounded w-3/4"></div>
                                <div className="h-4 bg-blue-400/20 rounded w-1/2"></div>
                            </div>
                        ) : (
                            <p className="text-blue-100 leading-relaxed text-lg">
                                {coachExplanation}
                            </p>
                        )}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={onReview}
                        className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Review Numbers
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-[2] py-4 bg-green-500 text-black rounded-xl font-bold text-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(34,197,94,0.3)]"
                    >
                        Accept Diagnosis
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

const ArrowDownIcon = () => (
    <div className="text-slate-700 py-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
    </div>
);
