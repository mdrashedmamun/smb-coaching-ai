import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight, Sparkles, DollarSign as DollarIcon, TrendingUp, Plus } from 'lucide-react';
import { AdaptiveInput } from '../shared/AdaptiveInput';
import { COPY } from '../../lib/copy';
import { useBusinessStore } from '../../store/useBusinessStore';
import { evaluateMarginHealth, MARGIN_TIERS } from '../../lib/BottleneckEngine';
import { generateMarginCopy } from '../../lib/OfferCopyGenerator';

export type Phase0Verdict =
    | 'pass'
    | 'fail_close_rate'
    | 'fail_margin'
    | 'fail_both'
    | 'warn_underpriced'
    | 'fail_uesa'
    | 'fail_target'
    | 'fail_filters';

interface OfferHealthCheckProps {
    onPass: () => void;
    onFail: (reason: Phase0Verdict, closeRate?: number, margin?: number) => void;
    onBuilderMode: () => void;
}

const getVerdict = (closeRate: number, margin: number): Phase0Verdict => {
    const failClose = closeRate < 30;
    const failMargin = margin < 60; // Lowered from 80% to 60% per instructions

    if (failClose && failMargin) return 'fail_both';
    if (failClose) return 'fail_close_rate';
    if (failMargin) return 'fail_margin';
    if (closeRate >= 60) return 'warn_underpriced';
    return 'pass';
};

