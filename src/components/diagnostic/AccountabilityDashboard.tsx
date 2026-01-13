import { motion } from 'framer-motion';
import { Target, Calendar, CheckCircle2, XCircle, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import type { Prescription, SoftBottleneck } from '../../lib/BottleneckEngine';
import type { CheckInData } from './WeeklyCheckInForm';

interface AccountabilityDashboardProps {
    prescription: Prescription | null;
    checkInHistory: CheckInData[];
    admissions: SoftBottleneck[];
    nextCheckInDate: Date | null;
    skipCount: number;
    onCheckIn: () => void;
    onReAudit: () => void;
}

export const AccountabilityDashboard = ({
    prescription,
    checkInHistory,
    admissions,
    nextCheckInDate,
    skipCount,
    onCheckIn,
    onReAudit,
}: AccountabilityDashboardProps) => {
    const canCheckIn = nextCheckInDate && new Date() >= nextCheckInDate;
    // const lastCheckIn = checkInHistory[checkInHistory.length - 1]; // Unused for now

    const getAdmissionString = (s: SoftBottleneck): string => {
        const labels: Record<SoftBottleneck, string> = {
            time: 'Time',
            energy: 'Energy',
            attention: 'Attention',
            effort: 'Effort',
            belief: 'Belief',
        };
        return labels[s];
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-white min-h-[800px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Accountability Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Your single focus until you check in.
                    </p>
                </div>

                {/* Prescription Card */}
                {prescription && (
                    <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-8">
                        <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Current Prescription
                        </h3>
                        <div className="text-center py-6">
                            <div className="text-6xl md:text-8xl font-bold text-green-400 font-mono">
                                {prescription.quantity}
                            </div>
                            <div className="text-xl md:text-2xl text-white font-bold mt-2">
                                {prescription.action}
                            </div>
                            <div className="text-sm text-gray-400 mt-2">
                                {prescription.timeframe === 'this_week' ? 'Due this week' : 'Due by Friday'}
                            </div>
                        </div>

                        {skipCount >= 2 && (
                            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/20 rounded-xl text-center">
                                <p className="text-red-200 text-sm font-medium">
                                    This is week {skipCount + 1} with this prescription.
                                    {skipCount >= 3 && " We need to talk about what's really blocking you."}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Check-In Status */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Check-In Status
                    </h3>

                    {nextCheckInDate && (
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-300">
                                    Next check-in: <span className="text-white font-bold">{nextCheckInDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                                </span>
                            </div>
                            {canCheckIn && (
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                                    Ready
                                </span>
                            )}
                        </div>
                    )}

                    <button
                        onClick={onCheckIn}
                        disabled={!canCheckIn}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Check In Now
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* History */}
                {checkInHistory.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                            History
                        </h3>
                        <div className="space-y-3">
                            {checkInHistory.slice(-5).reverse().map((check, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        {check.result === 'yes' ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        ) : check.result === 'partial' ? (
                                            <Clock className="w-5 h-5 text-amber-400" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-400" />
                                        )}
                                        <span className="text-white capitalize">{check.result}</span>
                                    </div>
                                    {check.blocker && (
                                        <span className="text-sm text-gray-400">
                                            Blocker: {getAdmissionString(check.blocker)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pattern Surfacing */}
                {admissions.length >= 2 && (
                    <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-8">
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">
                            Pattern Detected
                        </h3>
                        <p className="text-amber-200">
                            You've cited "<span className="font-bold">{getAdmissionString(admissions[admissions.length - 1])}</span>" as a blocker {admissions.filter(a => a === admissions[admissions.length - 1]).length} times.
                            This might be the real issue to address.
                        </p>
                    </div>
                )}

                {/* Re-Audit CTA */}
                <div className="text-center pt-4">
                    <button
                        onClick={onReAudit}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Re-audit my funnel (monthly)
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
