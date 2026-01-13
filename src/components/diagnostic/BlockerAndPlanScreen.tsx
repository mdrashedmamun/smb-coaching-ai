import { useState, useEffect } from 'react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { generateCoachResponse } from '../../lib/coachApi';
import { motion } from 'framer-motion';
import { Clock, Zap, Eye, Flame, Brain, ArrowRight, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import type { SoftBottleneck } from '../../lib/BottleneckEngine';

interface BlockerAndPlanScreenProps {
    onCommit: () => void;
}

export const BlockerAndPlanScreen = ({ onCommit }: BlockerAndPlanScreenProps) => {
    const { context, setGeneratedPlan, updateContext } = useBusinessStore();
    const { analysis, funnel, offer } = context;

    const [selectedBlocker, setSelectedBlocker] = useState<SoftBottleneck | null>(null);
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const blockers: { id: SoftBottleneck; label: string; icon: any; desc: string }[] = [
        { id: 'time', label: 'Time', icon: <Clock className="w-6 h-6" />, desc: "I don't have enough hours" },
        { id: 'energy', label: 'Energy', icon: <Zap className="w-6 h-6" />, desc: 'Burned out from delivery' },
        { id: 'attention', label: 'Attention', icon: <Eye className="w-6 h-6" />, desc: 'Client fires distract me' },
        { id: 'effort', label: 'Effort', icon: <Flame className="w-6 h-6" />, desc: "I know I should but don't" },
        { id: 'belief', label: 'Belief', icon: <Brain className="w-6 h-6" />, desc: "Doesn't work for my niche" }
    ];

    const handleBlockerSelect = async (blockerId: SoftBottleneck) => {
        setSelectedBlocker(blockerId);
        setIsLoading(true);

        // Save to store
        updateContext({
            leadAudit: {
                ...context.leadAudit,
                softBottleneck: blockerId
            }
        });

        // Generate Plan
        const text = await generateCoachResponse('blocker_plan', {
            bottleneck: analysis.bottleneck,
            blocker: blockerId,
            leads: funnel.leads,
            calls: funnel.calls,
            price: offer.price,
            margin: offer.margin
        });

        setPlan(text);

        // Parse the plan text into structured object for the store if possible, 
        // or just store the raw text. The store expects { headline, day1, day2, day3 }.
        // For this MVP, we will try to parse or just put the whole text in headline/day1 since the LLM format is text.
        // We'll simplisticly map it.

        setGeneratedPlan({
            headline: "Your Weekly Battle Plan",
            day1: text,
            day2: "See generated plan above.",
            day3: "See generated plan above.",
            createdAt: Date.now()
        });

        setIsLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8 min-h-[800px]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
            >
                {/* STEP 1: SELECT BLOCKER */}
                {!selectedBlocker && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                                <Lock className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400 text-sm font-medium">Internal Diagnostic</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Why aren't you following up?</h2>
                            <p className="text-gray-400">Be honest. Your answer helps us build the right plan.</p>
                        </div>

                        <div className="grid gap-4">
                            {blockers.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => handleBlockerSelect(b.id)}
                                    className="group flex items-start gap-4 p-5 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 transition-all text-left hover:bg-slate-750"
                                >
                                    <div className="p-3 bg-slate-700 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                                        {b.icon}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">{b.label}</div>
                                        <div className="text-slate-400">{b.desc}</div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-600 ml-auto self-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: PLAN DISPLAY */}
                {selectedBlocker && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Your 1-Week Action Plan</h2>
                            <p className="text-gray-400">
                                Tailored for <span className="text-white font-bold capitalize">{selectedBlocker}</span> + <span className="text-white font-bold capitalize">Follow-Up Volume</span>
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="p-12 border border-emerald-500/20 bg-emerald-900/10 rounded-2xl flex flex-col items-center justify-center gap-4 text-emerald-400 animate-pulse">
                                <RefreshCw className="w-8 h-8 animate-spin" />
                                <span className="font-mono text-sm uppercase tracking-widest">Generating tactical plan...</span>
                            </div>
                        ) : (
                            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Coach Approved</span>
                                    </div>

                                    <div className="text-emerald-100 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                        {plan}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => setSelectedBlocker(null)}
                                className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors text-sm uppercase tracking-wider"
                            >
                                Change Selection
                            </button>
                            <button
                                onClick={onCommit}
                                className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-emerald-900/20"
                            >
                                I'm Committed →
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};
