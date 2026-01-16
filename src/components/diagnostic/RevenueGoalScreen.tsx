import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { PhaseMapStrip } from './PhaseMapStrip';

interface RevenueGoalScreenProps {
    onNext: () => void;
}

export const RevenueGoalScreen = ({ onNext }: RevenueGoalScreenProps) => {
    const { context, setRevenueTargets } = useBusinessStore();
    const sellingStatus = context.sellingStatus;

    const [currentRevenue, setCurrentRevenue] = useState<number | ''>(
        typeof context.currentRevenueMonthlyAvg === 'number' ? context.currentRevenueMonthlyAvg : ''
    );
    const [targetRevenue, setTargetRevenue] = useState<number | ''>(
        context.targetRevenueMonthly ? context.targetRevenueMonthly : ''
    );

    const isSelling = sellingStatus === 'selling';
    const missingSellingStatus = !sellingStatus;

    const handleContinue = () => {
        const target = Number(targetRevenue);
        const current = isSelling ? Number(currentRevenue) : 0;

        if (!target || (isSelling && (currentRevenue === '' || currentRevenue === null))) {
            return;
        }

        setRevenueTargets({
            targetRevenueMonthly: target,
            currentRevenueMonthlyAvg: isSelling ? current : 0
        });
        onNext();
    };

    const disableContinue = missingSellingStatus
        || !targetRevenue
        || (isSelling && (currentRevenue === '' || currentRevenue === null));

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <PhaseMapStrip />

                <div className="text-center space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Set your 90-day revenue target
                    </h1>
                    <p className="text-lg text-slate-400">
                        Next, we'll capture your offers and pick your primary offer to calculate deals.
                    </p>
                </div>

                {missingSellingStatus && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                        Selling status is missing. Go back and select your starting line.
                    </div>
                )}

                <div className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                    {isSelling && (
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                Current Monthly Revenue (Avg last 3 months)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-slate-400 text-xl font-mono">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={currentRevenue}
                                    onChange={(event) => setCurrentRevenue(event.target.value ? Number(event.target.value) : '')}
                                    placeholder="Enter amount"
                                    className="w-full bg-slate-800 hover:bg-slate-700/80 focus:bg-slate-800 border-2 border-transparent focus:border-indigo-500 transition-all rounded-xl py-4 pl-10 pr-4 text-2xl font-mono text-white placeholder-slate-600 outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            90-Day Revenue Goal (Monthly)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-xl font-mono">$</span>
                            </div>
                            <input
                                type="number"
                                value={targetRevenue}
                                onChange={(event) => setTargetRevenue(event.target.value ? Number(event.target.value) : '')}
                                placeholder="Enter amount"
                                className="w-full bg-slate-800 hover:bg-slate-700/80 focus:bg-slate-800 border-2 border-transparent focus:border-emerald-500 transition-all rounded-xl py-4 pl-10 pr-20 text-2xl font-mono text-white placeholder-slate-600 outline-none"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-slate-500 font-medium">/ month</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={disableContinue}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                >
                    Continue to offers <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};
