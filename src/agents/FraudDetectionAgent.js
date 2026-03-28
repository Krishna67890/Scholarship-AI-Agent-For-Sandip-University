/**
 * FraudDetectionAgent
 * Responsibility: Detecting duplicate documents or mismatches in extracted data.
 */
export const FraudDetectionAgent = {
  name: "Fraud Detection Agent",

  detect: async (data, historicalData = []) => {
    console.log("[FraudDetectionAgent] Checking for anomalies and fraud...");

    // Simulate complex check
    await new Promise(resolve => setTimeout(resolve, 800));

    const isDuplicate = historicalData.some(item => item.aadhaarNo === data.aadhaarNo);
    const hasNameMismatch = data.aadhaarName && data.marksheetName && (data.aadhaarName !== data.marksheetName);

    const results = {
      isDuplicate,
      hasNameMismatch,
      isFraudulent: isDuplicate || hasNameMismatch,
      confidenceScore: 0.98,
      anomalies: []
    };

    if (isDuplicate) results.anomalies.push("Aadhaar number already used in another application.");
    if (hasNameMismatch) results.anomalies.push("Name on Aadhaar does not match Name on Marksheet.");

    return {
      ...results,
      timestamp: new Date().toISOString(),
      agent: "FraudDetectionAgent v2.0"
    };
  }
};
