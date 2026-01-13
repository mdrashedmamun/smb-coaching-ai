import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, TrendingUp, Target, DollarSign, ArrowLeft, BarChart3, Users, PhoneCall, TrendingDown } from 'lucide-react';
import type { Verdict, BottleneckType, AuditMetrics } from '../../lib/BottleneckEngine';
import { useBusinessStore } from '../../store/useBusinessStore';

interface LeadVerdictScreenProps {
    verdict: Verdict;
    onAccept: () => void;
    onReview: () => void;
}

const BOTTLENECK_LABELS: Record<BottleneckType, { title: string; color: string; bgColor: string; borderColor: string }> = {
    volume_outreach: { title: 'Outreach Volume', color: 'red', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
    volume_followup: { title: 'Follow-Up Volume', color: 'amber', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
    skill_messaging: { title: 'Messaging Skill', color: 'purple', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
    skill_sales: { title: 'Sales Skill', color: 'purple', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
    price: { title: 'Pricing', color: 'green', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' },
    capacity: { title: 'Capacity', color: 'blue', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
};

export const LeadVerdictScreen = ({ verdict, onAccept, onReview }: LeadVerdictScreenProps) => {
    const bottleneckInfo = BOTTLENECK_LABELS[verdict.bottleneck];
    const context = useBusinessStore(state => state.context);
    const metrics = context.customFunnel?.aggregatedMetrics;

    if (!metrics) return null;

    const { totalOutreach, totalResponses, totalCalls, totalClosed } = metrics;
    const { actualConversion, industryAverage, missingCalls, lostRevenue } = verdict.benchmarks;

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
                        <span className="text-indigo-400 text-sm font-medium">Lead Bottleneck Verdict</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Your Bottleneck is <span className={`text-${bottleneckInfo.color}-400`}>{bottleneckInfo.title}</span>
                    </h1>
                </div>

                {/* THE MIRROR: Visual Funnel & Benchmarks */}
                <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-3xl overflow-hidden">
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Visual Funnel Representation */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> Your Funnel Analysis
                            </h3>

                            <div className="space-y-4 max-w-md mx-auto">
                                {/* Leads */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                                        <span>{totalResponses} Leads</span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            className="h-full bg-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <ArrowRight className="w-4 h-4 text-slate-700 rotate-90" />
                                </div>

                                {/* Calls */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold px-1">
                                        <span className="text-slate-400">{totalCalls} Calls</span>
                                        <span className={actualConversion < industryAverage ? 'text-red-400' : 'text-emerald-400'}>
                                            {actualConversion}% conversion {actualConversion < industryAverage ? '⚠️ Below Avg' : '✅ Good'}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(totalCalls / totalResponses) * 100}%` }}
                                            className={`h-full ${actualConversion < industryAverage ? 'bg-red-500' : 'bg-emerald-500'}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <ArrowRight className="w-4 h-4 text-slate-700 rotate-90" />
                                </div>

                                {/* Deals */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                                        <span>{totalClosed} {totalClosed === 1 ? 'Deal' : 'Deals'}</span>
                                        <span className="text-emerald-400">
                                            {Math.round((totalClosed / totalCalls) * 100)}% close rate ✅
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(totalClosed / totalResponses) * 100}%` }}
                                            className="h-full bg-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Benchmark Comparison Table */}
                        <div className="pt-8 border-t border-slate-800">
                            <div className="bg-black/20 rounded-2xl p-6">
                                <div className="text-center mb-6">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Your Data vs Industry</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 border border-white/5 rounded-xl bg-white/5">
                                        <div className="text-sm text-slate-400 mb-1">Your Booking Rate</div>
                                        <div className={`text-2xl font-black font-mono ${actualConversion < industryAverage ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {actualConversion}%
                                        </div>
                                    </div>
                                    <div className="text-center p-4 border border-white/5 rounded-xl bg-white/5">
                                        <div className="text-sm text-slate-400 mb-1">Industry Average</div>
                                        <div className="text-2xl font-black font-mono text-white">
                                            {industryAverage}%
                                        </div>
                                    </div>
                                </div>

                                {missingCalls > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                                            <TrendingDown className="w-6 h-6 text-red-400" />
                                        </div>
                                        <div>
                                            <div className="text-red-400 font-bold text-lg leading-tight mb-1">
                                                Leaking {missingCalls} calls / month
                                            </div>
                                            <div className="text-red-200/70 text-sm font-medium">
                                                You are leaving <span className="text-white font-bold">${lostRevenue.toLocaleString()}</span> on the table every month.
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Model & Prescription Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Model Card */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Your Target Model
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6 text-center">
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Goal Revenue</div>
                                <div className="text-xl font-bold font-mono text-indigo-400">
                                    ${verdict.model.goalRevenue.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Gap</div>
                                <div className="text-xl font-bold font-mono text-red-400">
                                    ${verdict.model.gap.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Sustainability</div>
                                <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${verdict.model.isSustainable ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {verdict.model.isSustainable ? 'Sustainable' : 'Price Logic Risk'}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Units Needed</div>
                                <div className="text-xl font-bold font-mono text-white">
                                    {verdict.model.clientsNeededAtCurrentPrice}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prescription Card */}
                    <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-6 space-y-6">
                        <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Immediate Prescription
                        </h3>

                        <div className="text-center">
                            <div className="text-5xl font-bold text-green-400 font-mono">
                                {verdict.prescription.quantity}
                            </div>
                            <div className="text-lg text-white font-bold mt-1 line-clamp-1">
                                {verdict.prescription.action}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
                                {verdict.prescription.timeframe === 'this_week' ? 'THIS WEEK' : 'BY FRIDAY'}
                            </div>
                        </div>

                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-gray-300 text-xs leading-relaxed italic">
                                "{verdict.prescription.explanation}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={onReview}
                        className="flex-1 py-5 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Review Numbers
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-[2] py-5 bg-green-500 text-black rounded-2xl font-bold text-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(34,197,94,0.3)]"
                    >
                        Accept Prescription
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