export const OfferHealthCheck = ({ offerId, onPass, onFail, onBuilderMode }: Omit<OfferHealthCheckProps, 'onWarn'>) => {
    const [step, setStep] = useState<'price' | 'closeRate' | 'grossMargin' | 'verdict'>('price');
    const [price, setPrice] = useState<number | ''>('');
    const [closeRate, setCloseRate] = useState<number | ''>('');
    const [margin, setMargin] = useState<number | ''>('');
    const [verdict, setVerdict] = useState<Phase0Verdict | null>(null);

    const { context, updateContext, updateOffer } = useBusinessStore();

    // Phase 1: Auto-fill from Offer Inventory if ID provided
    useEffect(() => {
        const targetId = offerId || context.primaryOfferId;
        if (targetId) {
            const offer = context.offers.find(o => o.id === targetId);
            if (offer) {
                setPrice(offer.price);
                // If we had stored close rate/margin on the offer object, we'd pre-fill here too
            }
        }
    }, [offerId, context.offers, context.primaryOfferId]);

    const handleNext = () => {
        if (step === 'price' && price !== '') {
            setStep('closeRate');
        } else if (step === 'closeRate' && closeRate !== '') {
            setStep('grossMargin');
        } else if (step === 'grossMargin' && margin !== '') {
            const cr = Number(closeRate);
            const m = Number(margin);
            const v = getVerdict(cr, m);
            setVerdict(v);
            setStep('verdict');

            // Phase 1: Update specific offer if context exists
            const targetId = offerId || context.primaryOfferId;
            if (targetId) {
                updateOffer(targetId, {
                    price: Number(price)
                    // We could extend the offer object to store health metrics if needed
                });
            }

            // Save to store (global context for backward compatibility)
            updateContext({
                pricePoint: Number(price),
                offerCheck: {
                    ...useBusinessStore.getState().context.offerCheck,
                    closeRate: cr,
                    grossMargin: m,
                    verdict: v as any,
                }
            });

            console.log('[Phase0] Verdict:', v, { price, closeRate: cr, margin: m });
        }
    };

    const handlePreRevenue = () => {
        console.log('[Phase0] User is Pre-Revenue (Stage 0). Bypassing stats check.');
        updateContext({ isPreRevenue: true });
        setPrice(price || 0);
        setCloseRate(0);
        setMargin(100);
        setVerdict('pass');
        setStep('verdict');
    };

    const marginHealth = margin !== '' ? evaluateMarginHealth(Number(margin)) : null;
    const offerCopy = (price !== '' && margin !== '' && closeRate !== '')
        ? generateMarginCopy({ price: Number(price), margin: Number(margin), closeRate: Number(closeRate) })
        : null;

    const canProceed = Number(margin) >= 60;
    const isSimulation = context.isSimulationMode;

    return (
        <div className="max-w-2xl mx-auto p-6 text-white min-h-[700px] flex flex-col justify-center">
            {isSimulation && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                        <p className="text-amber-900 font-medium">Simulation Mode Active</p>
                        <p className="text-amber-700 text-sm">We are running a physics simulation. Consulting algorithms are disabled.</p>
                    </div>
                </div>
            )}
            <AnimatePresence mode="wait">
                {/* Step 0: Price */}
                {step === 'price' && (
                    <motion.div
                        key="price"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">What is the price of this offer?</h2>
                            <p className="text-xl text-gray-300">Confirming the price point for: <span className="text-indigo-400 font-bold">{context.offers.find(o => o.id === (offerId || context.primaryOfferId))?.name || 'Your Offer'}</span></p>
                        </div>

                        <AdaptiveInput
                            value={price}
                            onChange={setPrice}
                            mode="money"
                            placeholders={{
                                input: "5000",
                                iKnow: "I have a fixed price",
                                iDontKnow: "It varies by project",
                                napkin: {
                                    input2: "Total clients last 3 months"
                                },
                                resultTemplate: (val) => `Price: $${val.toLocaleString()}`,
                                tooltip: "We use this to calculate your profit potential."
                            }}
                        />

                        {price !== '' && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleNext}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-8"
                            >
                                Next Step <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* Step 1: Close Rate */}
                {step === 'closeRate' && (
                    <motion.div
                        key="closeRate"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">{COPY.closeRate.headline}</h2>
                            <p className="text-xl text-gray-300">{COPY.closeRate.body}</p>
                        </div>

                        <AdaptiveInput
                            value={closeRate}
                            onChange={setCloseRate}
                            mode="percentage"
                            placeholders={{
                                input: "35",
                                iKnow: COPY.closeRate.iKnow,
                                iDontKnow: COPY.closeRate.iDontKnow,
                                napkin: {
                                    prompt: COPY.closeRate.napkinPrompt,
                                    input1: COPY.closeRate.napkinQuestion
                                },
                                resultTemplate: (val) => `${val}%`,
                                tooltip: COPY.closeRate.tooltip
                            }}
                            secondaryAction={{
                                label: "I haven't sold anything yet",
                                description: "Bypass sales metrics and start building your lead engine.",
                                icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
                                onClick: handlePreRevenue
                            }}
                        />

                        {closeRate !== '' && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleNext}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-8"
                            >
                                Next Step <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* Step 2: Gross Margin */}
                {step === 'grossMargin' && (
                    <motion.div
                        key="grossMargin"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">{COPY.grossMargin.headline}</h2>
                            <p className="text-xl text-gray-300">{COPY.grossMargin.body}</p>
                        </div>

                        <AdaptiveInput
                            value={margin}
                            onChange={setMargin}
                            mode="percentage"
                            placeholders={{
                                input: "85",
                                iKnow: COPY.grossMargin.iKnow,
                                iDontKnow: COPY.grossMargin.iDontKnow,
                                napkin: {
                                    prompt: COPY.grossMargin.napkinPrompt,
                                    input1: COPY.grossMargin.chargePrompt,
                                    input2: COPY.grossMargin.costPrompt
                                },
                                resultTemplate: (val) => `${val}%`,
                                tooltip: COPY.grossMargin.tooltip
                            }}
                            secondaryAction={{
                                label: "I haven't sold anything yet",
                                description: "Since I have no sales, I have no delivery metrics to check.",
                                icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
                                onClick: handlePreRevenue
                            }}
                        />

                        {margin !== '' && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleNext}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-8"
                            >
                                Check Offer Health <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* Step 3: Verdict (Refactored per Reviewer Feedback) */}
                {step === 'verdict' && offerCopy && marginHealth && (
                    <motion.div
                        key="verdict"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        {/* Status Icon + Headline */}
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-slate-800 ring-4 ring-slate-700/50">
                                {canProceed ? (
                                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                                ) : (
                                    <AlertTriangle className="w-10 h-10 text-amber-400" />
                                )}
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
                                {offerCopy.headline}
                            </h1>
                        </div>

                        {/* Margin Tier Breakdown */}
                        <div className="grid grid-cols-4 gap-2 md:gap-3">
                            {Object.entries(MARGIN_TIERS).map(([key, tier]) => (
                                <div
                                    key={key}
                                    className={`p-3 rounded-xl text-center border transition-all ${marginHealth.label === tier.label
                                        ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                        : 'bg-slate-900/40 border-slate-800 opacity-40'
                                        }`}
                                >
                                    <div className={`text-[10px] uppercase tracking-wider font-bold ${marginHealth.label === tier.label ? 'text-indigo-400' : 'text-slate-500'
                                        }`}>
                                        {tier.label}
                                    </div>
                                    <div className="text-xs mt-1 font-mono text-slate-300">
                                        {tier.min}-{tier.max}%
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Your Specific Numbers */}
                        <div className="bg-slate-900 shadow-xl border border-slate-800 p-6 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-indigo-400" />
                                Your Offer Physics
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Average Price:</span>
                                    <span className="font-bold text-white font-mono text-lg">${Number(price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Current Margin:</span>
                                    <span className={`font-bold font-mono text-lg ${canProceed ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {margin}%
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-slate-800 flex justify-between items-center group">
                                    <span className="text-slate-200 font-semibold">Profit per Client:</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-emerald-400 font-mono flex items-center gap-1 justify-end">
                                            <DollarIcon className="w-5 h-5" />
                                            {offerCopy.profitPerClient.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status & Next Step */}
                        <div className={`p-6 rounded-2xl border flex gap-4 items-start ${canProceed
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100'
                            : 'bg-red-500/10 border-red-500/20 text-red-100'
                            }`}>
                            <div className={`p-2 rounded-lg ${canProceed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                {canProceed ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="font-bold text-lg mb-1">Status: {offerCopy.status}</div>
                                <div className="text-sm opacity-90 leading-relaxed font-medium">{offerCopy.nextStep}</div>
                            </div>
                        </div>

                        {/* CTA */}
                        {canProceed ? (
                            <button
                                onClick={onPass}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
                            >
                                Continue to Lead Audit <ArrowRight className="w-6 h-6" />
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <button
                                    onClick={() => onFail(verdict || 'fail_margin', Number(closeRate), Number(margin))}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-bold text-xl shadow-lg transition-all"
                                >
                                    Fix My Offer (Recommended)
                                </button>

                                {/* Phase 1: Graceful Escape Hatch */}
                                {onBuilderMode && (
                                    <button
                                        onClick={onBuilderMode}
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Design a New Offer
                                    </button>
                                )}

                                <button
                                    onClick={onPass}
                                    className="w-full text-slate-500 hover:text-slate-300 text-sm font-medium underline underline-offset-4 bg-transparent border-none py-2"
                                >
                                    Audit Anyway (Not Recommended)
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

