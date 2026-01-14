
export function calculateGap(context: {
    currentMonthly: number;
    targetMonthly: number;
    price: number;
    closeRate: number; // e.g., 33 (percent)
    callBookingRate: number; // e.g., 5 (percent)
}) {
    // If target is less than current, no gap.
    if (context.targetMonthly <= context.currentMonthly) {
        return {
            dealsNeeded: 0,
            callsNeeded: 0,
            leadsNeeded: 0,
            revenueGap: 0
        };
    }

    const revenue_gap = context.targetMonthly - context.currentMonthly;

    // How many deals to close the gap?
    // price must be > 0 to avoid division by zero
    const price = context.price > 0 ? context.price : 1;
    const deals_needed = Math.ceil(revenue_gap / price);

    // How many calls to get those deals? (inverse close rate)
    // closeRate must be > 0
    const closeRate = context.closeRate > 0 ? context.closeRate : 1;
    const calls_needed = Math.ceil(
        (deals_needed * 100) / closeRate
    );

    // How many leads to book those calls? (inverse booking rate)
    // callBookingRate must be > 0
    const callBookingRate = context.callBookingRate > 0 ? context.callBookingRate : 1;
    const leads_needed = Math.ceil(
        (calls_needed * 100) / callBookingRate
    );

    return {
        dealsNeeded: deals_needed,
        callsNeeded: calls_needed,
        leadsNeeded: leads_needed,
        revenueGap: revenue_gap
    };
}
