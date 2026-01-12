import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign } from 'lucide-react';

interface PriceSignalScreenProps {
    priceSignal: string;
    onTestPrice: () => void;
    onAuditAnyway: () => void;
}

export const PriceSignalScreen = ({ priceSignal, onTestPrice, onAuditAnyway }: PriceSignalScreenProps) => {
    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[700px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 pt-10"
            >
                {/* Header */}
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-12 h-12 text-amber-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-amber-400 mb-4">
                        Price Signal Detected
                    </h1>
                    <p className="text-2xl text-white font-medium max-w-xl mx-auto leading-relaxed">
                        You're likely <span className="text-amber-400 font-bold border-b-2 border-amber-400">{priceSignal}</span>.
                    </p>
                </div>

                {/* Analysis Card */}
                <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
                    <p className="text-lg text-amber-100 leading-relaxed text-center">
                        At your current close rate, you are leaving massive profit on the table.
                        Diagnosing lead flow now is like <strong>fixing a leak in a bucket that's too small</strong>.
                    </p>
                </div>

                {/* The Choice Fork (Asymmetrical) */}
                <div className="space-y-6 max-w-xl mx-auto">
                    {/* Primary Recommended Action */}
                    <button
                        onClick={onTestPrice}
                        className="group w-full relative overflow-hidden p-[1px] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-black h-full rounded-xl p-6 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                <DollarSign className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-left flex-1">
                                <div className="text-amber-400 font-bold text-lg mb-1">Test Price First (Recommended)</div>
                                <div className="text-gray-400 text-sm">Stop diagnosing leads. Fix pricing to double your margins immediately.</div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400 font-bold">
                                →
                            </div>
                        </div>
                    </button>

                    {/* Secondary Action (Passive) */}
                    <button
                        onClick={onAuditAnyway}
                        className="w-full text-center group"
                    >
                        <div className="p-4 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-gray-500 hover:text-gray-300">
                            <div className="font-medium mb-1">I want to audit my leads anyway</div>
                            <div className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                                Warning: We will flag this as an unaddressed pricing bottleneck.
                            </div>
                        </div>
                    </button>
                </div>

                <div className="text-center text-xs text-gray-600 uppercase tracking-widest pt-8">
                    Decision Fork: Active Choice Required
                </div>
            </motion.div>
        </div>
    );
};
