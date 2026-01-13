// src/lib/OfferCopyGenerator.ts
import { evaluateMarginHealth } from './BottleneckEngine';

interface OfferData {
    price: number;
    margin: number;
    closeRate: number;
}

export function generateMarginCopy(offer: OfferData): {
    headline: string;
    status: string;
    profitPerClient: number;
    nextStep: string;
} {
    const profitPerClient = Math.round(offer.price * (offer.margin / 100));
    const marginHealth = evaluateMarginHealth(offer.margin);

    // Adaptive copy based on tier
    let headline = '';
    let nextStep = '';

    if (marginHealth.label === 'Critical') {
        headline = `Your offer is broken. You're making $${profitPerClient.toLocaleString()} per client—but burning out delivering.`;
        nextStep = 'STOP. Fix your pricing before anything else.';
    } else if (marginHealth.label === 'Poor') {
        const healthyProfit = Math.round(offer.price * 0.60);
        headline = `Your offer math is risky. You're making $${profitPerClient.toLocaleString()} per client, but $${healthyProfit.toLocaleString()} is healthy.`;
        nextStep = `Raise prices by 15-20% to hit $${healthyProfit.toLocaleString()} profit per client.`;
    } else if (marginHealth.label === 'Healthy') {
        headline = `Your margin is solid. You're making $${profitPerClient.toLocaleString()} per client—enough to invest in growth.`;
        nextStep = "Good foundation. Now let's audit your lead funnel.";
    } else {
        headline = `Your margin is excellent. You're making $${profitPerClient.toLocaleString()} per client—you're positioned to scale.`;
        nextStep = "You're in top tier. Let's maximize your funnel.";
    }

    return {
        headline,
        status: marginHealth.label,
        profitPerClient,
        nextStep
    };
}
