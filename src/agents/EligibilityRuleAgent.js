/**
 * EligibilityRuleAgent
 * Responsibility: Matching extracted document data against scholarship rules.
 */
export const EligibilityRuleAgent = {
  name: "Eligibility Agent",
  rules: {
    maxIncome: 250000,
    minMarks: 75,
    categories: ["OBC", "SC", "ST", "General-EWS"]
  },

  checkEligibility: async (applicantData) => {
    console.log("[EligibilityRuleAgent] Evaluating rules...");
    const results = {
      incomeEligible: applicantData.annualIncome <= EligibilityRuleAgent.rules.maxIncome,
      marksEligible: applicantData.marks >= EligibilityRuleAgent.rules.minMarks,
      isEligible: false,
      reasons: []
    };

    if (!results.incomeEligible) {
      results.reasons.push(`Income exceeds threshold of ₹${EligibilityRuleAgent.rules.maxIncome}`);
    }
    if (!results.marksEligible) {
      results.reasons.push(`Marks below requirement of ${EligibilityRuleAgent.rules.minMarks}%`);
    }

    results.isEligible = results.incomeEligible && results.marksEligible;

    return {
      ...results,
      timestamp: new Date().toISOString(),
      agent: "EligibilityRuleAgent v1.2"
    };
  }
};
