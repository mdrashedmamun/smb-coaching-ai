import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Edit2, Target, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useBusinessStore } from '../../store/useBusinessStore';

interface DataRecapScreenProps {
    onNext: () => void;
    onEditOffer: () => void;
    onEditGoal: () => void;
}

export const DataRecapScreen = ({ onNext, onEditOffer, onEditGoal }: DataRecapScreenProps) => {
    const { context } = useBusinessStore();
    const { offer, goal, isPreRevenue } = context;

    // Safety check
    if (!goal) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-white text-center">
                <p className="text-red-400">Goal data not found. Please go back.</p>
            </div>
        );
    }

    // Derived values
    const profitPerClient = Math.round(offer.price * (offer.margin / 100));
    const callBookingRate = 5; // Default assumption from GoalCalculator
    const missingLeads = Math.max(0, goal.calculatedGap.leadsNeeded);

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[700px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Let me mirror back what you told me
                    </h1>
                    <p className="text-lg text-slate-400">
                        Before we diagnose, let's confirm the data is right.
                    </p>
                </div>

                {/* Your Offer Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Your Offer</span>
                        </div>
                        <button
                            onClick={onEditOffer}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Edit2 className="w-3 h-3" /> Edit
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-slate-500">Price per client</div>
                            <div className="text-2xl font-bold font-mono">${offer.price.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Gross margin</div>
                            <div className="text-2xl font-bold font-mono">{offer.margin}%</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Profit per client</div>
                            <div className="text-2xl font-bold font-mono text-emerald-400">${profitPerClient.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Close rate</div>
                            <div className="text-2xl font-bold font-mono">{offer.closeRate}%</div>
                        </div>
                    </div>
                </div>

                {/* Your Goal Card */}
                <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-6 relative group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-400" />
                            <span className="text-sm font-bold uppercase tracking-wider text-indigo-300">Your Revenue Goal</span>
                        </div>
                        <button
                            onClick={onEditGoal}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Edit2 className="w-3 h-3" /> Edit
                        </button>
                    </div>
                    <div className="space-y-3">
                        {!isPreRevenue && (
                            <div className="flex justify-between items-center">
                                <span className="text-indigo-200">Current monthly</span>
                                <span className="text-xl font-bold font-mono">${goal.currentMonthly.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-indigo-200">90-day target</span>
                            <span className="text-xl font-bold font-mono text-indigo-300">${goal.targetMonthly.toLocaleString()}/month</span>
                        </div>
                        {isPreRevenue && (
                            <div className="text-xs text-indigo-400 mt-2 px-3 py-1 bg-indigo-500/10 rounded-full inline-block">
                                Pre-Revenue Mode
                            </div>
                        )}
                    </div>
                </div>

                {/* The Math / Gap Card */}
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-bold uppercase tracking-wider text-amber-300">What the Math Says You Need</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-amber-500/10 rounded-xl p-4">
                            <div className="text-3xl font-black text-amber-300">{goal.calculatedGap.dealsNeeded}</div>
                            <div className="text-xs text-amber-200 mt-1">New Deals</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-xl p-4 relative">
                            <ArrowLeft className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
                            <div className="text-3xl font-black text-amber-300">{goal.calculatedGap.callsNeeded}</div>
                            <div className="text-xs text-amber-200 mt-1">Sales Calls</div>
                            <div className="text-[10px] text-amber-400 mt-1">@ {offer.closeRate}% close</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-xl p-4 relative">
                            <ArrowLeft className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
                            <div className="text-3xl font-black text-amber-300">{goal.calculatedGap.leadsNeeded}</div>
                            <div className="text-xs text-amber-200 mt-1">Leads Needed</div>
                            <div className="text-[10px] text-amber-400 mt-1">@ {callBookingRate}% booking</div>
                        </div>
                    </div>
                </div>

                {/* The Gap Alert */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <div className="text-sm font-bold uppercase tracking-wider text-red-300 mb-2">The Gap</div>
                            <p className="text-red-100 leading-relaxed">
                                To hit <strong>${goal.targetMonthly.toLocaleString()}/month</strong>,
                                you need <strong>{goal.calculatedGap.leadsNeeded} leads</strong> this quarter.
                                {missingLeads > 0 && (
                                    <span className="block mt-2 font-bold text-lg">
                                        That's {Math.ceil(missingLeads / 12)} leads per week you're missing.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={onNext}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                    Now Audit My Lead Flow <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};
