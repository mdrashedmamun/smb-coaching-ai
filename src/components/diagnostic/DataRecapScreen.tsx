import { motion } from 'framer-motion';
import { ArrowRight, Edit2, Target, DollarSign, Lock, Info } from 'lucide-react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { ModeBadge, Phase2BlockedBanner } from './ModeIndicator';

interface DataRecapScreenProps {
    onNext: () => void;
    onEditOffer: () => void;
    onEditGoal: () => void;
    advisoryBlocked?: boolean;
    advisoryMessage?: string;
}

export const DataRecapScreen = ({ onNext, onEditOffer, onEditGoal, advisoryBlocked = false, advisoryMessage }: DataRecapScreenProps) => {
    const { context } = useBusinessStore();
    const {
        growthPhysicsBrief,
        phase1,
        sellingStatus,
        currentRevenueMonthlyAvg,
        targetRevenueMonthly
    } = context;
    const primaryOffer = context.offers.find(o => o.id === context.primaryOfferId) || null;

    const briefReady = phase1?.status === 'complete' && growthPhysicsBrief;
    const hasTarget = typeof targetRevenueMonthly === 'number' && targetRevenueMonthly > 0;
    const hasCurrent = typeof currentRevenueMonthlyAvg === 'number';
    const assumptionsUsed = growthPhysicsBrief?.assumptionsUsed || [];

    return (
        <div className="max-w-4xl mx-auto p-6 text-white min-h-[700px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center space-y-3">
                    <div className="flex justify-center mb-2">
                        <ModeBadge />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Growth Physics Brief
                    </h1>
                    <p className="text-lg text-slate-400">
                        Deterministic outputs from your Phase 1 inputs.
                    </p>
                </div>

                <Phase2BlockedBanner />

                {!briefReady && (
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-200">
                        Complete your revenue goal and selling status to generate the brief.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-400" />
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Revenue Inputs</span>
                            </div>
                            <button
                                onClick={onEditGoal}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Edit2 className="w-3 h-3" /> Edit
                            </button>
                        </div>
                        <div className="space-y-3">
                            {sellingStatus === 'selling' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Current monthly avg</span>
                                    <span className="text-xl font-bold font-mono">
                                        {hasCurrent ? `$${Number(currentRevenueMonthlyAvg).toLocaleString()}` : 'Not set'}
                                    </span>
                                </div>
                            )}
                            {sellingStatus === 'pre_revenue' && (
                                <div className="text-xs text-slate-400">
                                    Pre-revenue: current monthly = $0 by definition
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Target monthly (90 days)</span>
                                <span className="text-xl font-bold font-mono text-indigo-300">
                                    {hasTarget ? `$${Number(targetRevenueMonthly).toLocaleString()}` : 'Not set'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Primary Offer</span>
                            </div>
                            <button
                                onClick={onEditOffer}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Edit2 className="w-3 h-3" /> Edit
                            </button>
                        </div>
                        {primaryOffer ? (
                            <div className="space-y-2">
                                <div className="text-lg font-bold text-white">{primaryOffer.name}</div>
                                <div className="text-sm text-slate-400">
                                    ${primaryOffer.price.toLocaleString()} · {primaryOffer.billingModel ? primaryOffer.billingModel.replace('_', ' ') : 'billing'}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400">
                                No primary offer selected yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Revenue Gap (Monthly)
                        </div>
                        <div className="text-4xl font-black text-emerald-400 font-mono">
                            {briefReady ? `$${growthPhysicsBrief.revenueGapMonthly.toLocaleString()}` : '--'}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Deals Required (Monthly)
                        </div>
                        {briefReady ? (
                            growthPhysicsBrief.requiredDealsMonthly !== undefined ? (
                                <div className="text-4xl font-black text-indigo-300 font-mono">
                                    {growthPhysicsBrief.requiredDealsMonthly}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Lock className="w-4 h-4" />
                                    Select a primary offer to compute deals.
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Lock className="w-4 h-4" />
                                Complete required inputs to compute deals.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-slate-400" />
                        <span className="text-xs uppercase tracking-widest text-slate-500">Mode</span>
                    </div>
                    <div className="text-sm text-slate-300">
                        {growthPhysicsBrief?.mode === 'scenario' ? 'Scenario' : 'Real'}
                        {assumptionsUsed.length > 0 ? (
                            <span className="block text-slate-400 mt-2">
                                Assumptions used: {assumptionsUsed.join(', ')}
                            </span>
                        ) : (
                            <span className="block text-slate-500 mt-2">
                                No assumptions used.
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={onNext}
                    disabled={advisoryBlocked || !briefReady}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                    Continue <ArrowRight className="w-5 h-5" />
                </button>
                {advisoryBlocked && (
                    <p className="text-xs text-amber-300 mt-2 text-center">
                        {advisoryMessage || 'Advisory is locked. Run Scenario only.'}
                    </p>
                )}
            </motion.div>
        </div>
    );
};
