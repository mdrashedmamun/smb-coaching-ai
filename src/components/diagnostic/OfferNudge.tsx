import { motion } from 'framer-motion';
import { Package, ArrowRight, X } from 'lucide-react';

interface OfferNudgeProps {
    onRefineOffer: () => void;
    onDismiss: () => void;
}

/**
 * A polite, empathetic nudge shown after lead success to users who skipped offer diagnosis.
 * Encourages them to refine their offer for better close rates.
 */
export const OfferNudge = ({ onRefineOffer, onDismiss }: OfferNudgeProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 border border-indigo-500/20 max-w-xl mx-auto"
        >
            {/* Dismiss Button */}
            <button
                onClick={onDismiss}
                className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                aria-label="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                        Nice work getting leads! 🎉
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        Your lead machine is running. But here's the truth: <strong className="text-gray-300">your close rate depends on the strength of your offer.</strong>
                        <br /><br />
                        Would you like us to help you refine it? A strong offer can 2-3x your conversions.
                    </p>
                    <button
                        onClick={onRefineOffer}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
                    >
                        Help me refine my offer <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
