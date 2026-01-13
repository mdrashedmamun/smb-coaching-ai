import type { BottleneckType, SoftBottleneck } from './BottleneckEngine';

export interface PlanContext {
    bottleneck: BottleneckType;
    blocker: SoftBottleneck;
    metrics: {
        leads: number;
        calls: number;
        closed: number;
        price: number;
        margin: number;
    };
}

export interface GeneratedPlan {
    headline: string;
    why: string;
    action: string;
    day1: string;
    day2: string;
    day3: string;
}

export function generatePlan(ctx: PlanContext): GeneratedPlan {
    const { leads, calls, price, margin } = ctx.metrics;
    const profitPerClient = price * (margin / 100);
    const conversionRate = leads > 0 ? (calls / leads) : 0;

    // Industry benchmark comparison (15% conversion)
    const targetCalls = Math.round(leads * 0.15);
    const missingCalls = Math.max(0, targetCalls - calls);
    const lostRevenue = missingCalls * profitPerClient;

    let headline = "";
    let why = "";
    let action = "";

    // BLOCKER SPECIFIC LOGIC (Personalized and Data-Driven)
    if (ctx.blocker === 'time') {
        headline = `You're busy. You don't have 2 hours to fix everything.`;
        if (ctx.bottleneck === 'volume_followup') {
            headline = `You're busy. You're missing ${missingCalls} calls/month.`;
            why = `That's $${lostRevenue.toLocaleString()} you're leaving on the table by spending too much time on delivery.`;
            action = `Block 15 mins tomorrow morning. Call your 5 warmest leads from last week.`;
        } else {
            why = `Time-famine is killing your growth. You're missing out on serious profit.`;
            action = `Stop a low-value delivery task for 20 mins. Focus on your primary bottleneck.`;
        }
    } else if (ctx.blocker === 'energy') {
        headline = `You're burned out. You don't feel like calling.`;
        why = `That's because you're delivery-focused, not sales-focused. You're trading vitality for chores.`;
        action = `Reframe: Scaling this is how you get your energy back. Start with just 3 reach-outs.`;
    } else if (ctx.blocker === 'attention') {
        headline = `You're distracted. Client "fires" are stealing your future.`;
        why = `Every fire you put out for a low-margin client costs you $${profitPerClient.toLocaleString()} in new business.`;
        action = `Turn off notifications. Spend 30 minutes only on ${ctx.bottleneck.replace('_', ' ')}.`;
    } else if (ctx.blocker === 'effort') {
        headline = `You're hesitating. You know what to do, but you're not pushing.`;
        why = `Resistance is expensive. It's costing you $${lostRevenue.toLocaleString()} this month.`;
        action = `Face the discomfort. Do the hardest task on your list first tomorrow.`;
    } else {
        // Default / Belief
        headline = `You're skeptical. You're not sure this works for your niche.`;
        why = `Math doesn't have a niche. ${leads} leads should be ${targetCalls} calls. Period.`;
        action = `Verify the math yourself. Run the process for 3 days and audit the results.`;
    }

    return {
        headline,
        why,
        action,
        day1: `Step 1: Audit your last ${Math.min(leads, 10)} leads. Find the exact point where they dropped off.`,
        day2: `Step 2: ${action}`,
        day3: `Step 3: Review the response. If you got a 'No', record the objection. If 'Yes', book the call.`,
    };
}
