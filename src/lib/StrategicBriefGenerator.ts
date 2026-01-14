/**
 * StrategicBriefGenerator.ts
 * 
 * Generates a "One-Page Consulting Memo" for qualified users.
 * This is the core advisory output of the Consulting OS.
 * 
 * Output: Strategic Brief (Markdown format).
 */

import type { HighTicketICP } from '../store/useBusinessStore';
import type { BottleneckType } from './BottleneckEngine';

export interface StrategicBriefContext {
    // Revenue Physics
    currentMonthlyRevenue: number;
    targetMonthlyRevenue: number;
    revenueGap: number;

    // Offer Data
    offerName: string;
    offerPrice: number;
    offerMargin: number;

    // ICP (The Consulting Brain)
    icp?: HighTicketICP;

    // Diagnosis
    bottleneck: BottleneckType;
    dealsNeeded: number;
    callsNeeded: number;
    leadsNeeded: number;
}

export interface StrategicBrief {
    title: string;
    sections: {
        executiveSummary: string;
        marketPhysics: string;
        prescription: string;
        riskAudit: string;
    };
    markdown: string; // The full brief rendered as markdown
}

// --- Helper Functions ---

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
};

const getAuthorityAdvice = (authority: HighTicketICP['decisionAuthority']): string => {
    switch (authority) {
        case 'founder':
            return 'Your buyer is a Founder. They value speed, vision, and direct impact. Frame your offer around transformation, not features. Reduce proof requirements—trust your credibility.';
        case 'partner':
            return 'Your buyer involves Partners. Expect consensus-based decisions. Prepare "internal selling" materials (decks, PDFs). Build relationship with the champion.';
        case 'committee':
            return 'Your buyer is a Committee/Board. ROI and risk mitigation are paramount. Lead with data, case studies, and guarantees. Expect longer cycles.';
        case 'procurement':
            return 'Your buyer is Procurement. Process, compliance, and price comparison dominate. Be prepared for RFPs and defend your value against commoditization.';
        default:
            return 'Your buyer type is unclear. Focus on discovery to identify the true decision-maker.';
    }
};

const getCycleAdvice = (cycle: HighTicketICP['salesCycle']): string => {
    switch (cycle) {
        case 'short_transactional':
            return 'Your sales cycle is short (<14 days). Optimize for speed-to-close. Reduce friction in booking, proposals, and payment. Every delay kills deals.';
        case 'medium_consultative':
            return 'Your sales cycle is medium (14-45 days). Standard consultative motion. Focus on structured follow-up, discovery calls, and tailored proposals.';
        case 'long_enterprise':
            return 'Your sales cycle is long (45+ days). Pipeline nurture is critical. Build multi-touch sequences, stakeholder maps, and patience into your process.';
        default:
            return 'Your sales cycle is unclear. Start tracking time-to-close to optimize your motion.';
    }
};

const getRiskAdvice = (risk: HighTicketICP['riskTolerance']): string => {
    switch (risk) {
        case 'low':
            return 'Your buyer has LOW risk tolerance. Consider pilot programs, performance-based pricing, or money-back guarantees. De-risk the decision.';
        case 'medium':
            return 'Your buyer has MEDIUM risk tolerance. Balance upside with a clear plan. Show them a path, not just a promise.';
        case 'high':
            return 'Your buyer has HIGH risk tolerance. They want speed and scale. Sell the transformation, not the safety net. Aggressive pricing works here.';
        default:
            return 'Your buyer risk profile is unclear. Use discovery to understand their fears and aspirations.';
    }
};

const getBottleneckPrescription = (bottleneck: BottleneckType): string => {
    switch (bottleneck) {
        case 'volume_outreach':
            return '**Your constraint is Volume.** You are not generating enough top-of-funnel activity. The prescription is 20 outbound touches this week.';
        case 'volume_followup':
            return '**Your constraint is Follow-Up.** Leads are entering but not converting to calls. The prescription is to book 5 calls from your warm list this week.';
        case 'skill_messaging':
            return '**Your constraint is Messaging.** Your outbound is not landing. Review and rewrite 3 messages this week.';
        case 'skill_sales':
            return '**Your constraint is Sales Skill.** You are on calls but not closing. Record and review 1 sales call this week.';
        case 'price':
            return '**Your constraint is Price.** You are closing efficiently but leaving money on the table. Increase your price by 50% on the next 3 proposals.';
        case 'capacity':
            return '**Your constraint is Capacity.** You are full. The only growth lever is raising prices or dropping low-value clients.';
        default:
            return '**Your constraint is unclear.** Start with Volume—all other problems are invisible until you fix pipeline activity.';
    }
};

// --- Main Generator ---

export const generateStrategicBrief = (ctx: StrategicBriefContext): StrategicBrief => {
    const title = `Strategic Brief: ${ctx.offerName}`;

    // --- Section 1: Executive Summary ---
    const executiveSummary = `
**Current Revenue**: ${formatCurrency(ctx.currentMonthlyRevenue)}/mo
**Target Revenue**: ${formatCurrency(ctx.targetMonthlyRevenue)}/mo
**Revenue Gap**: ${formatCurrency(ctx.revenueGap)}/mo

To close this gap, you need approximately **${ctx.dealsNeeded} new deals** (at ${formatCurrency(ctx.offerPrice)}/deal).
This requires **${ctx.callsNeeded} sales calls** and **${ctx.leadsNeeded} qualified leads** based on your current conversion physics.
    `.trim();

    // --- Section 2: Market Physics (ICP-Driven) ---
    let marketPhysics = 'No ICP data available. Complete the High-Ticket Intake for personalized advisory.';
    if (ctx.icp) {
        marketPhysics = `
${getAuthorityAdvice(ctx.icp.decisionAuthority)}

${getCycleAdvice(ctx.icp.salesCycle)}

${getRiskAdvice(ctx.icp.riskTolerance)}
        `.trim();
    }

    // --- Section 3: The Prescription ---
    const prescription = getBottleneckPrescription(ctx.bottleneck);

    // --- Section 4: Risk Audit ---
    const riskAudit = `
**Why your current approach may fail:**

If you continue without addressing the **${ctx.bottleneck.replace('_', ' ')}** constraint, your revenue will stagnate. 
${ctx.icp?.riskTolerance === 'low' ? 'Your risk-averse buyers will not tolerate inconsistency—build trust systems.' : ''}
${ctx.icp?.salesCycle === 'long_enterprise' ? 'Your long sales cycle means pipeline gaps today create revenue gaps 90 days from now.' : ''}

**Action Required**: Execute the prescription above within the next 7 days.
    `.trim();

    // --- Render Full Markdown ---
    const markdown = `
# ${title}

---

## Executive Summary

${executiveSummary}

---

## Market Physics

${marketPhysics}

---

## The Prescription

${prescription}

---

## Risk Audit

${riskAudit}

---

*Generated by Consulting OS*
    `.trim();

    return {
        title,
        sections: {
            executiveSummary,
            marketPhysics,
            prescription,
            riskAudit
        },
        markdown
    };
};
