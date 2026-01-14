import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
// NOTE: In a production app, this should be a backend endpoint to protect the API key.
// For this MVP/Prototype, we are calling it directly from the client.
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

const anthropic = apiKey ? new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
}) : null;

export type CoachRequestType = 'offer_explanation' | 'verdict_explanation' | 'blocker_plan';

interface CoachContext {
    price?: number;
    margin?: number;
    closeRate?: number;
    profitPerClient?: number;
    leads?: number;
    calls?: number;
    deals?: number;
    bottleneck?: string | null;
    blocker?: string;
    // NEW: Goal-Aware Fields
    goal?: {
        currentMonthly: number;
        targetMonthly: number;
        calculatedGap: {
            dealsNeeded: number;
            callsNeeded: number;
            leadsNeeded: number;
        };
    };
    isPreRevenue?: boolean;
}

export async function generateCoachResponse(type: CoachRequestType, context: CoachContext): Promise<string> {
    if (!anthropic) {
        console.warn('Anthropic API Key not found. Returning mock response.');
        return getMockResponse(type, context);
    }

    try {
        let systemPrompt = '';
        let userMessage = '';

        if (type === 'offer_explanation') {
            systemPrompt = `You are an empathic high-ticket sales coach.
Explain their offer in 2-3 sentences.
Use warm, direct language. No jargon.
Focus on what it means for their business.`;
            userMessage = `A founder charges $${context.price} per client.
Their margin is ${context.margin}%.
That means they make $${context.profitPerClient} profit per client.
Their close rate is ${context.closeRate}%.

Explain what this means for their business and why it matters.`;

        } else if (type === 'verdict_explanation') {
            // Goal-Aware Verdict Explanation
            const goalContext = context.isPreRevenue
                ? `Pre-revenue founder. Goal: $${context.goal?.targetMonthly}/mo in 90 days. Needs ${context.goal?.calculatedGap.dealsNeeded} deals.`
                : `Current: $${context.goal?.currentMonthly}/mo. Goal: $${context.goal?.targetMonthly}/mo. Gap: ${context.goal?.calculatedGap.dealsNeeded} deals, ${context.goal?.calculatedGap.leadsNeeded} leads.`;

            const leadsNum = context.leads || 1;
            const callsNum = context.calls || 0;
            const conversionRate = ((callsNum / leadsNum) * 100).toFixed(1);

            systemPrompt = `You are a direct business coach. Use data, not motivation.
Given the founder's goal and current funnel, explain:
1. The gap (what they're missing)
2. What's blocking them (the bottleneck)
3. The cost of inaction (in dollars or leads)
Be specific. Use their exact numbers. Surgical, not cheerful. 3-4 sentences max.`;

            userMessage = `${goalContext}

Current funnel: ${context.leads} leads → ${context.calls} calls (${conversionRate}%) → ${context.deals} deals
Price: $${context.price}
Margin: ${context.margin}%
Bottleneck identified: ${context.bottleneck}

Generate a 3-sentence coach message about what they need to fix to hit their goal.`;

        } else if (type === 'blocker_plan') {
            systemPrompt = `You are a high-ticket sales coach creating a 1-week action plan.
The founder selected "${context.blocker}" as their blocker.
Give them ONE specific, executable action.
Use their data to make it personal.
Format: Headline. Why. Action. Timeline.`;
            userMessage = `Generate a blocker-specific action plan for:
Blocker: ${context.blocker}
Bottleneck: ${context.bottleneck}
Leads: ${context.leads}
Calls booked: ${context.calls}
Price: $${context.price}
Margin: ${context.margin}%

Make it specific to their situation. One action they can do THIS WEEK.`;
        }

        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 300,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }]
        });

        // Safe type narrowing for text block
        const contentBlock = response.content[0];
        if (contentBlock.type === 'text') {
            return contentBlock.text;
        }
        return "I couldn't generate a response right now.";

    } catch (error) {
        console.error('Error calling Anthropic API:', error);
        return getMockResponse(type, context);
    }
}

function getMockResponse(type: CoachRequestType, context: CoachContext): string {
    if (type === 'offer_explanation') {
        return `Your price of $${context.price} gives you healthy margins to invest in growth. With a ${context.closeRate}% close rate, your sales process is working—now we just need to fuel it with the right volume.`;
    }
    if (type === 'verdict_explanation') {
        const gap = context.goal?.calculatedGap;
        if (gap && context.goal) {
            return `You told me you want $${context.goal.targetMonthly.toLocaleString()}/month. That's ${gap.dealsNeeded} more deals. At your close rate, you need ${gap.callsNeeded} sales calls. You're missing ${gap.leadsNeeded} leads this quarter.`;
        }
        return `You're generating solid lead volume, but your booking rate is leaking profit. You're effectively losing money every month by not following up. Fixing this one constraint is your fastest path to revenue.`;
    }
    if (type === 'blocker_plan') {
        return `Micro-Block Time. You're busy because you're reactive. Block 15 minutes every morning at 9am strictly for outreach. Do this for 3 days.`;
    }
    return "";
}
