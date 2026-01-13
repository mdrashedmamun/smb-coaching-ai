import React, { useState } from 'react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { Mail, CheckCircle, Calendar, ArrowRight, Copy } from 'lucide-react';

export const PlanReadyScreen: React.FC = () => {
    const { generatedPlan, commitment } = useBusinessStore(state => state.context);
    const [copied, setCopied] = useState(false);

    if (!generatedPlan || !commitment) {
        return <div className="p-8 text-center">Loading plan...</div>;
    }

    // Generate Mailto Link
    // We use encodeURIComponent to ensure the body text formats correctly in email clients
    const subject = `My 3-Day Action Plan: ${new Date().toLocaleDateString()}`;
    const body = `
Here is my commitment to break the bottleneck:

THE REALITY CHECK:
${generatedPlan.headline}

MY 3-DAY BATTLE PLAN:
--------------------------------
${generatedPlan.day1}
--------------------------------
${generatedPlan.day2}
--------------------------------
${generatedPlan.day3}
--------------------------------

My Blocker: ${commitment.blocker}
Committed on: ${new Date(commitment.committedAt).toLocaleDateString()}

(Sent from SMB Coaching AI)
  `.trim();

    const mailtoLink = `mailto:${commitment.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(body);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">

            {/* Header Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    <div>
                        <h3 className="font-bold text-emerald-900">Commitment Locked</h3>
                        <p className="text-sm text-emerald-700">You are in the top 30% of founders who take action.</p>
                    </div>
                </div>
                <div className="text-right text-sm text-emerald-800 font-mono">
                    {new Date(commitment.committedAt).toLocaleDateString()}
                </div>
            </div>

            {/* The Plan Card */}
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-indigo-600 p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">Your 3-Day Battle Plan</h1>
                    <p className="text-lg font-medium opacity-90">{generatedPlan.headline}</p>
                    <p className="mt-4 text-sm bg-black/20 p-4 rounded-lg border border-white/10 italic">
                        "{generatedPlan.why}"
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-1">Target Action</h4>
                        <p className="text-indigo-800 font-bold">{generatedPlan.action}</p>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="bg-indigo-100 p-2 rounded-full shrink-0">
                            <Calendar className="w-5 h-5 text-indigo-700" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Day 1: Audit & Prepare</h3>
                            <p className="text-slate-600 mt-1">{generatedPlan.day1.replace('Step 1: ', '')}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="bg-indigo-100 p-2 rounded-full shrink-0">
                            <ArrowRight className="w-5 h-5 text-indigo-700" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Day 2: Execution</h3>
                            <p className="text-slate-600 mt-1">{generatedPlan.day2.replace('Step 2: ', '')}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="bg-indigo-100 p-2 rounded-full shrink-0">
                            <CheckCircle className="w-5 h-5 text-indigo-700" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Day 3: Review & Adapt</h3>
                            <p className="text-slate-600 mt-1">{generatedPlan.day3.replace('Step 3: ', '')}</p>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <p className="text-sm text-slate-500 italic">
                        "Intensity is the price of admission."
                    </p>

                    <div className="flex space-x-3 w-full md:w-auto">
                        <button
                            onClick={handleCopy}
                            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors text-slate-700"
                        >
                            <Copy className="w-4 h-4" />
                            <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
                        </button>

                        <a
                            href={mailtoLink}
                            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors shadow-md"
                        >
                            <Mail className="w-4 h-4" />
                            <span>Email This To Me</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
