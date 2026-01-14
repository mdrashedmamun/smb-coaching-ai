import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, TrendingUp, ArrowRight, Target } from 'lucide-react';
import { useBusinessStore, type Offer } from '../../store/useBusinessStore';

interface PrimaryOfferSelectionScreenProps {
    onComplete: () => void;
}

export const PrimaryOfferSelectionScreen = ({ onComplete }: PrimaryOfferSelectionScreenProps) => {
    const { context, setPrimaryOffer } = useBusinessStore();
    const [selectedId, setSelectedId] = useState<string | null>(context.primaryOfferId);

    const goal = context.goals.revenue90Day || 10000; // Fallback only if flow broken
    const current = context.vitals.revenue / 12 || 0;
    const gap = Math.max(0, goal - current);

    // Filter out "planned" offers if we wanted to enforce existing, but for now we allow all
    const offers = context.offers || [];

    const handleConfirm = () => {
        if (selectedId) {
            setPrimaryOffer(selectedId);
            onComplete();
        }
    };

    const getOfferPhysics = (offer: Offer) => {
        const dealSize = offer.price || 0;
        if (dealSize === 0) return { dealsNeeded: 0, scale: 'infinite' };

        const dealsNeeded = Math.ceil(gap / dealSize);
        return {
            dealsNeeded,
            scale: dealsNeeded > 100 ? 'hard' : dealsNeeded > 30 ? 'medium' : 'easy'
        };
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-white min-h-[600px] flex flex-col">

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Select Your Growth Engine</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    We recommend focusing on the offer that can bridge your
                    <span className="text-indigo-400 font-bold"> ${gap.toLocaleString()}/mo gap </span>
                    with the least friction.
                </p>
            </div>

            {/* Offer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-1 content-start">
                {offers.map((offer) => {
                    const physics = getOfferPhysics(offer);
                    const isSelected = selectedId === offer.id;
                    const isHighLeverage = offer.price >= 2000;
                    const isVolumeTrap = physics.dealsNeeded > 50;

                    return (
                        <motion.div
                            key={offer.id}
                            onClick={() => setSelectedId(offer.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                relative p-6 rounded-2xl border-2 cursor-pointer transition-all
                                ${isSelected
                                    ? 'bg-indigo-900/20 border-indigo-500 shadow-xl shadow-indigo-900/20'
                                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800/60'
                                }
                            `}
                        >
                            {/* Selection Check */}
                            {isSelected && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}

                            {/* Tags */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                {isHighLeverage && (
                                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold uppercase flex items-center gap-1 border border-emerald-500/20">
                                        <TrendingUp className="w-3 h-3" /> High Leverage
                                    </span>
                                )}
                                {isVolumeTrap && (
                                    <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-xs font-bold uppercase flex items-center gap-1 border border-amber-500/20">
                                        <AlertTriangle className="w-3 h-3" /> Volume Heavy
                                    </span>
                                )}
                            </div>

                            <div className="mt-8 text-center space-y-4">
                                <h3 className="text-xl font-bold">{offer.name}</h3>
                                <div className="text-3xl font-mono text-slate-200">
                                    ${offer.price.toLocaleString()}
                                </div>
                                <div className="py-4 border-t border-b border-slate-700/50">
                                    <div className="text-slate-400 text-sm uppercase tracking-wide font-bold mb-1">To Hit Target</div>
                                    <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                                        <Target className="w-5 h-5 text-indigo-400" />
                                        {physics.dealsNeeded} deals<span className="text-slate-500 text-lg">/mo</span>
                                    </div>
                                </div>

                                {isVolumeTrap ? (
                                    <p className="text-xs text-amber-400/80">
                                        Generating {physics.dealsNeeded} sales/mo requires significant lead volume.
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-500">
                                        Manageable volume for a high-margin outcome.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end border-t border-slate-800 pt-6">
                <button
                    onClick={handleConfirm}
                    disabled={!selectedId}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                >
                    Lock Selection <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
