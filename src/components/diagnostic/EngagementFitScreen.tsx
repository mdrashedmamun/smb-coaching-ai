/**
 * EngagementFitScreen.tsx
 * 
 * Phase 0: Hard gate for Consulting vs Simulation mode.
 * 
 * UI Pattern: Guided conversation
 * - One decision per screen
 * - Lead with conclusions
 * - Assumptions visible by default
 * - Business-language failures
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, BarChart3, ArrowRight, Info } from 'lucide-react';
import {
    evaluateEngagementFit,
    getEngagementResultMessage,
    PRICE_THRESHOLD,
    type EngagementFitResult
} from '../../lib/EngagementFitGate';
import { useBusinessStore } from '../../store/useBusinessStore';

type SalesMotion = 'consultative' | 'transactional' | 'self_serve';

interface EngagementFitScreenProps {
    onComplete: (result: EngagementFitResult) => void;
}

type Step = 'price' | 'motion' | 'result';

export const EngagementFitScreen = ({ onComplete }: EngagementFitScreenProps) => {
    const [step, setStep] = useState<Step>('price');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [salesMotion, setSalesMotion] = useState<SalesMotion | null>(null);
    const [result, setResult] = useState<EngagementFitResult | null>(null);

    const { setOperatingMode, setSimulationMode, setPhysicsPhase } = useBusinessStore();

    const handlePriceSubmit = () => {
        if (minPrice !== '' && minPrice > 0) {
            setStep('motion');
        }
    };

    const handleMotionSelect = (selectedMotion: SalesMotion) => {
        setSalesMotion(selectedMotion);

        // Evaluate the gate
        const evaluationResult = evaluateEngagementFit({
            minOfferPrice: Number(minPrice),
            salesMotion: selectedMotion
        });

        setResult(evaluationResult);

        // Save to store
        setOperatingMode({
            mode: evaluationResult.mode,
            qualified: evaluationResult.qualified,
            reason: evaluationResult.reason,
            timestamp: Date.now()
        });
        setSimulationMode(evaluationResult.mode === 'simulation');
        setPhysicsPhase('phase0', {
            status: evaluationResult.qualified ? 'pass' : 'fail',
            assumed: false,
            missing: false,
            blockers: evaluationResult.reason ? [evaluationResult.reason] : []
        });

        setStep('result');
    };

    const handleComplete = () => {
        if (result) {
            onComplete(result);
        }
    };

    const slideVariants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {/* Step 1: Price Check */}
                {step === 'price' && (
                    <motion.div
                        key="price"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">
                                Let's see if we're the right fit.
                            </h1>
                            <p className="text-xl text-gray-300">
                                What's the minimum someone pays to work with you?
                            </p>
                        </div>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                                placeholder="5000"
                                className="w-full pl-10 pr-4 py-4 text-2xl bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Assumption visibility */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-300">
                                <p className="font-medium text-gray-200 mb-1">Why we ask this</p>
                                <p>This system is calibrated for high-ticket businesses (${PRICE_THRESHOLD.toLocaleString()}+).
                                    Lower-ticket businesses can still use the math, but won't receive strategic advice.</p>
                            </div>
                        </div>

                        {minPrice !== '' && minPrice > 0 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handlePriceSubmit}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* Step 2: Sales Motion */}
                {step === 'motion' && (
                    <motion.div
                        key="motion"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">
                                How do your clients typically decide?
                            </h1>
                            <p className="text-xl text-gray-300">
                                Pick the option that best describes your sales process.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => handleMotionSelect('consultative')}
                                className="w-full p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">💬</span>
                                    <div>
                                        <p className="text-lg font-bold text-white group-hover:text-indigo-400">
                                            Through a conversation with me
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Discovery calls, proposals, consultations
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleMotionSelect('transactional')}
                                className="w-full p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl text-left transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">⚡</span>
                                    <div>
                                        <p className="text-lg font-bold text-white group-hover:text-gray-300">
                                            Quick checkout, low consideration
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Impulse buys, simple transactions
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleMotionSelect('self_serve')}
                                className="w-full p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl text-left transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">🛒</span>
                                    <div>
                                        <p className="text-lg font-bold text-white group-hover:text-gray-300">
                                            They buy online without talking
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            E-commerce, self-serve checkout
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Assumption visibility */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-300">
                                <p>Your price: <span className="font-mono text-white">${Number(minPrice).toLocaleString()}</span></p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Result (Conclusion First) */}
                {step === 'result' && result && (
                    <motion.div
                        key="result"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8"
                    >
                        {(() => {
                            const message = getEngagementResultMessage(result);
                            return (
                                <>
                                    {/* Verdict Icon */}
                                    <div className="text-center">
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${result.qualified
                                                ? 'bg-emerald-500/20 ring-4 ring-emerald-500/30'
                                                : 'bg-blue-500/20 ring-4 ring-blue-500/30'
                                            }`}>
                                            {result.qualified ? (
                                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                                            ) : (
                                                <BarChart3 className="w-10 h-10 text-blue-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Conclusion First */}
                                    <div className="text-center space-y-4">
                                        <h1 className="text-3xl font-bold text-white">
                                            {message.headline}
                                        </h1>
                                        <p className="text-xl text-gray-300 max-w-lg mx-auto">
                                            {message.body}
                                        </p>
                                    </div>

                                    {/* Capabilities */}
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                            What you'll get
                                        </p>
                                        <div className="space-y-2">
                                            {message.capabilities.available.map((cap, i) => (
                                                <div key={i} className="flex items-center gap-3 text-gray-300">
                                                    <span className="text-emerald-400">✓</span>
                                                    <span>{cap}</span>
                                                </div>
                                            ))}
                                            {message.capabilities.unavailable.map((cap, i) => (
                                                <div key={i} className="flex items-center gap-3 text-gray-500">
                                                    <span className="text-gray-600">✗</span>
                                                    <span>{cap}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Assumptions visible */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-400 mb-2">Based on:</p>
                                        <div className="space-y-1 text-sm text-gray-300">
                                            <p>• Your price: <span className="font-mono text-white">${Number(minPrice).toLocaleString()}</span> {Number(minPrice) >= PRICE_THRESHOLD ? '✓' : `(below $${PRICE_THRESHOLD.toLocaleString()})`}</p>
                                            <p>• Sales motion: <span className="text-white capitalize">{salesMotion?.replace('_', ' ')}</span></p>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={handleComplete}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${result.qualified
                                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                                            }`}
                                    >
                                        {result.qualified ? "Let's map your offers" : "Continue in Simulation Mode"}
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
