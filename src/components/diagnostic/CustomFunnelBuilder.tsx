import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { FunnelStepInput } from './FunnelStepInput';
import { aggregateFunnelMetrics } from '../../lib/funnelMapping';

interface CustomFunnelBuilderProps {
    onComplete: () => void;
}

export const CustomFunnelBuilder: React.FC<CustomFunnelBuilderProps> = ({ onComplete }) => {
    const updateContext = useBusinessStore((state) => state.updateContext);
    const existingFunnel = useBusinessStore((state) => state.context.customFunnel);

    const [steps, setSteps] = useState<Array<{ id: string; stepType: string; quantity: number }>>(
        existingFunnel?.steps || [
            { id: '1', stepType: 'cold_email', quantity: 0 },
            { id: '2', stepType: 'sales_call', quantity: 0 },
            { id: '3', stepType: 'closed_deal', quantity: 0 }
        ]
    );

    const [error, setError] = useState<string | null>(null);

    // Auto-save whenever steps change
    useEffect(() => {
        const aggregated = aggregateFunnelMetrics(steps);
        updateContext({
            customFunnel: {
                timeframeDays: 30,
                steps: steps.map(({ id, stepType, quantity }) => ({
                    id,
                    stepType,
                    quantity,
                    canonicalMetric: '' // Computed on server or derive if needed, but aggregated does the heavy lifting
                })),
                aggregatedMetrics: aggregated
            }
        });

        // Clear error if valid
        if (steps.some(s => s.quantity > 0) && error) {
            setError(null);
        }
    }, [steps, updateContext, error]); // Added error to dependency array to satisfy exhaustive-deps, though logic handles it.

    const handleAddStep = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setSteps([...steps, { id: newId, stepType: '', quantity: 0 }]);
    };

    const handleUpdateStep = (id: string, updates: { stepType?: string; quantity?: number }) => {
        setSteps(steps.map(step => step.id === id ? { ...step, ...updates } : step));
    };

    const handleRemoveStep = (id: string) => {
        if (steps.length <= 1) return; // Prevent deleting last step
        setSteps(steps.filter(step => step.id !== id));
    };

    const handleAnalyze = () => {
        // Basic Validation
        // const hasAnyVolume = steps.some(s => s.quantity > 0);
        const hasStepTypes = steps.every(s => s.stepType !== '');

        if (!hasStepTypes) {
            setError("Please select a valid type for all steps.");
            return;
        }

        // We allow 0 volume (it's a valid finding: "You did nothing"), but let's confirm they didn't just forget.
        // Actually, "Outreach = 0" is a key diagnostic result. We should NOT block it.
        // But if *everything* is 0, they might have skipped it. 
        // Let's proceed even if 0, the engine handles it.

        onComplete();
    };

    const aggregated = aggregateFunnelMetrics(steps);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Lead Funnel Audit
                </h2>
                <p className="text-slate-400">
                    How did you get clients in the <span className="text-slate-200 font-medium">last 30 days</span>?
                    Tell us your process step-by-step.
                </p>
            </div>

            <div className="space-y-3">
                {steps.map((step) => (
                    <FunnelStepInput
                        key={step.id}
                        id={step.id}
                        stepType={step.stepType}
                        quantity={step.quantity}
                        onUpdate={handleUpdateStep}
                        onRemove={handleRemoveStep}
                    />
                ))}

                <button
                    onClick={handleAddStep}
                    className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Plus size={16} />
                    Add Funnel Step
                </button>
            </div>

            {/* Live Summary Bar */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Outreach</div>
                    <div className="text-xl font-mono text-indigo-400">
                        {aggregated.totalOutreach}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sales Calls</div>
                    <div className="text-xl font-mono text-amber-400">
                        {aggregated.totalCalls}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Closed</div>
                    <div className="text-xl font-mono text-emerald-400">
                        {aggregated.totalClosed}
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-center gap-2 text-rose-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <button
                onClick={handleAnalyze}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 group"
            >
                <span>Analyze My Funnel</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};
