/**
 * Parser and Template Generator for AI-Generated Question .txt Files
 * Allows users to generate questions via ChatGPT, Claude, Gemini, etc. without an API key.
 */

export const AI_PROMPT_TEMPLATE = `Generate exactly 10 Technical Support interview troubleshooting questions (mixing SQL, PowerShell, and Network Troubleshooting) in the domain: Retail POS, Store Servers & Transaction Sync.

Format each question using this EXACT structured text template so our tool can parse it:

=== QUESTION 1 ===
CATEGORY: SQL
DIFFICULTY: Basic
TICKET_ID: INC-301
TITLE: Offline Store Controller Identification
SCENARIO: Store operations reported that multiple branch servers failed overnight health checks.
PROMPT: Write a SQL query from Stores table to select store_id, store_name, city, and server_status where server_status is "OFFLINE".
HINT: Use WHERE server_status = 'OFFLINE'.
STARTER_CODE: -- Incident INC-301: Offline Store Server Identification\n-- Write your SQL query below:\n
EXPECTED_ANSWER: SELECT store_id, store_name, city, server_status FROM Stores WHERE server_status = 'OFFLINE';
EXPLANATION: Filters stores where the controller server is in OFFLINE state.

=== QUESTION 2 ===
CATEGORY: PowerShell
DIFFICULTY: Medium
TICKET_ID: INC-302
TITLE: Restart Stuck POS Print Spooler Service
SCENARIO: Receipt printer on register lane REG-101 is hung with multiple jobs stuck in queue.
PROMPT: Write a PowerShell command to forcibly restart the Windows Print Spooler service.
HINT: Use Restart-Service cmdlet with -Name and -Force flags.
STARTER_CODE: # Write your PowerShell command below:\n
EXPECTED_ANSWER: Restart-Service -Name Spooler -Force
EXPLANATION: Restarts the spooler service to clear stuck print buffers.

=== QUESTION 3 ===
CATEGORY: Network Troubleshooting
DIFFICULTY: Intermediate
TICKET_ID: INC-303
TITLE: Test Store Controller TCP Port Connectivity
SCENARIO: Register lane REG-104 is unable to reach the on-prem store server at IP 10.104.0.5 on port 8080.
PROMPT: Write a network command or PowerShell cmdlet to test TCP connection to 10.104.0.5 on port 8080.
HINT: Use Test-NetConnection with -ComputerName and -Port parameters.
STARTER_CODE: # Write your diagnostic command below:\n
EXPECTED_ANSWER: Test-NetConnection -ComputerName 10.104.0.5 -Port 8080
EXPLANATION: Verifies Layer 4 TCP port reachability to store server controller.

(Continue the exact same template format for QUESTION 4 through QUESTION 10)
Important Rules:
1. Valid CATEGORY values: SQL | PowerShell | Network Troubleshooting
2. Valid DIFFICULTY values: Basic | Medium | Intermediate | Advanced
3. For SQL questions, use our schema tables: Stores, Registers, Transactions, ErrorLogs
4. Do NOT include markdown code blocks, conversational greetings, or extra explanations. Output raw structured text only.`;

/**
 * Robustly parses AI-generated text into standardized question objects.
 * Supports:
 * 1. Structured block delimiter format (=== QUESTION N ===)
 * 2. Embedded JSON array format
 * 3. Line-based key-value format (Q1: / Category: / etc.)
 */
export function parseAiTxt(rawContent) {
  if (!rawContent || !rawContent.trim()) {
    return { success: false, error: 'The uploaded file or text is empty.' };
  }

  const cleanContent = rawContent.trim();

  // 1. Check if the content is pure JSON or contains a JSON block
  const jsonMatch = cleanContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (jsonMatch) {
    try {
      const parsedJson = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsedJson) && parsedJson.length > 0) {
        const standardized = parsedJson.map((item, idx) => standardizeQuestion(item, idx));
        return { success: true, questions: standardized, count: standardized.length };
      }
    } catch {
      // Fall through to text block parser
    }
  }

  // 2. Structured text delimiter parser: Look for "=== QUESTION" or "QUESTION <N>" or "---"
  const questionBlocks = cleanContent.split(/(?:^|\n)\s*={2,}\s*QUESTION\s*\d*\s*={2,}\s*/i)
    .filter(block => block.trim().length > 0);

  if (questionBlocks.length >= 1) {
    const parsedQuestions = [];

    questionBlocks.forEach((block, idx) => {
      const q = parseSingleBlock(block, idx);
      if (q && q.prompt) {
        parsedQuestions.push(q);
      }
    });

    if (parsedQuestions.length > 0) {
      return { 
        success: true, 
        questions: parsedQuestions.slice(0, 15), // cap at 15
        count: parsedQuestions.length 
      };
    }
  }

  // 3. Fallback: Line-based parser for Q1 / Title / Prompt formats
  const fallbackQuestions = parseLineFallback(cleanContent);
  if (fallbackQuestions.length > 0) {
    return {
      success: true,
      questions: fallbackQuestions.slice(0, 15),
      count: fallbackQuestions.length
    };
  }

  return {
    success: false,
    error: 'Could not extract questions from the provided file. Please verify the file follows the template format (=== QUESTION N ===) with PROMPT and EXPECTED_ANSWER fields.'
  };
}

/**
 * Parses a single text block with KEY: Value pairs
 */
