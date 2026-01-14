import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, TrendingUp, ArrowRight, Target, Info } from 'lucide-react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { scoreOffers, type ConstraintType } from '../../lib/OfferRecommendationEngine';

interface PrimaryOfferSelectionScreenProps {
    onComplete: () => void;
}

export const PrimaryOfferSelectionScreen = ({ onComplete }: PrimaryOfferSelectionScreenProps) => {
    const { context, setPrimaryOffer } = useBusinessStore();
    const [selectedId, setSelectedId] = useState<string | null>(context.primaryOfferId);

    const goal = context.goals.revenue90Day || 10000;
    const current = context.vitals.revenue / 12 || 0;
    const gap = Math.max(0, goal - current);

    const offers = context.offers || [];

    // Get constraint signals
    const constraintSignals = context.constraintSignals;
    const constraint = constraintSignals?.primaryConstraint || null;
    const confidenceLevel = constraintSignals?.confidenceLevel || 'low';
    const capacityCallsPerWeek = constraintSignals?.metadata?.q3_callCapacity;

    // Get actual close rate from health check (if available)
    const actualCloseRate = context.offerCheck?.closeRate || null;

    // Score offers based on constraint
    const scoredOffers = scoreOffers({
        offers,
        revenueGap: gap,
        constraint: constraint as ConstraintType | null,
        confidenceLevel,
        capacityCallsPerWeek,
        actualCloseRate: actualCloseRate || undefined
    });

    const handleConfirm = () => {
        if (selectedId) {
            setPrimaryOffer(selectedId);
            onComplete();
        }
    };

    // Get confidence message
    const getConfidenceMessage = () => {
        if (!constraint) return null;
        if (confidenceLevel === 'high') return 'Based on your last audit';
        if (confidenceLevel === 'medium') return 'Based on what you told us so far';
        return 'Using early indicators';
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-white min-h-[600px] flex flex-col">

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Select Your Growth Engine</h1>

                {/* Confidence Badge */}
                {constraint && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 mb-4">
                        <Info className="w-4 h-4" />
                        {getConfidenceMessage()}
                    </div>
                )}

                <p className="text-slate-400 max-w-2xl mx-auto">
                    We recommend focusing on the offer that can bridge your
                    <span className="text-indigo-400 font-bold"> ${gap.toLocaleString()}/mo gap </span>
                    with the least friction.
                </p>
            </div>

            {/* Offer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-1 content-start">
                {scoredOffers.map(({ offer, recommendationBadge, dealsByMonth, tags }) => {
                    const isSelected = selectedId === offer.id;

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
                            {/* Recommendation Badge */}
                            {recommendationBadge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-xs font-bold uppercase shadow-lg text-white"
                                    >
                                        {recommendationBadge}
                                    </motion.div>
                                </div>
                            )}

                            {/* Selection Check */}
                            {isSelected && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                                    {tags.map(tag => (
                                        <span key={tag} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className={`${recommendationBadge ? 'mt-12' : 'mt-8'} text-center space-y-4`}>
                                <h3 className="text-xl font-bold">{offer.name}</h3>
                                <div className="text-3xl font-mono text-slate-200">
                                    ${offer.price.toLocaleString()}
                                </div>
                                <div className="py-4 border-t border-b border-slate-700/50">
                                    <div className="text-slate-400 text-sm uppercase tracking-wide font-bold mb-1">To Hit Target</div>
                                    <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                                        <Target className="w-5 h-5 text-indigo-400" />
                                        {dealsByMonth} deals<span className="text-slate-500 text-lg">/mo</span>
                                    </div>

                                    {/* Show calls/month only if we have real close rate data */}
                                    {callsByMonth !== null && (
                                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                                            <div className="text-slate-400 text-xs uppercase tracking-wide font-bold mb-1">Sales Calls</div>
                                            <div className="text-lg font-bold text-slate-300">
                                                {callsByMonth} calls/mo
                                                <div className="text-xs text-slate-500 font-normal mt-1">
                                                    Based on your {actualCloseRate}% close rate
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Show placeholder when no close rate data */}
                                    {callsByMonth === null && confidenceLevel !== 'high' && (
                                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                                            <div className="text-xs text-slate-500 italic">
                                                Calls needed depends on your close rate
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {tags.includes('Volume Heavy') ? (
                                    <p className="text-xs text-amber-400/80">
                                        Generating {dealsByMonth} sales/mo requires significant lead volume.
                                    </p>
                                ) : tags.includes('Exceeds Call Capacity') ? (
                                    <p className="text-xs text-amber-400/80">
                                        This may exceed your call capacity. Consider a higher-priced offer.
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
