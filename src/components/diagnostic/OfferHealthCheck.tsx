import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, ArrowRight, BookOpen } from 'lucide-react';

export type Phase0Verdict = 'pass' | 'fail_close_rate' | 'fail_margin' | 'fail_both' | 'warn_underpriced';

interface OfferHealthCheckProps {
    onPass: () => void;
    onWarn: () => void;
    onFail: (reason: Phase0Verdict) => void;
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
    const [verdict, setVerdict] = useState<Phase0Verdict | null>(null);

    const handleSubmit = () => {
        const cr = Number(closeRate);
        const m = Number(margin);

        if (isNaN(cr) || isNaN(m)) return;

        const v = getVerdict(cr, m);
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

                        {/* Fail Explanation */}
                        {isFail && (
                            <div className="space-y-4">
                                {(verdict === 'fail_close_rate' || verdict === 'fail_both') && (
                                    <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl">
                                        <h4 className="font-bold text-red-400 mb-2">Close Rate Below 30%</h4>
                                        <p className="text-sm text-gray-300">
                                            At {closeRate}%, you have an <strong>avatar or sales motion problem</strong>—not a lead problem.
                                            Either you're selling to the wrong people, or your sales process isn't educating them before the call.
                                        </p>
                                    </div>
                                )}
                                {(verdict === 'fail_margin' || verdict === 'fail_both') && (
                                    <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl">
                                        <h4 className="font-bold text-red-400 mb-2">Gross Margin Below 80%</h4>
                                        <p className="text-sm text-gray-300">
                                            At {margin}% margin, you've <strong>commoditized your offer</strong>.
                                            At these margins, you can't afford to scale marketing, hire talent, or weather bad months.
                                        </p>
                                    </div>
                                )}

                                {/* Resources */}
                                <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Before you return, fix your offer:
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400">→</span>
                                            Read: <span className="text-amber-400 font-medium">$100M Offers</span> by Alex Hormozi
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400">→</span>
                                            Raise your price and test with 5 new prospects
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400">→</span>
                                            Narrow your avatar to people who have urgency
                                        </li>
                                    </ul>
                                </div>

                                {/* Return CTA */}
                                <div className="text-center pt-4">
                                    <p className="text-gray-400 mb-4">
                                        Fix your offer first. Then return for your lead audit.
                                    </p>
                                    <button
                                        onClick={() => onFail(verdict as Phase0Verdict)}
                                        className="px-8 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        I understand. I'll return in 30 days.
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Warn Actions */}
                        {verdict === 'warn_underpriced' && (
                            <div className="space-y-4">
                                <div className="bg-amber-900/10 border border-amber-500/20 p-5 rounded-xl">
                                    <p className="text-sm text-gray-300">
                                        Your close rate suggests you could be charging significantly more.
                                        Consider testing a <strong>2-3x price increase</strong> on your next 5 prospects.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => onWarn()}
                                        className="py-4 bg-amber-500 text-black rounded-xl font-bold hover:bg-amber-400 transition-colors"
                                    >
                                        Continue to Lead Audit
                                    </button>
                                    <button
                                        onClick={() => onFail(verdict)}
                                        className="py-4 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        Fix Price First
                                    </button>
                                </div>
                            </div>
                        )}

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
