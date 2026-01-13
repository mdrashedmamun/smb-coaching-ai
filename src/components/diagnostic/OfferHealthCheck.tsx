import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, ArrowRight } from 'lucide-react';

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
    const [step, setStep] = useState<'input' | 'verdict'>('input');
    const [closeRate, setCloseRate] = useState<string>('');
    const [margin, setMargin] = useState<string>('');
    const [calibration, setCalibration] = useState<string | null>(null);
    const [showCalibrationMismatch, setShowCalibrationMismatch] = useState(false);
    const [verdict, setVerdict] = useState<Phase0Verdict | null>(null);

    // Calibration check: if they select a different range than entered
    const checkCalibration = (entered: number, selected: string | null): boolean => {
        if (!selected) return true; // No calibration selected, skip
        const ranges: Record<string, [number, number]> = {
            '0-1': [0, 20],
            '2': [30, 50],
            '3': [50, 70],
            '4-5': [70, 100]
        };
        const range = ranges[selected];
        if (!range) return true;
        return entered >= range[0] && entered <= range[1];
    };

    const handleSubmit = () => {
        const cr = Number(closeRate);
        const m = Number(margin);

        if (isNaN(cr) || isNaN(m)) return;

        const v = getVerdict(cr, m);
        if (v === 'warn_underpriced') {
            onWarn();
            return;
        }

        if (v.startsWith('fail')) {
            onFail(v, cr, m);
            return;
        }

        setVerdict(v);
        setStep('verdict');

        // Log for analytics (placeholder - replace with actual analytics)
        console.log('[Phase0] Verdict:', v, { closeRate: cr, margin: m });
    };

    const isFail = verdict?.startsWith('fail');
    const priceSignal = getPriceSignal(Number(closeRate));

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[700px]">
            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-10"
                    >
                        {/* Header */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                                <TrendingUp className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400 text-sm font-medium">Phase 0: Offer Health Check</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                Before we audit your leads...
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl mx-auto">
                                We need to verify your offer is sellable. If it's not, more leads won't help.
                            </p>
                        </div>

                        {/* Warning */}
                        <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                            <div className="text-sm text-red-200">
                                <span className="font-bold">This only works if you're brutally honest.</span>
                                <br />
                                Vanity metrics here will give you a false diagnosis later.
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        What's your close rate on sales calls?
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Of the last 10 sales calls, how many became paying clients?
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={closeRate}
                                            onChange={(e) => setCloseRate(e.target.value)}
                                            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none text-2xl font-mono pr-12"
                                            placeholder="35"
                                            min="0"
                                            max="100"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">%</span>
                                    </div>

                                    {/* Optional Calibration - only show if they entered a value */}
                                    {closeRate && (
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <p className="text-xs text-gray-500 mb-2">
                                                Quick check: Of your last 5 sales calls, how many became clients?
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                {['0-1', '2', '3', '4-5'].map(option => (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            setCalibration(option);
                                                            const enteredRate = Number(closeRate);
                                                            const isMatch = checkCalibration(enteredRate, option);
                                                            setShowCalibrationMismatch(!isMatch);
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${calibration === option
                                                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                                            } border`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                            {showCalibrationMismatch && (
                                                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                    <p className="text-xs text-amber-300">
                                                        <strong>Notice:</strong> You entered {closeRate}% but selected {calibration}/5 (
                                                        {calibration === '0-1' ? '0-20%' : calibration === '2' ? '~40%' : calibration === '3' ? '~60%' : '80-100%'}
                                                        ). Which feels more accurate? Consider adjusting your percentage.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        What's your gross margin after delivery cost?
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">
                                        If you charge $10K and it costs $4K to deliver, that's 60%.
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={margin}
                                            onChange={(e) => setMargin(e.target.value)}
                                            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none text-2xl font-mono pr-12"
                                            placeholder="80"
                                            min="0"
                                            max="100"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why these 2 questions */}
                        <div className="text-center text-xs text-gray-500 max-w-md mx-auto">
                            <p>
                                <strong>Why just these two questions?</strong> Close rate tells us if you're talking to the right people.
                                Margin tells us if you can afford to acquire more of them. Based on 1,000+ founder patterns.
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!closeRate || !margin}
                            className="w-full py-4 bg-amber-500 text-black rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Check Offer Health
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {step === 'verdict' && (
                    <motion.div
                        key="verdict"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {/* Verdict Header */}
                        <div className="text-center">
                            {isFail ? (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                        <XCircle className="w-10 h-10 text-red-400" />
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-red-400 mb-4">
                                        Your bottleneck isn't leads.
                                    </h1>
                                    <p className="text-2xl text-white font-bold">
                                        It's your offer.
                                    </p>
                                </>
                            ) : verdict === 'warn_underpriced' ? (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                                        <AlertTriangle className="w-10 h-10 text-amber-400" />
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
                                        Price Signal Detected
                                    </h1>
                                    <p className="text-xl text-white">
                                        At {closeRate}% close rate, you're likely <span className="text-amber-400 font-bold">{priceSignal}</span>.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-4">
                                        Offer Looks Healthy
                                    </h1>
                                    <p className="text-xl text-gray-300">
                                        Let's audit your lead funnel.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Verdict Details */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your Numbers</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${Number(closeRate) < 30 ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
                                    <div className="text-xs text-gray-400">Close Rate</div>
                                    <div className={`text-2xl font-bold font-mono ${Number(closeRate) < 30 ? 'text-red-400' : 'text-green-400'}`}>
                                        {closeRate}%
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {Number(closeRate) < 30 ? '❌ Below 30% threshold' : '✓ Above 30% threshold'}
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl border ${Number(margin) < 80 ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
                                    <div className="text-xs text-gray-400">Gross Margin</div>
                                    <div className={`text-2xl font-bold font-mono ${Number(margin) < 80 ? 'text-red-400' : 'text-green-400'}`}>
                                        {margin}%
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {Number(margin) < 80 ? '❌ Below 80% threshold' : '✓ Above 80% threshold'}
                                    </div>
                                </div>
                            </div>
                        </div>





                        {/* Pass Action */}
                        {verdict === 'pass' && (
                            <button
                                onClick={() => onPass()}
                                className="w-full py-4 bg-green-500 text-black rounded-xl font-bold text-lg hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                            >
                                Continue to Lead Audit
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
