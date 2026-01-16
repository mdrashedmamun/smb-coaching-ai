import { useState } from 'react';
import { evaluateEngagementFit, type GateCriteria } from '../../lib/OutcomeGateScoring';
import { ArrowRight, CheckCircle2, ShieldCheck, FlaskConical } from 'lucide-react';
import { useBusinessStore } from '../../store/useBusinessStore';

interface EngagementFitCheckProps {
    onComplete: (isQualified: boolean) => void;
}

export const EngagementFitCheck = ({ onComplete }: EngagementFitCheckProps) => {
    const [step, setStep] = useState(0);
    const [priceInput, setPriceInput] = useState('');
    const [criteria, setCriteria] = useState<GateCriteria>({
        pricePoint: 0,
        salesMotion: 'unknown',
        buyerType: 'business_owner'
    });
    const [result, setResult] = useState<{ isQualified: boolean; mode: string; reasons: string[]; softRampMessage?: string } | null>(null);

    const setSimulationMode = useBusinessStore((state) => state.setSimulationMode);
    const setOperatingMode = useBusinessStore((state) => state.setOperatingMode);
    const setPhysicsPhase = useBusinessStore((state) => state.setPhysicsPhase);

    const handlePriceSubmit = (price: number) => {
        setCriteria(prev => ({ ...prev, pricePoint: price }));
        setStep(1);
    };

    const handleMotionSubmit = (motion: GateCriteria['salesMotion']) => {
        setCriteria(prev => ({ ...prev, salesMotion: motion }));
        setStep(2);
    };

    const handleBuyerSubmit = (buyer: GateCriteria['buyerType']) => {
        const finalCriteria = { ...criteria, buyerType: buyer };
        setCriteria(finalCriteria);

        // Evaluate
        const evaluation = evaluateEngagementFit(finalCriteria);
        setResult(evaluation);
        setStep(3); // Result Screen

        // Store State (mode is now 'lab' not 'simulation')
        const isSimulation = evaluation.mode === 'lab';
        const failReason = evaluation.isQualified
            ? null
            : (finalCriteria.pricePoint < 3000 ? 'price_below_threshold' : 'non_consultative_motion');
        const timestamp = Date.now();
        setSimulationMode(isSimulation);
        setOperatingMode({
            mode: isSimulation ? 'simulation' : 'consulting',
            qualified: evaluation.isQualified,
            reason: failReason,
            timestamp
        });
        setPhysicsPhase('phase0', {
            status: evaluation.isQualified ? 'pass' : 'fail',
            assumed: false,
            missing: false,
            blockers: evaluation.reasons
        });
    };

    const handleProceed = () => {
        if (result) {
            onComplete(result.isQualified);
        }
    };

    // Step 0: Price Point
    if (step === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">Engagement Fit Check</h2>
                    <p className="text-lg text-slate-600">
                        To ensure our algorithms provide accurate "Consulting-Grade" advice, we need to verify your business model physics.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
                    <label className="block text-sm font-medium text-slate-700">
                        What is the average Lifetime Value (LTV) or Contract Value of your primary offer?
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                            type="number"
                            value={priceInput}
                            onChange={(event) => setPriceInput(event.target.value)}
                            placeholder="10000"
                            className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handlePriceSubmit(parseInt(priceInput) || 0);
                                }
                            }}
                        />
                    </div>
                    <button
                        onClick={() => {
                            handlePriceSubmit(parseInt(priceInput) || 0);
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        Next <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    // Step 1: Sales Motion
    if (step === 1) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">How do you sell?</h2>
                    <p className="text-lg text-slate-600">
                        Our AI models are optimized for specific sales motions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleMotionSubmit('consultative')}
                        className="p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left space-y-2 group"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">Consultative / High-Touch</span>
                            <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <p className="text-sm text-slate-500">Sales calls, proposals, discovery meetings. You diagnose before you prescribe.</p>
                    </button>

                    <button
                        onClick={() => handleMotionSubmit('transactional')}
                        className="p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left space-y-2 group"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">Transactional / Productized</span>
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500" />
                        </div>
                        <p className="text-sm text-slate-500">Checkout pages, "Buy Now" buttons, low-touch volume sales.</p>
                    </button>
                </div>
            </div>
        );
    }

    // Step 2: Buyer Type
    if (step === 2) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">Who signs the check?</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { id: 'business_owner', label: 'Business Owner / Founder', desc: 'Fast decisions, vision-driven.' },
                        { id: 'department_head', label: 'Department Head / VP', desc: 'Budget-driven, requires internal approval.' },
                        { id: 'consumer', label: 'Consumer / End User', desc: 'Personal fund usage, emotional drivers.' }
                    ].map((buyer) => (
                        <button
                            key={buyer.id}
                            onClick={() => handleBuyerSubmit(buyer.id as any)}
                            className="p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left flex items-center justify-between group"
                        >
                            <div>
                                <h3 className="font-semibold text-slate-900">{buyer.label}</h3>
                                <p className="text-sm text-slate-500">{buyer.desc}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Step 3: Result (Pass/Fail)
    if (step === 3 && result) {
        const isPass = result.isQualified;

        return (
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className={`h-2 ${isPass ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${isPass ? 'bg-emerald-100' : 'bg-indigo-100'}`}>
                                {isPass ? (
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                ) : (
                                    <FlaskConical className="w-8 h-8 text-indigo-600" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {isPass ? 'Engagement Fit Confirmed' : 'Welcome to the Consulting Lab'}
                                </h2>
                                <p className="text-slate-600 font-medium">
                                    {isPass
                                        ? 'You qualify for the Consulting Operating System.'
                                        : 'Where high-ticket consulting businesses are engineered.'}
                                </p>
                            </div>
                        </div>

                        {!isPass && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                                <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Why Scenario Mode?
                                </h3>
                                <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                                    {result.reasons.map((reason, idx) => (
                                        <li key={idx}>{reason}</li>
                                    ))}
                                </ul>
                                {result.softRampMessage && (
                                    <p className="text-sm font-medium text-amber-900 pt-2 border-t border-amber-200 mt-2">
                                        💡 {result.softRampMessage}
                                    </p>
                                )}
                            </div>
                        )}

                        {isPass && (
                            <div className="text-slate-600">
                                <p>
                                    Your business metrics align with our high-ticket consulting models.
                                    We have unlocked the full advisory suite including the <strong>Bottleneck Engine</strong> and <strong>Plan Generator</strong>.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleProceed}
                            className={`w-full py-4 text-lg font-bold text-white rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] ${isPass
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                }`}
                        >
                            {isPass ? 'Enter Consulting OS' : 'Enter Consulting Lab'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
