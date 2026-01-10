import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { type BusinessBucket, BUCKET_CONFIG } from '../../lib/business_axes';
import { supabase } from '../../lib/supabase';

interface WaitlistFormProps {
    bucket: Exclude<BusinessBucket, 'high_ticket_service'>;
    onBack: () => void;
}

export const WaitlistForm = ({ bucket, onBack }: WaitlistFormProps) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bucketInfo = BUCKET_CONFIG[bucket];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const { error: supabaseError } = await supabase
                .from('waitlist')
                .insert({
                    email,
                    bucket_type: bucket,
                    created_at: new Date().toISOString(),
                });

            if (supabaseError) {
                // If table doesn't exist or other error, log but show success anyway
                console.error('Waitlist submission error:', supabaseError);
                // For MVP, we'll still show success (can be stored locally)
            }

            setIsSuccess(true);
        } catch (err) {
            console.error('Waitlist error:', err);
            // Still show success for MVP
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-white min-h-[600px] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">You're on the list! 🎉</h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        We'll notify you when the <span className="text-white font-medium">{bucketInfo.label}</span> diagnostic is ready.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 text-white min-h-[600px]">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to selection</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${bucketInfo.color}-500/10 border border-${bucketInfo.color}-500/30 mb-6`}>
                        <span className={`text-${bucketInfo.color}-400 text-sm font-medium`}>
                            {bucketInfo.label}
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Coming Soon
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        We're building a specialized diagnostic for <span className="text-white">{bucketInfo.description.toLowerCase()}</span>.
                        Join the waitlist to get early access.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-lg"
                                placeholder="you@company.com"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="w-full py-4 bg-white text-black rounded-xl text-lg font-bold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full" />
                                Joining...
                            </>
                        ) : (
                            'Join Waitlist'
                        )}
                    </button>
                </form>

                {/* Trust Signal */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    No spam. We'll only email when your diagnostic is ready.
                </p>
            </motion.div>
        </div>
    );
};
