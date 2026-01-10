import { motion } from 'framer-motion';
import { Briefcase, Wrench, Code, MapPin, Sparkles } from 'lucide-react';
import { type BusinessBucket, BUCKET_CONFIG } from '../../lib/business_axes';

interface StrategicForkProps {
    onSelect: (bucket: BusinessBucket) => void;
}

const BUCKET_ICONS: Record<BusinessBucket, React.ElementType> = {
    high_ticket_service: Briefcase,
    local_trades: Wrench,
    saas_software: Code,
    physical_location: MapPin,
};

const BUCKET_COLORS: Record<BusinessBucket, { bg: string; border: string; glow: string; text: string }> = {
    high_ticket_service: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30 hover:border-amber-500',
        glow: 'shadow-[0_0_40px_rgba(245,158,11,0.15)]',
        text: 'text-amber-400',
    },
    local_trades: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30 hover:border-emerald-500/50',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.1)]',
        text: 'text-emerald-400',
    },
    saas_software: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30 hover:border-blue-500/50',
        glow: 'shadow-[0_0_30px_rgba(59,130,246,0.1)]',
        text: 'text-blue-400',
    },
    physical_location: {
        bg: 'bg-gray-400/10',
        border: 'border-gray-500/30 hover:border-gray-400/50',
        glow: 'shadow-[0_0_30px_rgba(156,163,175,0.1)]',
        text: 'text-gray-400',
    },
};

export const StrategicFork = ({ onSelect }: StrategicForkProps) => {
    const buckets = Object.entries(BUCKET_CONFIG) as [BusinessBucket, typeof BUCKET_CONFIG[BusinessBucket]][];

    return (
        <div className="max-w-5xl mx-auto p-6 text-white min-h-[700px]">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">AI-Powered Diagnostic</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    What kind of business do you run?
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Select your business type so we can apply the right diagnostic framework.
                    Each has its own economic physics.
                </p>
            </motion.div>

            {/* Fork Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {buckets.map(([bucket, config], index) => {
                    const Icon = BUCKET_ICONS[bucket];
                    const colors = BUCKET_COLORS[bucket];
                    const isActive = config.isActive;

                    return (
                        <motion.button
                            key={bucket}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelect(bucket)}
                            className={`relative p-8 rounded-3xl border-2 text-left transition-all duration-300 group
                                ${colors.bg} ${colors.border} ${isActive ? colors.glow : ''}
                                ${isActive ? 'hover:scale-[1.02]' : 'opacity-70'}
                                backdrop-blur-xl
                            `}
                        >
                            {/* Active Badge */}
                            {isActive && (
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">Active</span>
                                </div>
                            )}

                            {/* Waitlist Badge */}
                            {!isActive && (
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Waitlist</span>
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-5`}>
                                <Icon className={`w-7 h-7 ${colors.text}`} />
                            </div>

                            {/* Title */}
                            <h3 className={`text-2xl font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                {config.label}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-400 text-sm">
                                {config.description}
                            </p>

                            {/* CTA Hint */}
                            <div className={`mt-6 text-sm font-medium ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                {isActive ? 'Start Diagnostic →' : 'Join Waitlist →'}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Footer Note */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-gray-500 text-sm mt-10"
            >
                Not sure? High-Ticket Service covers most consulting, coaching, and agency businesses.
            </motion.p>
        </div>
    );
};
