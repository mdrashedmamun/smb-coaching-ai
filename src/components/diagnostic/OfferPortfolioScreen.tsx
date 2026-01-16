/**
 * OfferPortfolioScreen.tsx
 * 
 * Phase 1A/1B: Offer Portfolio Capture and Primary Selection
 * 
 * UI Pattern: Guided conversation
 * - One decision per screen
 * - Capture full offer portfolio FIRST
 * - Then force primary selection
 * - No blended metrics by design
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Plus, Check, Package, Trash2, ChevronDown, Info,
    AlertTriangle, Briefcase
} from 'lucide-react';
import { useBusinessStore, type Offer, type OfferType, type DeliveryModel, type PurchaseFrequency, type BuyerType, type MarginTier } from '../../store/useBusinessStore';
import { ModeBadge } from './ModeIndicator';

interface OfferPortfolioScreenProps {
    onComplete: () => void;
}

type Phase = 'intro' | 'add_offer' | 'offer_list' | 'primary_selection' | 'complete';
type AddOfferStep = 'name' | 'price' | 'delivery_cost' | 'type' | 'delivery_model' | 'frequency' | 'buyer_type' | 'summary';

// Margin tier calculation
function calculateMarginTier(margin: number): MarginTier {
    if (margin < 40) return 'critical';
    if (margin < 60) return 'poor';
    if (margin < 80) return 'healthy';
    return 'excellent';
}

// Partial offer during creation
interface PartialOffer {
    name: string;
    price: number;
    deliveryCost: number;
    type: OfferType | null;
    deliveryModel: DeliveryModel | null;
    frequency: PurchaseFrequency | null;
    buyerType: BuyerType | null;
}

const INITIAL_PARTIAL: PartialOffer = {
    name: '',
    price: 0,
    deliveryCost: 0,
    type: null,
    deliveryModel: null,
    frequency: null,
    buyerType: null
};

export const OfferPortfolioScreen = ({ onComplete }: OfferPortfolioScreenProps) => {
    const [phase, setPhase] = useState<Phase>('intro');
    const [addOfferStep, setAddOfferStep] = useState<AddOfferStep>('name');
    const [partial, setPartial] = useState<PartialOffer>(INITIAL_PARTIAL);
    const [inputValue, setInputValue] = useState<string | number>('');

    const { context, addOffer, deleteOffer, setPrimaryOffer } = useBusinessStore();

    // Check if we should skip intro (already have offers)
    useEffect(() => {
        if (context.offers.length > 0 && phase === 'intro') {
            setPhase('offer_list');
        }
    }, []);

    const handleAddOfferNext = () => {
        switch (addOfferStep) {
            case 'name':
                setPartial(p => ({ ...p, name: String(inputValue) }));
                setInputValue('');
                setAddOfferStep('price');
                break;
            case 'price':
                setPartial(p => ({ ...p, price: Number(inputValue) }));
                setInputValue('');
                setAddOfferStep('delivery_cost');
                break;
            case 'delivery_cost':
                setPartial(p => ({ ...p, deliveryCost: Number(inputValue) }));
                setInputValue('');
                setAddOfferStep('type');
                break;
            case 'type':
                setAddOfferStep('delivery_model');
                break;
            case 'delivery_model':
                setAddOfferStep('frequency');
                break;
            case 'frequency':
                setAddOfferStep('buyer_type');
                break;
            case 'buyer_type':
                setAddOfferStep('summary');
                break;
            case 'summary':
                // Save offer
                const grossMargin = partial.price > 0
                    ? ((partial.price - partial.deliveryCost) / partial.price) * 100
                    : 0;

                addOffer({
                    name: partial.name,
                    price: partial.price,
                    deliveryCostPerUnit: partial.deliveryCost,
                    type: partial.type || 'consulting',
                    deliveryModel: partial.deliveryModel || '1:1',
                    frequency: partial.frequency || 'one_time',
                    buyerType: partial.buyerType || 'founder',
                    grossMargin,
                    marginTier: calculateMarginTier(grossMargin),
                    isScenario: false
                });

                // Reset and go to list
                setPartial(INITIAL_PARTIAL);
                setAddOfferStep('name');
                setInputValue('');
                setPhase('offer_list');
                break;
        }
    };

    const handleSelectType = (type: OfferType) => {
        setPartial(p => ({ ...p, type }));
        handleAddOfferNext();
    };

    const handleSelectDeliveryModel = (model: DeliveryModel) => {
        setPartial(p => ({ ...p, deliveryModel: model }));
        handleAddOfferNext();
    };

    const handleSelectFrequency = (freq: PurchaseFrequency) => {
        setPartial(p => ({ ...p, frequency: freq }));
        handleAddOfferNext();
    };

    const handleSelectBuyerType = (buyer: BuyerType) => {
        setPartial(p => ({ ...p, buyerType: buyer }));
        handleAddOfferNext();
    };

    const handleDeleteOffer = (id: string) => {
        deleteOffer(id);
        // If no offers left, go back to intro
        if (context.offers.length <= 1) {
            setPhase('intro');
        }
    };

    const handleSelectPrimary = (id: string) => {
        setPrimaryOffer(id);
        setPhase('complete');
    };

    const slideVariants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // Calculate margin for display
    const currentMargin = partial.price > 0
        ? Math.round(((partial.price - partial.deliveryCost) / partial.price) * 100)
        : 0;

    return (
        <div className="max-w-2xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {/* Intro */}
                {phase === 'intro' && (
                    <motion.div
                        key="intro"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto">
                            <Package className="w-10 h-10 text-indigo-400" />
                        </div>

                        {/* Mode badge - shows Consulting or Simulation */}
                        <div className="flex justify-center">
                            <ModeBadge />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">
                                Let's map what you sell.
                            </h1>
                            <p className="text-xl text-gray-300 max-w-lg mx-auto">
                                We'll capture every offer in your business,
                                then pick one to focus on for the next 90 days.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setPhase('add_offer');
                                setAddOfferStep('name');
                            }}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                        >
                            Add your first offer <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Add Offer Flow - Name */}
                {phase === 'add_offer' && addOfferStep === 'name' && (
                    <motion.div key="name" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">What do you call this offer?</h1>
                            <p className="text-lg text-gray-300">Give it a name your clients would recognize.</p>
                        </div>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="e.g., Growth Accelerator, 1:1 Coaching"
                            className="w-full px-4 py-4 text-xl bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />

                        {inputValue && (
                            <button onClick={handleAddOfferNext} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Add Offer Flow - Price */}
                {phase === 'add_offer' && addOfferStep === 'price' && (
                    <motion.div key="price" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">What do you charge for "{partial.name}"?</h1>
                            <p className="text-lg text-gray-300">The price a client pays for this offer.</p>
                        </div>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value ? Number(e.target.value) : '')}
                                placeholder="5000"
                                className="w-full pl-10 pr-4 py-4 text-2xl bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                            />
                        </div>

                        {inputValue && Number(inputValue) > 0 && (
                            <button onClick={handleAddOfferNext} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Add Offer Flow - Delivery Cost */}
                {phase === 'add_offer' && addOfferStep === 'delivery_cost' && (
                    <motion.div key="cost" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">What does it cost you to deliver "{partial.name}"?</h1>
                            <p className="text-lg text-gray-300">Include contractor time, software, materials, your hours.</p>
                        </div>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value ? Number(e.target.value) : '')}
                                placeholder="1000"
                                className="w-full pl-10 pr-4 py-4 text-2xl bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                            />
                        </div>

                        {/* Live margin calculation */}
                        {partial.price > 0 && (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                                <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <div className="text-sm text-gray-300">
                                    <p>Your margin: <span className={`font-bold ${currentMargin >= 60 ? 'text-emerald-400' : 'text-amber-400'
                                        }`}>{currentMargin}%</span></p>
                                    <p className="text-gray-500">(We calculated this for you)</p>
                                </div>
                            </div>
                        )}

                        <button onClick={handleAddOfferNext} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
                            Continue <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Add Offer Flow - Type */}
                {phase === 'add_offer' && addOfferStep === 'type' && (
                    <motion.div key="type" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">What kind of offer is this?</h1>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'coaching', label: 'Coaching' },
                                { value: 'retainer', label: 'Retainer' },
                                { value: 'project', label: 'Project' },
                                { value: 'consulting', label: 'Consulting' },
                                { value: 'workshop', label: 'Workshop' },
                                { value: 'audit', label: 'Audit' },
                                { value: 'rfp', label: 'RFP / Bid' },
                                { value: 'productized', label: 'Productized' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelectType(opt.value as OfferType)}
                                    className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Add Offer Flow - Delivery Model */}
                {phase === 'add_offer' && addOfferStep === 'delivery_model' && (
                    <motion.div key="delivery" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">How do you deliver it?</h1>
                        </div>

                        <div className="space-y-3">
                            {[
                                { value: '1:1', label: '1:1 with client', desc: 'Individual sessions or calls' },
                                { value: '1:many', label: 'Group / 1:many', desc: 'Workshops, cohorts, group calls' },
                                { value: 'async', label: 'Async / Recorded', desc: 'Pre-recorded content, written deliverables' },
                                { value: 'hybrid', label: 'Hybrid', desc: 'Mix of live and async' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelectDeliveryModel(opt.value as DeliveryModel)}
                                    className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all"
                                >
                                    <p className="font-bold text-white">{opt.label}</p>
                                    <p className="text-sm text-gray-400">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Add Offer Flow - Frequency */}
                {phase === 'add_offer' && addOfferStep === 'frequency' && (
                    <motion.div key="frequency" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">How often do they pay?</h1>
                        </div>

                        <div className="space-y-3">
                            {[
                                { value: 'one_time', label: 'One-time' },
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'quarterly', label: 'Quarterly' },
                                { value: 'annual', label: 'Annual' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelectFrequency(opt.value as PurchaseFrequency)}
                                    className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Add Offer Flow - Buyer Type */}
                {phase === 'add_offer' && addOfferStep === 'buyer_type' && (
                    <motion.div key="buyer" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">Who signs the check?</h1>
                        </div>

                        <div className="space-y-3">
                            {[
                                { value: 'founder', label: 'The founder / owner', desc: 'Direct decision maker' },
                                { value: 'partner', label: 'A partner or exec', desc: 'Senior stakeholder' },
                                { value: 'committee', label: 'A committee', desc: 'Multiple approvers' },
                                { value: 'procurement', label: 'Procurement team', desc: 'Formal buying process' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelectBuyerType(opt.value as BuyerType)}
                                    className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all"
                                >
                                    <p className="font-bold text-white">{opt.label}</p>
                                    <p className="text-sm text-gray-400">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Add Offer Flow - Summary */}
                {phase === 'add_offer' && addOfferStep === 'summary' && (
                    <motion.div key="summary" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">"{partial.name}" ready to add</h1>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Price</span>
                                <span className="font-mono text-white">${partial.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Margin</span>
                                <span className={`font-bold ${currentMargin >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {currentMargin}% ({currentMargin >= 60 ? 'Healthy' : 'Needs attention'})
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Type</span>
                                <span className="text-white capitalize">{partial.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Delivery</span>
                                <span className="text-white">{partial.deliveryModel}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Frequency</span>
                                <span className="text-white capitalize">{partial.frequency?.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Buyer</span>
                                <span className="text-white capitalize">{partial.buyerType}</span>
                            </div>
                        </div>

                        {/* Assumptions visible */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                <Info className="w-4 h-4" /> All data provided by you ✓
                            </p>
                        </div>

                        <button onClick={handleAddOfferNext} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
                            Add Offer <Check className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Offer List */}
                {phase === 'offer_list' && (
                    <motion.div key="list" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">Your offer portfolio</h1>
                            <p className="text-lg text-gray-300">
                                {context.offers.length === 1
                                    ? "You have 1 offer. Add more or continue to select your focus."
                                    : `You have ${context.offers.length} offers mapped.`
                                }
                            </p>
                        </div>

                        <div className="space-y-3">
                            {context.offers.map(offer => (
                                <div key={offer.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-white">{offer.name}</p>
                                        <p className="text-sm text-gray-400">
                                            ${offer.price.toLocaleString()} · {Math.round(offer.grossMargin)}% margin · {offer.type}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteOffer(offer.id)}
                                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setPhase('add_offer');
                                setAddOfferStep('name');
                            }}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium text-gray-300 flex items-center justify-center gap-2 transition-all"
                        >
                            <Plus className="w-5 h-5" /> Add another offer
                        </button>

                        {context.offers.length >= 1 && (
                            <button
                                onClick={() => setPhase('primary_selection')}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                            >
                                Continue to selection <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Primary Selection */}
                {phase === 'primary_selection' && (
                    <motion.div key="primary" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto">
                                <Briefcase className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Pick your growth engine.</h1>
                            <p className="text-lg text-gray-300 max-w-lg mx-auto">
                                For the next 90 days, all your numbers will be calculated against one offer.
                            </p>
                        </div>

                        {/* Warning: No blending */}
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-100">
                                <p className="font-medium">Why just one?</p>
                                <p className="text-amber-200/80">Blending metrics across offers leads to wrong advice. We focus the math on your primary growth driver.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {context.offers.map(offer => (
                                <button
                                    key={offer.id}
                                    onClick={() => handleSelectPrimary(offer.id)}
                                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl p-5 text-left transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-white text-lg group-hover:text-indigo-400">{offer.name}</p>
                                            <p className="text-gray-400">
                                                ${offer.price.toLocaleString()} · {Math.round(offer.grossMargin)}% margin · {offer.type}
                                            </p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-indigo-500 flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-indigo-500 transition-all" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Complete */}
                {phase === 'complete' && (
                    <motion.div key="complete" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                            <Check className="w-10 h-10 text-emerald-400" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">
                                Your growth engine is set.
                            </h1>
                            {(() => {
                                const primary = context.offers.find(o => o.id === context.primaryOfferId);
                                return primary ? (
                                    <p className="text-xl text-gray-300">
                                        All calculations will be based on: <span className="text-indigo-400 font-bold">{primary.name}</span>
                                    </p>
                                ) : null;
                            })()}
                        </div>

                        {/* Summary */}
                        {(() => {
                            const primary = context.offers.find(o => o.id === context.primaryOfferId);
                            return primary ? (
                                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Price</span>
                                        <span className="font-mono text-white">${primary.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Margin</span>
                                        <span className={`font-bold ${primary.grossMargin >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {Math.round(primary.grossMargin)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Offers in portfolio</span>
                                        <span className="text-white">{context.offers.length}</span>
                                    </div>
                                </div>
                            ) : null;
                        })()}

                        <button
                            onClick={onComplete}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                        >
                            Continue to revenue physics <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
