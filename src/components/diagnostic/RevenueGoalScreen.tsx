import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calculator, Target, TrendingUp, Sparkles, DollarSign, Info } from 'lucide-react';
import { useBusinessStore, type ScenarioSource } from '../../store/useBusinessStore';
import { calculateGap } from '../../lib/GoalCalculator';

interface RevenueGoalScreenProps {
    onNext: () => void;
}

export const RevenueGoalScreen = ({ onNext }: RevenueGoalScreenProps) => {
    const { context, setGoal, setPreRevenue, setAssumptionField, clearAssumptionField, setPhysicsPhase } = useBusinessStore();
    const [currentRevenue, setCurrentRevenue] = useState<number | ''>('');
    const [targetRevenue, setTargetRevenue] = useState<number | ''>('');
    const [isPreRevenueMode, setIsPreRevenueMode] = useState(false);

    // Phase 1: Get Primary Offer Context
    const primaryOffer = context.offers.find(o => o.id === context.primaryOfferId);
    const hasPrimaryOffer = Boolean(primaryOffer && context.primaryOfferId);
    const assumedPriceSeed = context.assumptions?.fields?.primary_offer_price?.value;
    const [assumedOfferPrice, setAssumedOfferPrice] = useState<number | ''>(
        typeof assumedPriceSeed === 'number' ? assumedPriceSeed : ''
    );
    const offerPrice = hasPrimaryOffer ? primaryOffer.price : Number(assumedOfferPrice) || 0;
    const offerLabel = hasPrimaryOffer ? (primaryOffer?.name || 'your offer') : 'assumed offer';

    /**
     * NO BLENDED METRICS RULE (AMENDMENT 4)
     * =====================================
     * All growth physics MUST be scoped to the Primary Growth Offer.
     * 
     * - Revenue Gap: Calculated from primaryOffer.price ONLY
     * - Deals Needed: Based on primaryOffer.price ONLY
     * - Calls/Leads Needed: Derived from single offer's close rate
     * 
     * DO NOT blend prices, margins, or close rates across multiple offers.
     * If this rule breaks, the entire paradigm collapses.
     */

    // Default assumptions if not yet set in earlier steps (Phase 0 usually sets these)
    const initialCloseRate = context.offerCheck.closeRate ?? 33;
    const [closeRate, setCloseRate] = useState(initialCloseRate);
    const [closeRateSource, setCloseRateSource] = useState<ScenarioSource>(
        context.offerCheck.closeRate !== null ? 'user_provided' : 'system_default'
    );
    const [callBookingRate, setCallBookingRate] = useState(5); // Conservative default
    const [callBookingRateSource, setCallBookingRateSource] = useState<ScenarioSource>('system_default');

    // Derived local state for gap visualization
    const [calculatedGap, setCalculatedGap] = useState<ReturnType<typeof calculateGap> | null>(null);

    const handleCalculate = () => {
        // Validation
        const current = isPreRevenueMode ? 0 : Number(currentRevenue);
        const target = Number(targetRevenue);

        if (!target) {
            setPhysicsPhase('phase1', {
                status: 'fail',
                assumed: false,
                missing: true,
                blockers: ['Revenue target missing']
            });
            return;
        }

        const offerPriceSource: ScenarioSource = hasPrimaryOffer
            ? 'user_provided'
            : (assumedOfferPrice ? 'user_estimate' : 'system_default');

        if (!offerPrice || offerPrice <= 0) {
            setPhysicsPhase('phase1', {
                status: 'fail',
                assumed: true,
                missing: true,
                blockers: ['Primary offer price missing']
            });
            return;
        }

        const gap = calculateGap({
            currentMonthly: current,
            targetMonthly: target,
            price: offerPrice,
            closeRate: closeRate,
            callBookingRate: callBookingRate
        });

        setCalculatedGap(gap);

        if (offerPriceSource !== 'user_provided') {
            setAssumptionField('primary_offer_price', {
                field: 'primaryOfferPrice',
                label: 'Primary offer price',
                value: offerPrice,
                source: offerPriceSource,
                phase: 'phase1',
                updatedAt: 0
            });
        } else {
            clearAssumptionField('primary_offer_price');
        }

        if (closeRateSource !== 'user_provided') {
            setAssumptionField('close_rate', {
                field: 'closeRate',
                label: 'Close rate (%)',
                value: closeRate,
                source: closeRateSource,
                phase: 'phase1',
                updatedAt: 0
            });
        } else {
            clearAssumptionField('close_rate');
        }

        if (callBookingRateSource !== 'user_provided') {
            setAssumptionField('call_booking_rate', {
                field: 'callBookingRate',
                label: 'Booking rate (%)',
                value: callBookingRate,
                source: callBookingRateSource,
                phase: 'phase1',
                updatedAt: 0
            });
        } else {
            clearAssumptionField('call_booking_rate');
        }

        const hasAssumptions = [offerPriceSource, closeRateSource, callBookingRateSource]
            .some((source) => source !== 'user_provided');

        setPhysicsPhase('phase1', {
            status: 'pass',
            assumed: hasAssumptions,
            missing: false,
            blockers: []
        });

        // Save to store immediately so it persists
        setPreRevenue(isPreRevenueMode);
        setGoal({
            currentMonthly: current,
            targetMonthly: target,
            timeframe: 90,
            primaryOfferId: hasPrimaryOffer ? context.primaryOfferId : null,
            offerPrice: offerPrice,
            offerPriceSource: offerPriceSource,
            closeRate: closeRate,
            closeRateSource: closeRateSource,
            callBookingRate: callBookingRate,
            callBookingRateSource: callBookingRateSource,
            calculatedGap: gap
        });
    };

    const handlePreRevenueSwitch = () => {
        setIsPreRevenueMode(true);
        setCurrentRevenue(0);
        setPreRevenue(true);
    };

    const handleBackToRevenue = () => {
        setIsPreRevenueMode(false);
        setCurrentRevenue('');
        setPreRevenue(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">

            {/* Header Section */}
            <div className="text-center mb-10 space-y-4">
                <AnimatePresence mode="wait">
                    {!calculatedGap ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            key="input-header"
                        >
                            <h1 className="text-4xl font-bold tracking-tight mb-3">
                                {isPreRevenueMode ? "Let's Build Your Engine" : "Let's Set Your Targets"}
                            </h1>
                            <p className="text-xl text-slate-400">
                                {isPreRevenueMode
                                    ? "Starting from zero creates clarity. What is your first milestone?"
                                    : "We need 90 days of clear runway. Where are we going?"}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key="gap-header"
                        >
                            <h1 className="text-4xl font-bold tracking-tight mb-3 text-emerald-400">
                                Your Growth Physics
                            </h1>
                            <p className="text-xl text-slate-400">
                                To hit <span className="font-bold text-white mx-1">${Number(targetRevenue).toLocaleString()}/mo</span>
                                using <span className="text-indigo-400 font-bold mx-1">{offerLabel}</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Input Card */}
            <AnimatePresence mode="wait">
                {!calculatedGap ? (
                    <motion.div
                        key="input-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl"
                    >
                        <div className="space-y-8">

                            {/* Current Revenue Input (Conditional) */}
                            {!isPreRevenueMode && (
                                <div className="space-y-3">
                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                        Current Monthly Revenue
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-slate-400 text-xl font-mono">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={currentRevenue}
                                            onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                                            placeholder="15000"
                                            className="w-full bg-slate-800 hover:bg-slate-700/80 focus:bg-slate-800 border-2 border-transparent focus:border-indigo-500 transition-all rounded-xl py-4 pl-10 pr-4 text-2xl font-mono text-white placeholder-slate-600 outline-none"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handlePreRevenueSwitch}
                                        className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors pl-1"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        I haven't sold anything yet
                                    </button>
                                </div>
                            )}

                            {/* Target Revenue Input */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                    {isPreRevenueMode ? "First Milestone (90 Days)" : "90-Day Revenue Goal"}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-slate-400 text-xl font-mono">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={targetRevenue}
                                        onChange={(e) => setTargetRevenue(Number(e.target.value))}
                                        placeholder={isPreRevenueMode ? "10000" : "30000"}
                                        className="w-full bg-slate-800 hover:bg-slate-700/80 focus:bg-slate-800 border-2 border-transparent focus:border-emerald-500 transition-all rounded-xl py-4 pl-10 pr-20 text-2xl font-mono text-white placeholder-slate-600 outline-none"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-medium">/ month</span>
                                    </div>
                                </div>
                                {isPreRevenueMode && (
                                    <button
                                        onClick={handleBackToRevenue}
                                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors pl-1"
                                    >
                                        Wait, I have current revenue
                                    </button>
                                )}
                            </div>

                            {/* Primary Offer Assumption (Required when missing) */}
                            {!hasPrimaryOffer && (
                                <div className="space-y-3">
                                    <label className="text-sm font-bold uppercase tracking-wider text-amber-400">
                                        Assumed Primary Offer Price
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-amber-300 text-xl font-mono">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={assumedOfferPrice}
                                            onChange={(e) => setAssumedOfferPrice(e.target.value ? Number(e.target.value) : '')}
                                            placeholder="5000"
                                            className="w-full bg-amber-900/20 border border-amber-500/40 rounded-xl py-4 pl-10 pr-4 text-2xl font-mono text-white placeholder-amber-200/30 outline-none focus:border-amber-400"
                                        />
                                    </div>
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
                                        <Info className="w-4 h-4 text-amber-300 mt-0.5" />
                                        <p className="text-xs text-amber-200/80">
                                            No primary offer selected. We can run a scenario using your assumed price.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Conversion Assumptions Toggles */}
                            <div className="pt-4 border-t border-slate-800/50">
                                <details className="group">
                                    <summary className="flex items-center gap-2 cursor-pointer text-sm text-slate-400 hover:text-white transition-colors select-none">
                                        <Calculator className="w-4 h-4" />
                                        <span>Adjust Assumptions (Based on {offerLabel})</span>
                                    </summary>
                                    <div className="mt-4 grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Close Rate (%)</label>
                                            <input
                                                type="number"
                                                value={closeRate}
                                                onChange={(e) => {
                                                    setCloseRate(Number(e.target.value));
                                                    setCloseRateSource('user_provided');
                                                }}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-center font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Booking Rate (%)</label>
                                            <input
                                                type="number"
                                                value={callBookingRate}
                                                onChange={(e) => {
                                                    setCallBookingRate(Number(e.target.value));
                                                    setCallBookingRateSource('user_provided');
                                                }}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-center font-mono"
                                            />
                                        </div>
                                    </div>
                                </details>
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={!targetRevenue || (!isPreRevenueMode && !currentRevenue) || (!hasPrimaryOffer && !assumedOfferPrice)}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                            >
                                Calculate My Gap <TrendingUp className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    /* The Gap Result Card */
                    <motion.div
                        key="result-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Big Number Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-emerald-500/30 p-8 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <DollarSign className="w-32 h-32 text-emerald-400" />
                            </div>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="text-emerald-400 font-medium tracking-wider text-sm uppercase mb-2">Revenue Gap (90 Days)</div>
                                <div className="text-6xl font-black text-white font-mono tracking-tighter mb-2">
                                    ${calculatedGap.revenueGap.toLocaleString()}
                                </div>
                                <div className="text-slate-400">
                                    Additional monthly recurring revenue needed
                                </div>
                            </div>
                        </div>

                        {/* The Physics Grind */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Deals */}
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                <div className="text-3xl font-bold text-white mb-1">{calculatedGap.dealsNeeded}</div>
                                <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Deals</div>
                                <div className="text-xs text-slate-500 mt-2">@ ${offerPrice.toLocaleString()}</div>
                            </div>

                            {/* Calls */}
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative">
                                <ArrowRight className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 hidden md:block" />
                                <div className="text-3xl font-bold text-indigo-300 mb-1">{calculatedGap.callsNeeded}</div>
                                <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Sales Calls</div>
                                <div className="text-xs text-slate-500 mt-2">@ {closeRate}% Close Rate</div>
                            </div>

                            {/* Leads */}
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative">
                                <ArrowRight className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 hidden md:block" />
                                <div className="text-3xl font-bold text-indigo-400 mb-1">{calculatedGap.leadsNeeded}</div>
                                <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Conversation Leads</div>
                                <div className="text-xs text-slate-500 mt-2">@ {callBookingRate}% Booking</div>
                            </div>
                        </div>

                        {/* Reality Check Box */}
                        <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <Target className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-200 mb-1">The Operational Reality</h4>
                                    <p className="text-sm text-indigo-200/70 leading-relaxed">
                                        To hit this goal using <strong>{offerLabel}</strong>, your system needs to generate <strong>{Math.ceil(calculatedGap.leadsNeeded / 4)} qualified leads per week</strong>.
                                        Anything less than this is just hope.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={onNext}
                            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                        >
                            Let's Audit Your Lead Flow <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
