import { motion } from 'framer-motion';
import { Package, Zap, ArrowRight } from 'lucide-react';

interface PreRevenueChoiceForkProps {
    onRefineOffer: () => void;
    onSkipToLeads: () => void;
}

export const PreRevenueChoiceFork = ({ onRefineOffer, onSkipToLeads }: PreRevenueChoiceForkProps) => {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 min-h-[600px] flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider mb-6">
                    PRE-REVENUE PATH
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Let's set you up for success.
                </h1>
                <p className="text-xl text-gray-400 max-w-xl mx-auto">
                    Before we build your lead machine, we'd like to understand your offer.
                    This will help us give you better advice.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Option A: Refine Offer */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={onRefineOffer}
                    className="group p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all text-left"
                >
                    <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                        <Package className="w-7 h-7 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        Help me build a sellable offer
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        We'll walk you through pricing, positioning, and making your offer irresistible—before you spend time on leads.
                    </p>
                    <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm">
                        Recommended for new offers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </motion.button>

                {/* Option B: Skip to Leads */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={onSkipToLeads}
                    className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                        <Zap className="w-7 h-7 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        I already have an offer idea
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Skip straight to lead building. We'll check in on your offer after you've gotten some traction.
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        Skip for now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </motion.button>
            </div>
        </div>
    );
};
