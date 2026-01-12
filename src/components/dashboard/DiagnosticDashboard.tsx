import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBusinessStore } from '../../store/useBusinessStore';
import { calculateBusinessScores } from '../../lib/scoring_engine';
import { AlertCircle, Zap, Shield, Repeat, Users, Factory } from 'lucide-react';

export const DiagnosticDashboard = () => {
    const context = useBusinessStore((state) => state.context);

    // Pure function calculation (Budget Brain at work)
    const diagnosis = useMemo(() => calculateBusinessScores(context), [context]);

    const { axes, lever, primaryConstraint, constraintExplanation, admittedFix, constraintEvidence } = diagnosis;

    // Build enriched rationale using founder's own words
    const enrichedRationale = admittedFix
        ? `You said you're avoiding "${admittedFix}". That's connected to this ceiling. ${lever.rationale}`
        : lever.rationale;

    // Build enriched explanation referencing their evidence
    const enrichedExplanation = constraintEvidence
        ? `${constraintExplanation} You mentioned: "${constraintEvidence}"`
        : constraintExplanation;

    return (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row gap-6">

                {/* 1. The Spider Chart Card (Visual Diagnosis) */}
                <div className="lg:w-1/3 bg-card border border-border rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        Economic Physics
                    </h3>

                    <div className="flex justify-center py-4">
                        <RadarChart axes={axes} />
                    </div>

                    <div className="mt-6 space-y-3">
                        <ScoreRow label="Product Leverage" score={axes.laborVsProductLeverage} icon={Factory} />
                        <ScoreRow label="Variable Cost" score={axes.fixedVsVariableCost} icon={Zap} />
                        <ScoreRow label="Recurring Rev" score={axes.oneTimeVsRecurringRevenue} icon={Repeat} />
                        <ScoreRow label="Distribution" score={axes.distributionDependency} icon={Users} />
                    </div>
                </div>

                {/* 2. The 90-Day Lever Card (Strategic Action) */}
                <div className="lg:w-2/3 bg-gradient-to-br from-card to-blue-950/20 border border-border rounded-xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />

                    {/* Primary Constraint */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-amber-500 font-bold tracking-wider text-xs uppercase mb-2">
                            <AlertCircle className="w-4 h-4" />
                            Primary Constraint Detected
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 capitalize">
                            {primaryConstraint.replace('_', ' ')}
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                            {enrichedExplanation}
                        </p>
                    </div>

                    {/* The Lever */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex flex-shrink-0 items-center justify-center border border-amber-500/30">
                                <Zap className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-amber-200 font-bold mb-1 uppercase text-xs tracking-widest">
                                    Your 90-Day Lever
                                </h4>
                                <p className="text-xl font-medium text-white mb-3">
                                    {lever.action}
                                </p>
                                <p className="text-sm text-gray-400">
                                    <span className="text-gray-300 font-medium">Why?</span> {enrichedRationale}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* "Don't Fix This" Hint */}
                    <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">IGNORE</span>
                        {lever.avoidFixing}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const ScoreRow = ({ label, score, icon: Icon }: any) => (
    <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
            <Icon className="w-3 h-3" />
            {label}
        </div>
        <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${score > 60 ? 'bg-emerald-500' : score > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                />
            </div>
            <span className="font-mono text-xs w-6 text-right">{score}</span>
        </div>
    </div>
);

// Simple SVG Radar Chart
const RadarChart = ({ axes }: { axes: any }) => {
    // 5 points normalized to 100
    const points = [
        axes.laborVsProductLeverage,
        axes.fixedVsVariableCost,
        axes.oneTimeVsRecurringRevenue,
        axes.distributionDependency,
        axes.moatStrength
    ];

    // SVG Math (Pentagon)
    const size = 200;
    const center = size / 2;
    const radius = 80;

    // Helper to get coordinates
    const getCoords = (value: number, index: number) => {
        const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
        const r = (value / 100) * radius;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    };

    const polyPoints = points.map((p, i) => getCoords(p, i)).join(' ');
    const bgPoints = [100, 100, 100, 100, 100].map((p, i) => getCoords(p, i)).join(' ');

    return (
        <div className="relative w-[200px] h-[200px]">
            <svg width="200" height="200" className="overflow-visible">
                {/* Background Grid */}
                <polygon points={bgPoints} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <polygon points={points.map((_, i) => getCoords(50, i)).join(' ')} fill="none" stroke="#1e293b" strokeWidth="1" />

                {/* Data Shape */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    points={polyPoints}
                    fill="#3b82f6"
                    fillOpacity="0.3"
                    stroke="#3b82f6"
                    strokeWidth="2"
                />

                {/* Axis Lines (optional, implicit in grid) */}
            </svg>

            {/* Axis Labels (Absolute positioned) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold bg-black/50 px-1 rounded">Leverage</div>
            <div className="absolute top-[35%] right-0 text-[10px] text-gray-500">Var Cost</div>
            <div className="absolute bottom-[20%] right-0 text-[10px] text-gray-500">Recurring</div>
            <div className="absolute bottom-[20%] left-0 text-[10px] text-gray-500">Distrib</div>
            <div className="absolute top-[35%] left-0 text-[10px] text-gray-500">Moat</div>
        </div>
    );
};
