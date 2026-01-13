export const COPY = {
    offerIntro: {
        badge: "YOUR FIRST CHECKPOINT",
        headline: "Let's talk about your business.",
        body: "Before we look at leads, sales calls, or funnels—we need to check the foundation.\n\nYour Offer is the first domino.",
        subtext: "This takes about 2 minutes. Be honest—we're here to help, not to judge.",
        cta: "Let's Check My Offer"
    },
    closeRate: {
        headline: "First, let's talk sales.",
        body: "When you get on the phone with a prospect, how often do they become a paying client?",
        iKnow: "I know my close rate",
        iDontKnow: "I'm not sure",
        napkinPrompt: "No worries. Let's do some napkin math.",
        napkinQuestion: "Of your last 10 sales calls, how many became paying clients?",
        result: (rate: number) => `That's a ${rate}% close rate.`,
        tooltip: "Estimate based on your last 10 calls. If you sold 3 people, that's 30%."
    },
    grossMargin: {
        headline: "Now, let's talk profit.",
        body: "After you deliver your service, how much do you actually keep?",
        iKnow: "I know my margin",
        iDontKnow: "I'm not sure",
        napkinPrompt: "Let me help you figure that out.",
        chargePrompt: "What do you charge for your core offer?",
        costPrompt: "What does it cost you to deliver (time + tools)?",
        result: (margin: number) => `That gives you an ${margin}% gross margin.`,
        tooltip: "Revenue minus Cost of Goods Sold (COGS). For services, this includes your time cost."
    },
    verdict: {
        pass: {
            headline: "Your Offer looks healthy.",
            body: "Your numbers suggest you have a sellable offer. The Lead Machine should work for you.\n\nLet's move on and check your lead generation next.",
            cta: "Continue to Lead Audit"
        },
        warn: {
            headline: "You might be leaving money on the table.",
            body: "A high close rate usually means you're underpriced. But that's okay—let's keep going and revisit pricing later.",
            cta: "Continue Anyway"
        },
        fail: {
            headline: "Your Offer might need some work.",
            body: "Before we look at leads, let's figure out what's going on with your Offer. This is the most important step.",
            cta: "Run Deep Offer Diagnosis",
            secondary: "I'll fix it later, continue anyway"
        }
    }
};
