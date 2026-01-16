import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface AdvisoryBlockedScreenProps {
    title?: string;
    message?: string;
    onBack?: () => void;
}

export const AdvisoryBlockedScreen = ({
    title = 'Advisory Locked',
    message = 'This path is blocked in Simulation Mode or failed underwriting. Run Scenario only.',
    onBack
}: AdvisoryBlockedScreenProps) => {
    return (
        <div className="max-w-2xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8 space-y-4">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                    <h1 className="text-2xl font-bold text-amber-200">{title}</h1>
                </div>
                <p className="text-amber-100/80">{message}</p>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-white border border-slate-700"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Recap
                    </button>
                )}
            </div>
        </div>
    );
};
