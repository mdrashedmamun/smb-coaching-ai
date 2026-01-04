import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { ArrowRight } from 'lucide-react'

interface OfferFormProps {
    onSubmit: () => void
}

export function OfferForm({ onSubmit }: OfferFormProps) {
    const { context, updateContext } = useBusinessStore()
    const [formData, setFormData] = useState({
        businessName: context.businessName,
        offerHeadline: context.offerHeadline,
        pricePoint: context.pricePoint || '',
        pricingModel: context.pricingModel,
        targetAudience: context.targetAudience
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateContext({
            businessName: formData.businessName,
            offerHeadline: formData.offerHeadline,
            pricePoint: Number(formData.pricePoint),
            pricingModel: formData.pricingModel,
            targetAudience: formData.targetAudience
        })
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Business Name</label>
                    <input
                        required
                        type="text"
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="e.g. Acme Marketing"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">One-Liner Headline</label>
                    <textarea
                        required
                        value={formData.offerHeadline}
                        onChange={e => setFormData({ ...formData, offerHeadline: e.target.value })}
                        className="w-full px-3 py-2 bg-background border rounded-md h-24 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        placeholder="e.g. We help dentists get more patients using Facebook Ads."
                    />
                    <p className="text-xs text-muted-foreground mt-1">Paste your Instagram bio or website header.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price Point ($)</label>
                        <input
                            required
                            type="number"
                            value={formData.pricePoint}
                            onChange={e => setFormData({ ...formData, pricePoint: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="e.g. 500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Model</label>
                        <select
                            value={formData.pricingModel}
                            onChange={e => setFormData({ ...formData, pricingModel: e.target.value })}
                            className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="fixed">Fixed Price</option>
                            <option value="subscription">Subscription (Monthly)</option>
                            <option value="hourly">Hourly Rate</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Target Audience</label>
                    <input
                        required
                        type="text"
                        value={formData.targetAudience}
                        onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                        className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="e.g. Dental Practice Owners in the US"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
                Analyze Offer <ArrowRight className="w-4 h-4" />
            </button>
        </form>
    )
}
