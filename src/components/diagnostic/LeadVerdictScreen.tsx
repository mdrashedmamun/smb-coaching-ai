import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, TrendingUp, Target, DollarSign } from 'lucide-react';
import type { Verdict, BottleneckType } from '../../lib/BottleneckEngine';

interface LeadVerdictScreenProps {
    verdict: Verdict;
    onAccept: () => void;
}

const BOTTLENECK_LABELS: Record<BottleneckType, { title: string; color: string }> = {
    volume_outreach: { title: 'Outreach Volume', color: 'red' },
    volume_followup: { title: 'Follow-Up Volume', color: 'amber' },
    skill_messaging: { title: 'Messaging Skill', color: 'purple' },
    skill_sales: { title: 'Sales Skill', color: 'purple' },
    price: { title: 'Pricing', color: 'green' },
    capacity: { title: 'Capacity', color: 'blue' },
};

export const LeadVerdictScreen = ({ verdict, onAccept }: LeadVerdictScreenProps) => {
    const bottleneckInfo = BOTTLENECK_LABELS[verdict.bottleneck];

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

                {/* Model Card */}
                <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-8">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Your Model
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-xs text-gray-400 mb-1">Current</div>
                            <div className="text-2xl md:text-3xl font-bold font-mono text-white">
                                ${verdict.model.currentRevenue.toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 mb-1">Goal</div>
                            <div className="text-2xl md:text-3xl font-bold font-mono text-indigo-400">
                                ${verdict.model.goalRevenue.toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 mb-1">Gap</div>
                            <div className="text-2xl md:text-3xl font-bold font-mono text-red-400">
                                ${verdict.model.gap.toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 mb-1">Clients Needed</div>
                            <div className={`text-2xl md:text-3xl font-bold font-mono ${verdict.model.isSustainable ? 'text-green-400' : 'text-amber-400'}`}>
                                {verdict.model.clientsNeededAtCurrentPrice}
                            </div>
                        </div>
                    </div>

                    {!verdict.model.isSustainable && (
                        <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/20 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-200">
                                At your current price, reaching your goal requires too many clients. Consider raising your price.
                            </p>
                        </div>
                    )}
                </div>

                {/* Prescription Card */}
                <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-8 space-y-6">
                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> Your Prescription
                    </h3>

                    <div className="text-center py-6">
                        <div className="text-6xl md:text-8xl font-bold text-green-400 font-mono">
                            {verdict.prescription.quantity}
                        </div>
                        <div className="text-xl md:text-2xl text-white font-bold mt-2">
                            {verdict.prescription.action}
                        </div>
                        <div className="text-sm text-gray-400 mt-2 uppercase tracking-widest">
                            {verdict.prescription.timeframe === 'this_week' ? 'This Week' : 'By Friday'}
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {verdict.prescription.explanation}
                        </p>
                    </div>
                </div>

                {/* Accept Button */}
                <button
                    onClick={onAccept}
                    className="w-full py-5 bg-green-500 text-black rounded-xl font-bold text-lg hover:bg-green-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                >
                    Accept Prescription
                    <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};
