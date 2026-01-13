import { motion } from 'framer-motion';
import { ArrowRight, Box } from 'lucide-react';
import { COPY } from '../../lib/copy';

interface OfferIntroProps {
    onNext: () => void;
}

export const OfferIntro = ({ onNext }: OfferIntroProps) => {
    const { badge, headline, body, subtext, cta } = COPY.offerIntro;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 min-h-[600px] flex flex-col items-center justify-center text-center">

            {/* 6 Departments Context Visual (Background) */}
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none select-none flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 scale-150 transform -rotate-12 blur-sm">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`w-32 h-32 rounded-2xl border-2 flex items-center justify-center
                            ${i === 0 ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 bg-gray-800/20'}
                        `}>
                            {i === 0 && <Box className="w-10 h-10 text-blue-400" />}
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-2xl"
            >
                {/* Badge */}
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider mb-8">
                    {badge}
                </div>

                {/* Domino Visual */}
                <div className="h-32 mb-8 flex items-end justify-center gap-1">
                    {/* The First Domino (Offer) */}
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 15 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                        className="w-12 h-24 bg-blue-500 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center origin-bottom-right z-20"
                    >
                        <span className="text-white font-bold text-xs -rotate-90">OFFER</span>
                    </motion.div>

                    {/* Falling Chain */}
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 30 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
                        className="w-12 h-24 bg-gray-700 rounded-lg flex items-center justify-center origin-bottom-right opacity-80"
                    >
                        <span className="text-gray-400 font-bold text-xs -rotate-90">LEADS</span>
                    </motion.div>

                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 45 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 60 }}
                        className="w-12 h-24 bg-gray-700 rounded-lg flex items-center justify-center origin-bottom-right opacity-60"
                    >
                        <span className="text-gray-400 font-bold text-xs -rotate-90">SALES</span>
                    </motion.div>
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 60 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 40 }}
                        className="w-12 h-24 bg-gray-700 rounded-lg flex items-center justify-center origin-bottom-right opacity-40"
                    >
                        <span className="text-gray-400 font-bold text-xs -rotate-90">SCALE</span>
                    </motion.div>
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    {headline}
                </h1>

                {/* Body */}
                <div className="text-xl text-gray-300 mb-8 whitespace-pre-line leading-relaxed">
                    {body}
                </div>

                {/* Subtext */}
                <p className="text-sm text-gray-500 mb-10 italic">
                    {subtext}
                </p>

                {/* CTA */}
                <button
                    onClick={onNext}
                    className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 mx-auto"
                >
                    {cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

            </motion.div>
        </div>
    );
};
