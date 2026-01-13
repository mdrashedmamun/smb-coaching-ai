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
            const leakingCalls = Math.round((context.leads || 0) * 0.15 - (context.calls || 0));
            const moneyLost = leakingCalls * (context.price || 0) * ((context.margin || 0) / 100);

            systemPrompt = `You are an empathic high-ticket sales coach explaining funnel metrics.
Be warm but honest. Use "you" language.
Acknowledge what they're doing well.
Point out the gap without shame.
3-4 sentences max.`;
            userMessage = `A founder has:
- ${context.leads} leads from content
- Books ${context.calls} calls
- Closes ${context.deals} deals
- Price: $${context.price}
- Margin: ${context.margin}%

They're leaving ${leakingCalls} calls on the table (gap to 15% industry average).
That's $${moneyLost.toLocaleString()} per month.

Write a coach message: Acknowledge their strength, show the gap, explain the impact.`;

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
        return `You're generating solid lead volume, but your booking rate is leaking profit. You're effectively losing money every month by not following up. Fixing this one constraint is your fastest path to revenue.`;
    }
    if (type === 'blocker_plan') {
        return `Micro-Block Time. You're busy because you're reactive. Block 15 minutes every morning at 9am strictly for outreach. Do this for 3 days.`;
    }
    return "";
}
