// Pool split percentages — must sum to 1.0
const POOL_SPLITS = {
    jackpot: 0.40,    // 5-match
    fourMatch: 0.35,  // 4-match
    threeMatch: 0.25, // 3-match
  };
  
  const MIN_CHARITY_PERCENT = 0.10;
  
  // Calculate prize pool tiers from total subscription revenue this period
  const calculatePrizePools = (totalRevenue, jackpotRollover = 0) => {
    const charityAmount = parseFloat(
      (totalRevenue * MIN_CHARITY_PERCENT).toFixed(2)
    );
    const prizePoolTotal = parseFloat(
      (totalRevenue - charityAmount).toFixed(2)
    );
  
    return {
      jackpot: parseFloat(
        ((prizePoolTotal * POOL_SPLITS.jackpot) + jackpotRollover).toFixed(2)
      ),
      fourMatch: parseFloat(
        (prizePoolTotal * POOL_SPLITS.fourMatch).toFixed(2)
      ),
      threeMatch: parseFloat(
        (prizePoolTotal * POOL_SPLITS.threeMatch).toFixed(2)
      ),
      charityTotal: charityAmount,
      prizePoolTotal,
    };
  };
  
  // Split pool equally among multiple winners — round to 2dp
  const splitPrize = (poolAmount, winnerCount) => {
    if (winnerCount === 0) return 0;
    return parseFloat((poolAmount / winnerCount).toFixed(2));
  };
  
  // Per-payment breakdown stored on each payment record
  const calculatePaymentBreakdown = (amount, userContributionPercent) => {
    const charityAmount = parseFloat(
      (amount * (userContributionPercent / 100)).toFixed(2)
    );
    const prizePoolAmount = parseFloat(
      (amount - charityAmount).toFixed(2)
    );
    return { charityAmount, prizePoolAmount };
  };
  
  export {
    calculatePrizePools,
    splitPrize,
    calculatePaymentBreakdown,
    POOL_SPLITS,
    MIN_CHARITY_PERCENT,
  };