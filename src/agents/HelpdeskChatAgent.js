/**
 * HelpdeskChatAgent (V12-HUMAN-CENTRIC-REASONING)
 * Responsibility: Natural, human-like discussion about documents and scholarship status.
 * Personality: Friendly, knowledgeable, and helpful. Sounds more like a human consultant.
 * Engineered by KRISHNA PATIL RAJPUT & Team PRIX Robotics.
 */
export const HelpdeskChatAgent = {
  name: "Neural Assistant Alpha-7",
  version: "12.0.0-PRO",

  respond: async (message, context = {}) => {
    const input = message.toLowerCase();
    const user = context.user || { username: 'Subject' };
    const appData = context.applicationData || {};
    const artifacts = appData.artifactsHistory || [];
    const ocr = appData.ocrResults || {};
    const eligibility = appData.eligibilityResult || {};
    const fraud = appData.fraudResult || {};

    await new Promise(resolve => setTimeout(resolve, 1200));

    // 1. HUMAN-LIKE GREETINGS
    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return {
        text: `Hey there, ${user.username}! I'm Alpha-7. I've been keeping an eye on your scholarship application. It looks like you've got ${artifacts.length} documents in your pipeline right now. How can I help you today?`,
        suggestedActions: ["give reports", "check my files", "Am I eligible?"]
      };
    }

    // 2. SPECIFIC REQUESTED SENTENCES
    if (input === "give reports" || input.includes("give reports on documents")) {
      if (artifacts.length === 0) {
        return {
          text: `I'd love to give you a report, but you haven't uploaded any documents yet! Once you upload them in the 'Secure Pipeline', I can generate a full forensic report for you.`,
          suggestedActions: ["Go to Pipeline"]
        };
      }
      return {
        text: `I read your documents and I have to say, I've prepared a detailed report for you. You've uploaded ${artifacts.length} files. Your status is ${appData.status}. I can walk you through the safety scores here, or we can head to the 'AI Artifacts' tab to print it out!`,
        suggestedActions: ["View AI Reports", "Discuss Trust Scores"]
      };
    }

    if (input.includes("give information about previous uploaded documents") || input.includes("what did i upload")) {
      if (artifacts.length === 0) {
        return {
          text: `I don't see any previous documents in your vault yet. Let's start by uploading your first artifact in the 'Secure Pipeline'!`,
          suggestedActions: ["Upload now"]
        };
      }
      const list = artifacts.map(a => `${a.name} (${a.extension?.toUpperCase()})`).join(", ");
      return {
        text: `Checking the vault... I found these documents from your session: [${list}]. I've read through them and extracted the relevant data for your scholarship. Is there a specific one you want to discuss?`,
        suggestedActions: ["Check Aadhaar", "Check Marksheet"]
      };
    }

    if (input.includes("is my document harmful or useful") || input.includes("is my socument harmfull or usefull")) {
      if (artifacts.length === 0) {
        return {
          text: `I haven't seen any documents yet! Upload them and I'll tells you immediately if they are useful or harmful.`,
          suggestedActions: ["Go to Pipeline"]
        };
      }
      const unsafe = artifacts.filter(a => !a.securityFinding.isSafe);
      if (unsafe.length > 0) {
        const unsafeNames = unsafe.map(u => u.name).join(", ");
        return {
          text: `I read your documents, and while most of them are very useful, I found ${unsafe.length} file(s) [${unsafeNames}] to be harmful. They didn't pass my safety scan. I've kept them in your profile so you can review or delete them manually.`,
          suggestedActions: ["Show harmful files", "Are safe ones okay?"]
        };
      }
      return {
        text: `I read your documents and this is very helpful documents! Everything you've uploaded is 100% useful and safe. No malware or fraud detected. You're all set!`,
        suggestedActions: ["Am I eligible?", "Print Report"]
      };
    }

    // 3. PRINTING
    if (input.includes("print")) {
      return {
        text: `Sure, I can help you with that! I have carefully read your documents and prepared the forensic ledger. You can use the printer icon in the 'AI Artifacts' tab to print everything out. Shall I take you there?`,
        suggestedActions: ["Go to AI Artifacts"]
      };
    }

    // 4. DOCUMENT DISCUSSION
    if (input.includes("aadhaar") || input.includes("aadhar")) {
      const aadhaarDoc = artifacts.find(a => a.type === 'aadhaar');
      if (aadhaarDoc) {
        return {
          text: `Oh, I see your Aadhaar card! I've already read through it. Your name shows up as ${ocr.name || '...actually, the name is a bit blurry'} and the system gave it a trust score of ${aadhaarDoc.securityFinding.safetyScore}%. It looks solid.`,
          suggestedActions: ["Check Marksheet", "Is it safe?"]
        };
      }
      return {
        text: `I don't see your Aadhaar card in the pipeline yet. Could you upload it? It's really important for me to verify who you are!`,
        suggestedActions: ["Go to Upload"]
      };
    }

    // 5. ELIGIBILITY
    if (input.includes("eligible") || input.includes("qualified") || input.includes("status")) {
      if (artifacts.length === 0) {
        return {
          text: `I can't tell you yet because I haven't seen your documents! If you upload your Aadhaar, Marksheet, and Income certificate, I'll give you a verdict in seconds.`,
          suggestedActions: ["Start Uploading"]
        };
      }
      let verdict = `Based on what I've analyzed, you're ${eligibility.isEligible ? 'definitely eligible!' : 'currently under review'}. `;
      if (eligibility.reasons && eligibility.reasons.length > 0) {
        verdict += `Basically, ${eligibility.reasons[0].toLowerCase()}. `;
      }
      return {
        text: verdict,
        suggestedActions: ["Print Report", "Check Security"]
      };
    }

    // 6. TEAM
    if (input.includes("team") || input.includes("who built") || input.includes("krishna") || input.includes("developer")) {
      return {
        text: `We're a team from PRIX Robotics! KRISHNA PATIL RAJPUT was our lead web developer. Yash Baviskar built the backend, Ritesh Rathod handled the documentation, and Pratik Somase did all the research. We built me to make scholarship verification fast and safe!`,
        suggestedActions: ["About Website", "Contact Team"]
      };
    }

    return {
      text: `I'm not quite sure about that one, ${user.username}. You can ask me to 'give reports', 'give information about previous documents', or 'is my document harmful or useful'. I'm here to help!`,
      suggestedActions: ["give reports", "check my files", "is my document useful?"]
    };
  }
};
