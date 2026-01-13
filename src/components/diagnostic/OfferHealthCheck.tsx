import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { AdaptiveInput } from '../shared/AdaptiveInput';
import { COPY } from '../../lib/copy';
import { useBusinessStore } from '../../store/useBusinessStore';

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
    onWarn: () => void;
    onFail: (reason: Phase0Verdict, closeRate: number, margin: number) => void;
}

const getVerdict = (closeRate: number, margin: number): Phase0Verdict => {
    const failClose = closeRate < 30;
    const failMargin = margin < 80;

    if (failClose && failMargin) return 'fail_both';
    if (failClose) return 'fail_close_rate';
    if (failMargin) return 'fail_margin';
    if (closeRate >= 60) return 'warn_underpriced';
    return 'pass';
};

const getPriceSignal = (closeRate: number): string | null => {
    if (closeRate >= 80) return 'underpriced by 3-4x';
    if (closeRate >= 60) return 'underpriced by 2-3x';
    if (closeRate >= 50) return 'possibly underpriced by 1.5-2x';
    return null;
};

export const OfferHealthCheck = ({ onPass, onWarn, onFail }: OfferHealthCheckProps) => {
    const [step, setStep] = useState<'closeRate' | 'grossMargin' | 'verdict'>('closeRate');
    const [closeRate, setCloseRate] = useState<number | ''>('');
    const [margin, setMargin] = useState<number | ''>('');
    const [verdict, setVerdict] = useState<Phase0Verdict | null>(null);

    const handleNext = () => {
        if (step === 'closeRate' && closeRate !== '') {
            setStep('grossMargin');
        } else if (step === 'grossMargin' && margin !== '') {
            const cr = Number(closeRate);
            const m = Number(margin);
            const v = getVerdict(cr, m);
            setVerdict(v);
            setStep('verdict');

            // Log logic
            console.log('[Phase0] Verdict:', v, { closeRate: cr, margin: m });
        }
    };

    const isFail = verdict?.startsWith('fail');
    const priceSignal = getPriceSignal(Number(closeRate));

    // Stage 0 Bypass Logic
    const updateContext = useBusinessStore((state) => state.updateContext);

    const handlePreRevenue = () => {
        console.log('[Phase0] User is Pre-Revenue (Stage 0). Bypassing stats check.');
        updateContext({ isPreRevenue: true });
        setCloseRate(0);
        setMargin(100); // Theoretical max for services
        setVerdict('pass');
        setStep('verdict');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">
            <AnimatePresence mode="wait">

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
                            onChange={(val) => {
                                setCloseRate(val);
                                // Auto-advance if direct input is complete (optional, mostly rely on button)
                            }}
                            mode="percentage"
                            placeholders={{
                                input: "35",
                                iKnow: COPY.closeRate.iKnow,
                                iDontKnow: COPY.closeRate.iDontKnow,
                                napkin: {
                                    prompt: COPY.closeRate.napkinPrompt,
                                    input1: COPY.closeRate.napkinQuestion
                                },
                                resultTemplate: COPY.closeRate.result,
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
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-8"
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
                            mode="money_margin"
                            placeholders={{
                                input: "85",
                                iKnow: COPY.grossMargin.iKnow,
                                iDontKnow: COPY.grossMargin.iDontKnow,
                                napkin: {
                                    prompt: COPY.grossMargin.napkinPrompt,
                                    input1: COPY.grossMargin.chargePrompt,
                                    input2: COPY.grossMargin.costPrompt
                                },
                                resultTemplate: COPY.grossMargin.result,
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
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-8"
                            >
                                Check Offer Health <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* Step 3: Verdict (Existing Logic, Updated Copy) */}
                {step === 'verdict' && (
                    <motion.div
                        key="verdict"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8 text-center"
                    >
                        {isFail ? (
                            <div className="space-y-6">
                                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto ring-4 ring-red-500/20">
                                    <XCircle className="w-12 h-12 text-red-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">{COPY.verdict.fail.headline}</h2>
                                <p className="text-xl text-gray-300 whitespace-pre-line">{COPY.verdict.fail.body}</p>

                                <div className="space-y-3 pt-4">
                                    <button
                                        onClick={() => onFail(verdict, Number(closeRate), Number(margin))}
                                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
                                    >
                                        {COPY.verdict.fail.cta}
                                    </button>
                                    <button
                                        onClick={onPass} // Temporary override for testing, usually this passes to fail screen which HAS the override
                                        className="text-sm text-gray-500 hover:text-gray-300 underline underline-offset-4"
                                    >
                                        {COPY.verdict.fail.secondary}
                                    </button>
                                </div>
                            </div>
                        ) : verdict === 'warn_underpriced' ? (
                            <div className="space-y-6">
                                <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto ring-4 ring-amber-500/20">
                                    <AlertTriangle className="w-12 h-12 text-amber-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">{COPY.verdict.warn.headline}</h2>
                                <p className="text-xl text-gray-300 whitespace-pre-line">{COPY.verdict.warn.body}</p>
                                <p className="text-amber-400 font-bold">Signal: {priceSignal}</p>

                                <button
                                    onClick={onWarn}
                                    className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg mt-4"
                                >
                                    {COPY.verdict.warn.cta}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto ring-4 ring-green-500/20">
                                    {Number(closeRate) === 0 ? <Sparkles className="w-12 h-12 text-green-500" /> : <CheckCircle className="w-12 h-12 text-green-500" />}
                                </div>
                                <h2 className="text-3xl font-bold text-white">
                                    {Number(closeRate) === 0 ? "You're ready to launch." : COPY.verdict.pass.headline}
                                </h2>
                                <p className="text-xl text-gray-300 whitespace-pre-line">
                                    {Number(closeRate) === 0
                                        ? "Since you're pre-revenue, we can't judge your stats yet. The most important thing now is to GET DATA.\n\nLet's build your lead machine and get your first clients."
                                        : COPY.verdict.pass.body}
                                </p>

                                <button
                                    onClick={onPass}
                                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg mt-4"
                                >
                                    {Number(closeRate) === 0 ? "Start Building Lead Machine" : COPY.verdict.pass.cta} <ArrowRight className="w-5 h-5 inline-block ml-2" />
                                </button>
                            </div>
                        )}

                        {/* Stats Summary - Hide for Pre-Revenue */}
                        {Number(closeRate) !== 0 && (
                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Close Rate</div>
                                    <div className={`text-2xl font-mono font-bold ${Number(closeRate) < 30 ? 'text-red-400' : 'text-green-400'}`}>
                                        {closeRate}%
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Margin</div>
                                    <div className={`text-2xl font-mono font-bold ${Number(margin) < 80 ? 'text-red-400' : 'text-green-400'}`}>
                                        {margin}%
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
