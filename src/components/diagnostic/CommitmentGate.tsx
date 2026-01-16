import React, { useState } from 'react';
import { useBusinessStore } from '../../store/useBusinessStore';
import type { PlanContext } from '../../lib/PlanGenerator';
import { generatePlan } from '../../lib/PlanGenerator';
import { getAdvisoryBlockState } from '../../lib/physicsState';
import { Shield, Mail, Lock, Users, ArrowRight, Clock, Zap, Eye, Flame, Brain } from 'lucide-react';
import type { BottleneckType, SoftBottleneck } from '../../lib/BottleneckEngine';

export interface CommitmentGateProps {
    bottleneck: BottleneckType;
    onComplete: () => void;
    onBlocked?: () => void;
}

export const CommitmentGate: React.FC<CommitmentGateProps> = ({ bottleneck, onComplete, onBlocked }) => {
    const { context, setCommitment, setGeneratedPlan } = useBusinessStore();

    const [email, setEmail] = useState('');
    // Default to 'time' or use the one from soft probe if available
    const [blocker, setBlocker] = useState<SoftBottleneck>(context.leadAudit.softBottleneck || 'time');
    const [observerEmail, setObserverEmail] = useState('');
    const [showObserver, setShowObserver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [planError, setPlanError] = useState<string | null>(null);

    const advisoryBlock = getAdvisoryBlockState(context);
    if (advisoryBlock.blocked) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-8 bg-amber-50 border-b border-amber-100 text-center">
                    <Lock className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-amber-900 mb-2">Run Scenario Only</h2>
                    <p className="text-amber-700">
                        {advisoryBlock.message} Advisory plans are disabled.
                    </p>
                </div>
                {onBlocked && (
                    <div className="p-6 flex justify-center">
                        <button
                            onClick={onBlocked}
                            className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            Back to Recap
                        </button>
                    </div>
                )}
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setPlanError(null);

        const aggregated = context.customFunnel?.aggregatedMetrics;
        if (!aggregated) return;

        // 2. Metrics for Reality Check (Data-Driven)
        const metricsWrapper = {
            leads: aggregated.totalResponses,
            calls: aggregated.totalCalls,
            closed: aggregated.totalClosed,
            price: context.segments[0]?.pricePoint || 3000,
            margin: context.offerCheck.grossMargin || 60,
        };

        // 3. Generate Plan
        const planCtx: PlanContext = {
            bottleneck,
            blocker,
            metrics: metricsWrapper
        };

        let plan;
        try {
            plan = generatePlan(planCtx);
        } catch (error) {
            setPlanError((error as Error).message);
            setIsSubmitting(false);
            return;
        }

        // 4. Save to Store
        setCommitment({
            email,
            blocker,
            observerEmail: showObserver ? observerEmail : undefined,
            committedAt: Date.now()
        });

        setGeneratedPlan({
            ...plan,
            createdAt: Date.now()
        });

        // 5. Simulate Network Delay for Effect
        setTimeout(() => {
            setIsSubmitting(false);
            onComplete();
        }, 800);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8 bg-slate-50 border-b border-slate-100 text-center">
                <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Unlock Your Battle Plan</h2>
                <p className="text-slate-600">
                    We've diagnosed the bottleneck. Now we need to know if you'll actually fix it.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">

                {/* Blocker Selection */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                        Data shows 90% of founders fail here. What's your biggest risk?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { id: 'time', label: 'Lack of Time', icon: <Clock className="w-5 h-5" /> },
                            { id: 'energy', label: 'Low Energy', icon: <Zap className="w-5 h-5" /> },
                            { id: 'attention', label: 'Distraction', icon: <Eye className="w-5 h-5" /> },
                            { id: 'effort', label: 'Resistance', icon: <Flame className="w-5 h-5" /> },
                            { id: 'belief', label: 'Not Sure', icon: <Brain className="w-5 h-5" /> }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => setBlocker(opt.id as SoftBottleneck)}
                                className={`p-4 rounded-lg border text-left flex items-center gap-3 transition-all ${blocker === opt.id
                                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 text-indigo-900'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                            >
                                <span className={blocker === opt.id ? 'text-indigo-600' : 'text-slate-400'}>{opt.icon}</span>
                                <span className="font-medium">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Where should we send the 3-Day Plan?
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="founder@company.com"
                        />
                    </div>
                </div>

                {/* Observer Mode (Optional) */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-slate-900">Accountability Partner (Optional)</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Founders with an observer are 3x more likely to hit revenue goals.
                            </p>

                            {!showObserver ? (
                                <button
                                    type="button"
                                    onClick={() => setShowObserver(true)}
                                    className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-700 underline"
                                >
                                    + Add an Observer (Coach/Co-founder)
                                </button>
                            ) : (
                                <div className="mt-3">
                                    <input
                                        type="email"
                                        value={observerEmail}
                                        onChange={(e) => setObserverEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        placeholder="partner@email.com"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-lg transition-colors disabled:opacity-75 disabled:cursor-wait shadow-lg"
                >
                    {isSubmitting ? (
                        <span>Generating custom plan...</span>
                    ) : (
                        <>
                            <Lock className="w-5 h-5" />
                            <span>Unlock My 3-Day Plan</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>

                <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Your data is secure. No spam, ever.</span>
                </p>
                {planError && (
                    <p className="text-xs text-center text-amber-600">{planError}</p>
                )}

            </form>
        </div>
    );
};
