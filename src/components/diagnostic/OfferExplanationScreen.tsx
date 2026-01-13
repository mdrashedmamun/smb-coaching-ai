import { useState, useEffect } from 'react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { generateCoachResponse } from '../../lib/coachApi';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquareQuote, Loader2 } from 'lucide-react';

interface OfferExplanationScreenProps {
    onContinue: () => void;
}

export const OfferExplanationScreen = ({ onContinue }: OfferExplanationScreenProps) => {
    const { context } = useBusinessStore();
    const { offerCheck, segments } = context;

    // Derived offer data (fallback to 0 if missing)
    const price = segments[0]?.pricePoint || 0;
    const margin = offerCheck.grossMargin || 0;
    const closeRate = offerCheck.closeRate || 0;
    const profitPerClient = Math.round(price * (margin / 100));

    const [explanation, setExplanation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Prevent double-fetch if already have an explanation or invalid data
        if (price > 0 && !explanation && !isLoading) {
            fetchExplanation();
        }
    }, [price, margin, closeRate]);

    async function fetchExplanation() {
        setIsLoading(true);
        const text = await generateCoachResponse('offer_explanation', {
            price,
            margin,
            closeRate,
            profitPerClient
        });
        setExplanation(text);
        setIsLoading(false);
    }

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 min-h-[600px] flex flex-col justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Your Offer Foundation</h2>
                    <p className="text-gray-400">Before we optimize your funnel, let's look at your physics.</p>
                </div>

                <div className="bg-indigo-900/30 border border-indigo-500/30 p-8 rounded-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex items-start gap-4 relative z-10">
                        <div className="bg-indigo-500/20 p-3 rounded-xl shrink-0">
                            <MessageSquareQuote className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div className="space-y-3 w-full">
                            <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Coach's Take</div>

                            {isLoading ? (
                                <div className="flex items-center gap-3 text-indigo-200 animate-pulse py-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Analyzing your offer metrics...</span>
                                </div>
                            ) : (
                                <p className="text-lg md:text-xl text-indigo-100 leading-relaxed font-medium">
                                    "{explanation}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-xs text-gray-400 mb-1">Price</div>
                        <div className="text-xl font-mono font-bold text-white">${price.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-xs text-gray-400 mb-1">Margin</div>
                        <div className="text-xl font-mono font-bold text-emerald-400">{margin}%</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-xs text-gray-400 mb-1">Close Rate</div>
                        <div className="text-xl font-mono font-bold text-blue-400">{closeRate}%</div>
                    </div>
                </div>

                <button
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-wait"
                    onClick={onContinue}
                    disabled={isLoading}
                >
                    Now Let's Audit Your Funnel
                    <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};
