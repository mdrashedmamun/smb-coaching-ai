import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Package, DollarSign, Briefcase } from 'lucide-react';
import { useBusinessStore, type Offer } from '../../store/useBusinessStore';

interface OfferInventoryScreenProps {
    onNext: () => void;
}

export const OfferInventoryScreen = ({ onNext }: OfferInventoryScreenProps) => {
    const { context, addOffer, deleteOffer } = useBusinessStore();
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState<Offer['type']>('retainer');

    const handleAddOffer = () => {
        console.log('[OfferInventory] handleAddOffer called:', { name, price, type });
        if (!name || !price) {
            console.log('[OfferInventory] Validation failed: name or price empty');
            return;
        }

        addOffer({
            name,
            price: Number(price),
            type,
            isHighLeverage: false, // Calculated later
            isVolumeTrap: false // Calculated later
        });

        console.log('[OfferInventory] Offer added to store');

        // Reset form
        setName('');
        setPrice('');
        setType('retainer');
        setIsAdding(false);
    };

    const offers = context.offers || [];
    const canContinue = offers.length > 0;

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[600px] flex flex-col">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Offer Inventory</h1>
                <p className="text-slate-400">
                    List what you sell. Don't overthink it—rough estimates are fine.
                    <br /> <span className="text-sm opacity-70">(Max 5 offers to keep us focused)</span>
                </p>
            </div>

            {/* Offer List */}
            <div className="space-y-4 mb-8 flex-1">
                <AnimatePresence>
                    {offers.map((offer) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-white">{offer.name}</div>
                                    <div className="text-sm text-slate-400 flex items-center gap-2">
                                        <span className="bg-slate-700 px-2 py-0.5 rounded text-xs uppercase">{offer.type.replace('_', ' ')}</span>
                                        <span>${offer.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteOffer(offer.id)}
                                className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Offer Card */}
                {isAdding ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-indigo-500/50 p-4 rounded-xl space-y-4"
                    >
                        <div>
                            <label className="text-xs uppercase text-slate-500 font-bold">Offer Name</label>
                            <input
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. VIP Coaching"
                                className="w-full bg-transparent border-b border-slate-700 focus:border-indigo-500 py-2 outline-none text-white placeholder-slate-600"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase text-slate-500 font-bold">Price Point</label>
                                <div className="relative">
                                    <DollarSign className="w-4 h-4 absolute left-0 top-2.5 text-slate-500" />
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="5000"
                                        className="w-full bg-transparent border-b border-slate-700 focus:border-indigo-500 py-2 pl-5 outline-none text-white placeholder-slate-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-slate-500 font-bold">Model</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    className="w-full bg-transparent border-b border-slate-700 focus:border-indigo-500 py-2 outline-none text-white"
                                >
                                    <option value="retainer">Monthly Retainer</option>
                                    <option value="one_time">High Ticket (One-Time)</option>
                                    <option value="consulting">Consulting / Hourly</option>
                                    <option value="course">Course / Digital</option>
                                    <option value="product_service">Productized Service</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOffer}
                                disabled={!name || !price}
                                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                            >
                                Add to List
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    offers.length < 5 && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Another Offer</span>
                        </button>
                    )
                )}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end border-t border-slate-800 pt-6">
                <button
                    onClick={onNext}
                    disabled={!canContinue}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                    Review Selection <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