function parseSingleBlock(block, index) {
  const lines = block.split('\n');
  const data = {};
  let currentKey = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if this line is a key-value header
    const match = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (match) {
      currentKey = match[1].toUpperCase().replace(/-/g, '_');
      data[currentKey] = match[2].trim();
    } else if (currentKey) {
      // Continuation line for previous key (e.g. multiline prompt/scenario)
      data[currentKey] = (data[currentKey] ? data[currentKey] + '\n' : '') + trimmed;
    }
  }

  // Normalize fields
  const category = cleanCategory(data.CATEGORY || data.TOPIC);
  const difficulty = cleanDifficulty(data.DIFFICULTY || data.LEVEL);
  const ticketId = data.TICKET_ID || data.TICKET || `INC-AI-${300 + index + 1}`;
  const title = data.TITLE || `Troubleshooting Scenario #${index + 1}`;
  const scenario = data.SCENARIO || data.INCIDENT || data.DESCRIPTION || data.PROMPT || '';
  const prompt = data.PROMPT || data.OBJECTIVE || data.GOAL || data.QUESTION || scenario;
  const hint = data.HINT || data.TIP || 'Review command syntax and filter parameters.';
  const expectedAnswer = data.EXPECTED_ANSWER || data.ANSWER || data.EXPECTED_QUERY || data.SOLUTION || '';
  const starterCode = data.STARTER_CODE || data.STARTER || data.TEMPLATE || 
    (category === 'SQL' 
      ? `-- Incident ${ticketId}: ${title}\n-- Write your SQL query below:\n`
      : `# Incident ${ticketId}: ${title}\n# Write your command below:\n`);
  const explanation = data.EXPLANATION || data.RATIONALE || data.PURPOSE || 'Standard L2 verification procedure.';

  if (!prompt && !expectedAnswer) return null;

  return {
    id: index + 1,
    ticketId,
    title,
    difficulty,
    category,
    scenario,
    prompt,
    hint,
    starterCode,
    expectedQuery: expectedAnswer, // For SQL execution
    expectedAnswer, // For PowerShell / Network comparison
    explanation,
    tags: [category, difficulty, 'AI-Imported'],
    simpleGoal: scenario.length > 20 ? scenario.slice(0, 150) + '...' : prompt,
    simplePrompt: prompt,
    simpleSteps: [
      `Category: ${category}`,
      `Identify target system / asset in ticket`,
      `Execute and verify resolution command`
    ]
  };
}

/**
 * Line-based fallback parser
 */
function parseLineFallback(content) {
  const questions = [];
  // Split on "Question 1", "Q1.", "1.", etc.
  const rawParts = content.split(/(?:^|\n)\s*(?:Question|Q|\d+)\s*[:.)-]\s*/i).filter(p => p.trim());

  rawParts.forEach((part, idx) => {
    const lines = part.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length >= 2) {
      const title = lines[0].replace(/^[#*\s]+/, '');
      const prompt = lines.find(l => /^prompt|^question|^task/i.test(l))?.replace(/^[^:]+:\s*/, '') || lines[1];
      const answer = lines.find(l => /^answer|^solution|^expected/i.test(l))?.replace(/^[^:]+:\s*/, '') || lines[lines.length - 1];

      if (prompt && answer) {
        questions.push({
          id: idx + 1,
          ticketId: `INC-AI-${300 + idx + 1}`,
          title: title || `AI Incident #${idx + 1}`,
          difficulty: 'Medium',
          category: answer.toLowerCase().includes('select') ? 'SQL' : 'PowerShell',
          scenario: prompt,
          prompt: prompt,
          hint: 'Verify command parameters and targeted attributes.',
          starterCode: '-- Write query or command below:\n',
          expectedQuery: answer,
          expectedAnswer: answer,
          explanation: 'Imported troubleshooting scenario.',
          tags: ['AI-Imported', 'Custom']
        });
      }
    }
  });

  return questions;
}

/**
 * Standardize JSON object to Question format
 */
function standardizeQuestion(item, index) {
  const category = cleanCategory(item.category || item.topic || 'SQL');
  const difficulty = cleanDifficulty(item.difficulty || item.level || 'Medium');
  const ticketId = item.ticketId || item.ticket_id || `INC-AI-${300 + index + 1}`;
  const prompt = item.prompt || item.question || item.scenario || 'No prompt provided.';
  const expectedAnswer = item.expectedAnswer || item.expectedQuery || item.expected_answer || item.answer || item.solution || '';

  return {
    id: index + 1,
    ticketId,
    title: item.title || `Incident Scenario #${index + 1}`,
    difficulty,
    category,
    scenario: item.scenario || prompt,
    prompt,
    hint: item.hint || 'Check parameters and syntax carefully.',
    starterCode: item.starterCode || item.starter_code || 
      (category === 'SQL' 
        ? `-- Incident ${ticketId}\n-- Write your query below:\n` 
        : `# Incident ${ticketId}\n# Write your command below:\n`),
    expectedQuery: expectedAnswer,
    expectedAnswer,
    explanation: item.explanation || 'Verified diagnostic procedure.',
    tags: [category, difficulty, 'AI-Imported'],
    simpleGoal: item.simpleGoal || prompt,
    simplePrompt: prompt,
    simpleSteps: [
      `Category: ${category}`,
      `Review incident symptoms`,
      `Formulate targeted fix`
    ]
  };
}

function cleanCategory(val = '') {
  const s = String(val).toLowerCase();
  if (s.includes('power') || s.includes('ps') || s.includes('shell')) return 'PowerShell';
  if (s.includes('net') || s.includes('ping') || s.includes('dns') || s.includes('ip')) return 'Network Troubleshooting';
  return 'SQL';
}

function cleanDifficulty(val = '') {
  const s = String(val).toLowerCase();
  if (s.includes('adv')) return 'Advanced';
  if (s.includes('inter')) return 'Intermediate';
  if (s.includes('med')) return 'Medium';
  return 'Basic';
}
