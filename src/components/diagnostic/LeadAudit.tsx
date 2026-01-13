import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, MessageSquare, Phone, Users, Video, Mail, Target } from 'lucide-react';
import type { AuditMetrics } from '../../lib/BottleneckEngine';

interface LeadAuditProps {
    onComplete: (metrics: AuditMetrics) => void;
}

const METRICS = [
    { id: 'coldOutreach', label: 'Cold Outreaches Sent', icon: Mail, description: 'Emails, DMs, or cold calls to strangers this week' },
    { id: 'coldResponses', label: 'Cold Responses', icon: MessageSquare, description: 'How many replied (positive or negative)?' },
    { id: 'warmOutreach', label: 'Warm Outreaches', icon: Users, description: 'Referrals, past clients, or warm network this week' },
    { id: 'warmResponses', label: 'Warm Responses', icon: MessageSquare, description: 'How many engaged?' },
    { id: 'inbound', label: 'Inbound Leads', icon: Target, description: 'People who came to you (content, ads, referrals)' },
    { id: 'loomsFilmed', label: 'Looms Filmed', icon: Video, description: 'Personalized video outreaches sent' },
    { id: 'salesCalls', label: 'Sales Calls', icon: Phone, description: 'Discovery or closing calls held' },
    { id: 'clientsClosed', label: 'Clients Closed', icon: Activity, description: 'New paying clients this week' },
] as const;

export const LeadAudit = ({ onComplete }: LeadAuditProps) => {
    const [metrics, setMetrics] = useState<AuditMetrics>({
        coldOutreach: 0,
        coldResponses: 0,
        warmOutreach: 0,
        warmResponses: 0,
        inbound: 0,
        loomsFilmed: 0,
        salesCalls: 0,
        clientsClosed: 0,
    });

    const updateMetric = (key: keyof AuditMetrics, value: string) => {
        setMetrics(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
    };

    const handleSubmit = () => {
        console.log('[LeadAudit] Submitting metrics:', metrics);
        onComplete(metrics);
    };

    const totalOutreach = metrics.coldOutreach + metrics.warmOutreach + metrics.loomsFilmed;

    return (
        <div className="max-w-4xl mx-auto p-6 text-white min-h-[800px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
            >
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">Phase 1: Lead Funnel Audit</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Your numbers this week
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Brutal honesty only. Vanity metrics will give you a wrong diagnosis.
                    </p>
                </div>

                {/* Warning */}
                <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                    <span className="text-amber-400">⚠️</span>
                    <div className="text-sm text-amber-200">
                        <span className="font-bold">This audit is for the last 7 days.</span> If you don't know exact numbers, estimate honestly.
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {METRICS.map(({ id, label, icon: Icon, description }) => (
                        <div
                            key={id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:border-blue-500/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white">
                                        {label}
                                    </label>
                                    <p className="text-xs text-gray-500">{description}</p>
                                </div>
                            </div>
                            <input
                                type="number"
                                value={metrics[id as keyof AuditMetrics] || ''}
                                onChange={(e) => updateMetric(id as keyof AuditMetrics, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-2xl font-mono"
                                placeholder="0"
                                min="0"
                            />
                        </div>
                    ))}
                </div>

                {/* Live Summary */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Live Summary</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className={`text-3xl font-bold font-mono ${totalOutreach === 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                {totalOutreach}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Total Outreach</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold font-mono text-blue-400">
                                {metrics.salesCalls}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Sales Calls</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold font-mono text-green-400">
                                {metrics.clientsClosed}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Clients Closed</div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                    Analyze My Funnel
                    <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};
