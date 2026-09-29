/**
 * Gemini API Client Service
 * Directly interacts with Google's Gemini API using the user's provided API key.
 * No backend required; pure client-side execution.
 */

const STORAGE_KEY = 'support_sql_gemini_api_key';

export function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function saveApiKey(key) {
  if (!key) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
}

/**
 * Generate 10 troubleshooting questions mixed with SQL, PowerShell, and Network troubleshooting
 */
export async function generateAITemplateQuestions({
  apiKey,
  domain = 'Restaurant POS & Kitchen Systems',
  difficulty = 'Mixed',
  topics = ['SQL', 'PowerShell', 'Network Troubleshooting']
}) {
  if (!apiKey) {
    throw new Error('Please enter a valid Google Gemini API Key.');
  }

  const prompt = `You are a Senior Level 2 / Level 3 IT Systems Support Engineer.
Generate exactly 10 realistic Technical Support troubleshooting interview questions.

Configuration:
- Domain / Business Scenario: "${domain}"
- Difficulty: "${difficulty}" (Basic, Intermediate, or Advanced)
- Topics to distribute across the 10 questions: ${topics.join(', ')}

Make sure to include a realistic distribution across the requested topics:
- SQL questions should query relational tables relevant to ${domain} (e.g. Orders, Terminals, Transactions, ErrorLogs).
- PowerShell questions should provide real Windows PowerShell cmdlets (e.g. Get-Service, Restart-Service, Test-NetConnection, Get-WinEvent, Test-ComputerSecureChannel) to fix server/terminal issues.
- Network Troubleshooting questions should cover command-line diagnostics (e.g. ping, tracert, nslookup, netstat, curl, ipconfig, arp) to identify network timeouts, DNS failures, or port blocking.

Return ONLY a JSON array containing exactly 10 items conforming to this JSON schema:
[
  {
    "id": 1,
    "title": "Short title describing the incident",
    "category": "SQL" | "PowerShell" | "Network Troubleshooting",
    "difficulty": "Basic" | "Intermediate" | "Advanced",
    "ticketId": "INC-AI-101",
    "scenario": "Detailed enterprise technical scenario describing what broke, systems affected, and error messages.",
    "simpleGoal": "1-2 sentence friendly, plain-English summary of what the engineer must accomplish.",
    "simpleSteps": [
      "Step 1: What table or command to target",
      "Step 2: Key parameters or filters",
      "Step 3: Expected result"
    ],
    "prompt": "Specific actionable instruction on what query, cmdlet, or network command to execute.",
    "starterCode": "-- Write query or command below\\n",
    "expectedAnswer": "The exact valid SQL query or PowerShell cmdlet or network command",
    "hint": "Troubleshooting hint to guide the candidate without giving away the complete solution.",
    "explanation": "Clear explanation of how and why this command solves the incident."
  }
]
IMPORTANT: Return ONLY raw valid JSON array. Do NOT wrap in markdown backticks or commentary.`;

  // Models to try in order of preference
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.3
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Gemini API returned an empty response.');
      }

      // Clean possible markdown code fence
      const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (!Array.isArray(parsed)) {
        throw new Error('Gemini did not return an array of 10 questions.');
      }

      // Ensure id 1..10 and required fields
      return parsed.slice(0, 10).map((q, idx) => ({
        id: idx + 1,
        title: q.title || `Troubleshooting Scenario #${idx + 1}`,
        category: q.category || 'SQL',
        difficulty: q.difficulty || 'Medium',
        ticketId: q.ticketId || `INC-AI-${100 + idx + 1}`,
        scenario: q.scenario || '',
        simpleGoal: q.simpleGoal || q.scenario,
        simpleSteps: Array.isArray(q.simpleSteps) ? q.simpleSteps : [q.hint || ''],
        prompt: q.prompt || '',
        starterCode: `-- ${q.ticketId || `INC-AI-${100 + idx + 1}`}: ${q.title}\n-- Write your ${q.category || 'solution'} below:\n`,
        expectedAnswer: q.expectedAnswer || '',
        expectedQuery: q.expectedAnswer || '',
        hint: q.hint || '',
        explanation: q.explanation || '',
        tags: [q.category, q.difficulty],
        isAIGenerated: true
      }));
    } catch (err) {
      lastError = err;
      // If 404 on model, loop to next model
      if (err.message && err.message.includes('not found')) {
        continue;
      }
      break;
    }
  }

  throw lastError || new Error('Failed to generate questions with Gemini API.');
}

/**
 * Validates a PowerShell, Network or SQL answer using Gemini semantic comparison
 */
export async function evaluateAnswerWithGemini({
  apiKey,
  question,
  userAnswer
}) {
  if (!apiKey) {
    throw new Error('API key is required for evaluation.');
  }

  const prompt = `You are evaluating a candidate's answer for a Level 2 Technical Support assessment.
Incident Ticket: ${question.ticketId} - ${question.title}
Category: ${question.category}
Scenario: ${question.scenario}
Prompt / Objective: ${question.prompt}
Expected / Target Answer: ${question.expectedAnswer}

Candidate's Submitted Answer:
"${userAnswer}"

Evaluate if the candidate's answer is correct, viable, or equivalent.
Return ONLY a JSON object:
{
  "isCorrect": true | false,
  "feedback": "Detailed encouraging feedback explaining whether it works or what was missing or incorrect.",
  "suggestion": "Better alternative or recommended syntax if any."
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Evaluation request failed');
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleanJson);
}
