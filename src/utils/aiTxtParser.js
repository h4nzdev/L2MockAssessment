/**
 * Parser and Template Generator for Custom AI Synchronized Assessments
 * Synchronizes custom mock database schemas (CREATE TABLE / INSERT) with 10 questions.
 */
import alasql from 'alasql';
import { ensureAlaSqlDatabase } from '../data/mockDatabase';

export const DOMAIN_PRESETS = [
  {
    id: 'restaurant',
    title: 'Restaurant POS & Kitchen Display',
    icon: 'UtensilsCrossed',
    desc: 'Menu items, table orders, server tip reconciliation, and kitchen display status',
    tables: [
      'MenuItems (item_id, item_name, category, price, is_available)',
      'Orders (order_id, table_number, server_id, total_amount, payment_status, created_at)',
      'KitchenTickets (ticket_id, order_id, station, prep_status, delay_seconds)'
    ],
    sampleSql: `
CREATE TABLE MenuItems (item_id INT, item_name STRING, category STRING, price NUMBER, is_available INT);
INSERT INTO MenuItems VALUES 
(1, 'Truffle Burger', 'Entree', 18.50, 1),
(2, 'Margherita Flatbread', 'Entree', 14.00, 1),
(3, 'Caesar Salad', 'Starter', 9.50, 1),
(4, 'Craft Draft IPA', 'Beverage', 7.50, 1),
(5, 'Espresso Martini', 'Beverage', 13.00, 0);

CREATE TABLE Orders (order_id INT, table_number INT, server_id STRING, total_amount NUMBER, payment_status STRING, created_at STRING);
INSERT INTO Orders VALUES 
(501, 4, 'SRV-12', 45.50, 'PAID', '2026-09-29 19:15:00'),
(502, 7, 'SRV-08', 92.00, 'PAID', '2026-09-29 19:22:15'),
(503, 2, 'SRV-12', 28.00, 'VOIDED', '2026-09-29 19:30:10'),
(504, 11, 'SRV-15', 115.50, 'PENDING_PAYMENT', '2026-09-29 19:45:00'),
(505, 5, 'SRV-08', 34.00, 'FAILED', '2026-09-29 19:50:20');

CREATE TABLE KitchenTickets (ticket_id INT, order_id INT, station STRING, prep_status STRING, delay_seconds INT);
INSERT INTO KitchenTickets VALUES 
(901, 501, 'GRILL', 'COMPLETED', 120),
(902, 502, 'OVEN', 'COMPLETED', 340),
(903, 503, 'BAR', 'CANCELLED', 0),
(904, 504, 'GRILL', 'DELAYED', 650),
(905, 505, 'BAR', 'IN_PROGRESS', 180);
`
  },
  {
    id: 'healthcare',
    title: 'Healthcare Clinic & Patient Registry',
    icon: 'Stethoscope',
    desc: 'Patient records, physician appointments, insurance claims, and check-in kiosks',
    tables: [
      'Patients (patient_id, full_name, date_of_birth, insurance_status, balance_due)',
      'Appointments (appointment_id, patient_id, provider_id, status, scheduled_time)',
      'BillingClaims (claim_id, appointment_id, claim_amount, claim_status, payer_code)'
    ],
    sampleSql: `
CREATE TABLE Patients (patient_id INT, full_name STRING, date_of_birth STRING, insurance_status STRING, balance_due NUMBER);
INSERT INTO Patients VALUES 
(101, 'Eleanor Vance', '1984-06-12', 'ACTIVE', 25.00),
(102, 'Marcus Brody', '1972-11-04', 'INACTIVE', 140.00),
(103, 'Sofia Reyes', '1995-03-21', 'ACTIVE', 0.00),
(104, 'David Chen', '1968-08-19', 'ACTIVE', 75.50),
(105, 'Amina Patel', '2001-01-15', 'PENDING_VERIFY', 0.00);

CREATE TABLE Appointments (appointment_id INT, patient_id INT, provider_id STRING, status STRING, scheduled_time STRING);
INSERT INTO Appointments VALUES 
(201, 101, 'DR-HART', 'COMPLETED', '2026-09-29 09:00:00'),
(202, 102, 'DR-KIM', 'NO_SHOW', '2026-09-29 09:30:00'),
(203, 103, 'DR-HART', 'COMPLETED', '2026-09-29 10:15:00'),
(204, 104, 'DR-LEE', 'IN_PROGRESS', '2026-09-29 11:00:00'),
(205, 105, 'DR-KIM', 'CANCELLED', '2026-09-29 11:45:00');

CREATE TABLE BillingClaims (claim_id INT, appointment_id INT, claim_amount NUMBER, claim_status STRING, payer_code STRING);
INSERT INTO BillingClaims VALUES 
(701, 201, 185.00, 'PAID', 'BCBS'),
(702, 202, 50.00, 'DENIED', 'MEDICARE'),
(703, 203, 220.00, 'PENDING', 'AETNA'),
(704, 204, 310.00, 'UNBILLED', 'CIGNA'),
(705, 205, 0.00, 'VOIDED', 'NONE');
`
  },
  {
    id: 'hotel',
    title: 'Hospitality Hotel PMS & Front Desk',
    icon: 'Hotel',
    desc: 'Room inventory, guest folios, keycard encoders, and night audit balancing',
    tables: [
      'Rooms (room_number INT, room_type STRING, floor INT, status STRING, rate_per_night NUMBER)',
      'Reservations (res_id INT, guest_name STRING, room_number INT, checkin_status STRING, total_charge NUMBER)',
      'KeyCardLogs (log_id INT, room_number INT, encoder_terminal STRING, event_status STRING, timestamp STRING)'
    ],
    sampleSql: `
CREATE TABLE Rooms (room_number INT, room_type STRING, floor INT, status STRING, rate_per_night NUMBER);
INSERT INTO Rooms VALUES 
(101, 'Deluxe King', 1, 'OCCUPIED', 189.00),
(102, 'Standard Queen', 1, 'CLEANING', 149.00),
(201, 'Executive Suite', 2, 'OCCUPIED', 299.00),
(202, 'Deluxe King', 2, 'VACANT', 189.00),
(301, 'Penthouse Suite', 3, 'MAINTENANCE', 499.00);

CREATE TABLE Reservations (res_id INT, guest_name STRING, room_number INT, checkin_status STRING, total_charge NUMBER);
INSERT INTO Reservations VALUES 
(3001, 'James Wilson', 101, 'CHECKED_IN', 378.00),
(3002, 'Claire Redfield', 201, 'CHECKED_IN', 598.00),
(3003, 'Leon Kennedy', 202, 'RESERVED', 189.00),
(3004, 'Ada Wong', 301, 'CANCELLED', 0.00);

CREATE TABLE KeyCardLogs (log_id INT, room_number INT, encoder_terminal STRING, event_status STRING, timestamp STRING);
INSERT INTO KeyCardLogs VALUES 
(8001, 101, 'ENC-DESK-01', 'SUCCESS', '2026-09-29 15:00:10'),
(8002, 201, 'ENC-DESK-02', 'SUCCESS', '2026-09-29 15:30:22'),
(8003, 202, 'ENC-DESK-01', 'ERROR_COMM_TIMEOUT', '2026-09-29 16:10:05'),
(8004, 301, 'ENC-DESK-02', 'ERROR_CHIP_DEFECT', '2026-09-29 16:45:00');
`
  },
  {
    id: 'atm',
    title: 'Banking Branch ATM Fleet & Cash Vault',
    icon: 'Landmark',
    desc: 'Automated teller terminals, cassette cash levels, transaction journals, and network pings',
    tables: [
      'ATMs (atm_id INT, branch_name STRING, ip_address STRING, status STRING, cash_level NUMBER)',
      'DispenserUnits (unit_id INT, atm_id INT, denomination INT, bills_remaining INT, is_jammed INT)',
      'ATMTransactions (txn_id INT, atm_id INT, card_issuer STRING, txn_type STRING, amount NUMBER, status STRING)'
    ],
    sampleSql: `
CREATE TABLE ATMs (atm_id INT, branch_name STRING, ip_address STRING, status STRING, cash_level NUMBER);
INSERT INTO ATMs VALUES 
(401, 'Downtown Financial Center', '10.50.1.10', 'ONLINE', 45000),
(402, 'Airport Terminal 2', '10.50.2.10', 'OFFLINE', 0),
(403, 'University Student Union', '10.50.3.10', 'DEGRADED', 8200),
(404, 'Metro Subway Plaza', '10.50.4.10', 'ONLINE', 32000);

CREATE TABLE DispenserUnits (unit_id INT, atm_id INT, denomination INT, bills_remaining INT, is_jammed INT);
INSERT INTO DispenserUnits VALUES 
(601, 401, 20, 1500, 0),
(602, 401, 100, 300, 0),
(603, 402, 20, 0, 1),
(604, 403, 20, 110, 0),
(605, 404, 20, 1200, 0);

CREATE TABLE ATMTransactions (txn_id INT, atm_id INT, card_issuer STRING, txn_type STRING, amount NUMBER, status STRING);
INSERT INTO ATMTransactions VALUES 
(9001, 401, 'VISA', 'WITHDRAWAL', 100, 'COMPLETED'),
(9002, 401, 'MASTERCARD', 'BALANCE_INQUIRY', 0, 'COMPLETED'),
(9003, 402, 'VISA', 'WITHDRAWAL', 200, 'FAILED_COMM_TIMEOUT'),
(9004, 403, 'DISCOVER', 'WITHDRAWAL', 80, 'FAILED_HARDWARE_JAM'),
(9005, 404, 'VISA', 'WITHDRAWAL', 60, 'COMPLETED');
`
  }
];

/**
 * Generates the All-In-One Synchronized Prompt for any chosen domain.
 * This instructs the AI to generate BOTH the custom Mock Database SQL (tables & data)
 * AND the 10 questions that directly query those tables.
 */
export function getSynchronizedAllInOnePrompt(topicName) {
  const cleanTopic = topicName?.trim() || 'Retail POS, Store Servers & Transaction Sync';

  return `Act as a Senior Database Engineer and Technical Support Assessment Lead.

I need you to generate a fully synchronized Mock Database and 10 Technical Support troubleshooting questions for the domain: "${cleanTopic}".

Output RAW TEXT ONLY. Do not wrap in markdown quotes or preamble. Follow this exact two-part format:

PART 1: MOCK DATABASE SQL
Generate 2 or 3 realistic tables for "${cleanTopic}" with 5 to 8 sample rows per table.
Use standard AlaSQL syntax (avoid reserved keywords like "count" or "total" as raw column names; use "total_amount", "item_count", etc.).

=== MOCK DATABASE SQL ===
CREATE TABLE TableA (col1 INT, col2 STRING, col3 NUMBER, status STRING);
INSERT INTO TableA VALUES (1, 'Sample 1', 45.00, 'ACTIVE'), (2, 'Sample 2', 90.00, 'INACTIVE');

CREATE TABLE TableB (id INT, ref_id INT, event_name STRING, created_at STRING);
INSERT INTO TableB VALUES (101, 1, 'Event Alpha', '2026-09-29 12:00:00');

PART 2: 10 TROUBLESHOOTING QUESTIONS
Generate exactly 10 incident troubleshooting questions that DIRECTLY query the tables defined in Part 1.
Mix: 6 SQL questions, 2 PowerShell questions, and 2 Network Troubleshooting questions.

Format each question exactly as follows:

=== QUESTION 1 ===
CATEGORY: SQL
DIFFICULTY: Basic
TICKET_ID: INC-501
TITLE: Identify Inactive Records in TableA
SCENARIO: Support operations detected irregular statuses in TableA.
PROMPT: Write a SQL query from TableA to select col1, col2, and status where status = "INACTIVE".
HINT: Use WHERE status = 'INACTIVE'.
STARTER_CODE: -- Write your SQL query below:\n
EXPECTED_ANSWER: SELECT col1, col2, status FROM TableA WHERE status = 'INACTIVE';
EXPLANATION: Filters records in TableA that are currently inactive.

=== QUESTION 2 ===
CATEGORY: PowerShell
DIFFICULTY: Medium
TICKET_ID: INC-502
TITLE: Restart ${cleanTopic} Service
SCENARIO: The local backend service is frozen and not accepting incoming client requests.
PROMPT: Write a PowerShell command to restart the service named "${cleanTopic.replace(/[^A-Za-z0-9]/g, '')}Service" with force.
HINT: Use Restart-Service -Name.
STARTER_CODE: # Write your PowerShell command:\n
EXPECTED_ANSWER: Restart-Service -Name ${cleanTopic.replace(/[^A-Za-z0-9]/g, '')}Service -Force
EXPLANATION: Forcibly restarts the frozen system daemon.

(Continue exact same format for QUESTION 3 through QUESTION 10)
Rules:
1. Ensure the SQL queries in the questions actually exist in the tables created in Part 1!
2. Valid CATEGORY values: SQL | PowerShell | Network Troubleshooting
3. Valid DIFFICULTY values: Basic | Medium | Intermediate | Advanced
4. Do NOT output conversational text. Output raw text starting with === MOCK DATABASE SQL ===`;
}

/**
 * Generates Prompt 1: Mock Database SQL only
 */
export function getDatabasePromptOnly(topicName) {
  const cleanTopic = topicName?.trim() || 'Retail POS';
  return `Generate an in-memory SQL database schema and realistic sample records for "${cleanTopic}" using AlaSQL syntax.

Format the output starting with this delimiter:

=== MOCK DATABASE SQL ===
CREATE TABLE ... (...);
INSERT INTO ... VALUES (...);

Rules:
1. Create 2 to 3 related tables with primary keys and foreign keys.
2. Insert 5 to 10 realistic sample rows per table.
3. Use data types: INT, STRING, NUMBER.
4. Avoid unquoted reserved words (e.g. use "total_amount" instead of "total", "txn_count" instead of "count").
5. Output raw SQL only without markdown code blocks.`;
}

/**
 * Generates Prompt 2: Questions only, based on a given schema
 */
export function getQuestionsPromptOnly(topicName, schemaDetails) {
  const cleanTopic = topicName?.trim() || 'Retail POS';
  const schemaText = schemaDetails || 'Stores (store_id, store_name, server_status), Registers (register_id, store_id, is_online), Transactions (transaction_id, total_amount, status)';

  return `Generate 10 Level 2 Technical Support troubleshooting questions for the domain: "${cleanTopic}".

The questions MUST query these exact database tables:
${schemaText}

Format each question exactly as follows:

=== QUESTION 1 ===
CATEGORY: SQL
DIFFICULTY: Basic
TICKET_ID: INC-601
TITLE: ...
SCENARIO: ...
PROMPT: ...
HINT: ...
STARTER_CODE: -- Write query here:\n
EXPECTED_ANSWER: SELECT ...;
EXPLANATION: ...

(Repeat for QUESTION 2 through QUESTION 10)
Rules:
1. 6 SQL questions, 2 PowerShell questions, 2 Network questions.
2. Make sure table names and column names match the schema above.
3. Raw text only without markdown backticks.`;
}

/**
 * Parses, validates, and extracts schema metadata from raw SQL (CREATE TABLE / INSERT)
 */
export function parseSqlSchemaOnly(rawSql) {
  if (!rawSql || !rawSql.trim()) {
    return { success: false, error: 'SQL input is empty.' };
  }

  try {
    ensureAlaSqlDatabase();
    
    // Clean and extract statements
    const cleanSql = rawSql
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    const statements = cleanSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 5);

    if (statements.length === 0) {
      return { success: false, error: 'No valid SQL statements found.' };
    }

    let createdTables = [];
    statements.forEach(stmt => {
      try {
        alasql(stmt + ';');
        const match = stmt.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z0-9_]+)/i);
        if (match && match[1]) {
          createdTables.push(match[1]);
        }
      } catch (stmtErr) {
        console.warn('SQL Parse warning on statement:', stmt, stmtErr.message);
      }
    });

    alasql.useid = 'alasql';

    // Discovered tables
    const allTables = Object.keys(alasql.tables || {}).filter(t => !t.startsWith('_'));
    const targetTables = createdTables.length > 0 
      ? allTables.filter(t => createdTables.some(ct => ct.toLowerCase() === t.toLowerCase()))
      : allTables.filter(t => !['Stores', 'Registers', 'Transactions', 'ErrorLogs'].includes(t));

    const finalTables = targetTables.length > 0 ? targetTables : allTables;

    const schema = finalTables.map(tableName => {
      const tbl = alasql.tables[tableName];
      let columns = [];
      let rowCount = 0;

      try {
        const sample = alasql(`SELECT * FROM ${tableName} LIMIT 1`);
        if (sample && sample[0]) {
          columns = Object.keys(sample[0]).map(col => ({
            name: col,
            type: typeof sample[0][col] === 'number' ? 'NUMBER' : 'STRING',
            description: `Column ${col}`
          }));
        } else if (tbl && tbl.columns) {
          columns = Object.keys(tbl.columns).map(col => ({
            name: col,
            type: 'STRING',
            description: `Column ${col}`
          }));
        }

        const countRes = alasql(`SELECT COUNT(*) AS [count] FROM ${tableName}`);
        rowCount = countRes && countRes[0] ? countRes[0].count : (tbl?.data ? tbl.data.length : 0);
      } catch {
        // fallback
      }

      return {
        table: tableName,
        description: `Database table ${tableName}`,
        columns,
        rowCount
      };
    }).filter(t => t.columns.length > 0);

    if (schema.length === 0) {
      return { 
        success: false, 
        error: 'No tables with valid columns could be parsed from the provided SQL. Ensure statements use CREATE TABLE TableName (col1 TYPE, ...);' 
      };
    }

    return {
      success: true,
      schema,
      sql: rawSql.trim(),
      tableCount: schema.length
    };
  } catch (err) {
    return {
      success: false,
      error: `SQL Engine Parse Error: ${err.message}`
    };
  }
}

/**
 * Generates the Question Generator Prompt using the exact inspected SQL schema
 */
export function generateQuestionsPromptFromSqlSchema({ sqlCode, schema, domainName }) {
  const cleanDomain = domainName?.trim() || 'Technical Operations & Support';
  
  const schemaSummary = schema && schema.length > 0
    ? schema.map(t => `- TABLE: ${t.table} (${t.columns.map(c => `${c.name} [${c.type}]`).join(', ')}) | ${t.rowCount} sample row(s)`).join('\n')
    : 'No tables specified';

  return `Act as a Senior Database Engineer and Technical Support Assessment Lead.

I have provided my custom SQL Database schema and sample data for the domain "${cleanDomain}".

=== PROVIDED DATABASE SCHEMA ===
${schemaSummary}

${sqlCode ? `=== SQL DEFINITIONS (REFERENCE) ===\n${sqlCode.trim().substring(0, 1500)}` : ''}

=== YOUR TASK ===
Generate exactly 10 realistic Level 2 Technical Support troubleshooting questions that test SQL query diagnostics, PowerShell system tasks, and Network troubleshooting.
The SQL questions MUST strictly query the tables and column names listed in the schema above!

FORMAT REQUIREMENTS:
- Output RAW TEXT ONLY. Do not use conversational filler, introduction, or markdown backticks.
- Follow this exact delimiter template for each question:

=== QUESTION 1 ===
CATEGORY: SQL
DIFFICULTY: Basic
TICKET_ID: INC-701
TITLE: (Short diagnostic ticket title)
SCENARIO: (Realistic support incident narrative describing what symptom was reported by staff or monitoring)
PROMPT: (Explicit instructions on what to query or filter from the tables above)
HINT: (Helpful SQL clause hint)
STARTER_CODE: -- Write your SQL query below:\n
EXPECTED_ANSWER: (Valid SELECT SQL query using the tables and columns above)
EXPLANATION: (Clear technical explanation of why this query resolves the ticket)

=== QUESTION 2 ===
CATEGORY: PowerShell
DIFFICULTY: Medium
TICKET_ID: INC-702
TITLE: (Service or System restart/diagnostic task)
SCENARIO: (Support symptom regarding a frozen service or process)
PROMPT: (Write a PowerShell command, e.g. Restart-Service, Get-Process, Test-NetConnection)
HINT: (Helpful cmdlet hint)
STARTER_CODE: # Write your PowerShell command:\n
EXPECTED_ANSWER: (Target PowerShell command)
EXPLANATION: (Technical rationale)

=== QUESTION 3 ===
CATEGORY: Network Troubleshooting
DIFFICULTY: Medium
TICKET_ID: INC-703
TITLE: (Network latency or terminal connectivity audit)
SCENARIO: (Support ticket regarding packet drop or socket timeout)
PROMPT: (Write a network diagnostic command, e.g. ping, Test-NetConnection -Port, tracert)
HINT: (Helpful network command hint)
STARTER_CODE: # Write your network diagnostic command:\n
EXPECTED_ANSWER: (Target network command)
EXPLANATION: (Technical rationale)

(Continue exact same format for QUESTION 4 through QUESTION 10)

RULES:
1. Ensure the 6 SQL questions strictly use the tables and column names provided in the schema!
2. Include 6 SQL questions, 2 PowerShell questions, and 2 Network Troubleshooting questions.
3. Use realistic ticket IDs (INC-701 to INC-710).
4. Valid CATEGORY values: SQL | PowerShell | Network Troubleshooting
5. Valid DIFFICULTY values: Basic | Medium | Intermediate | Advanced
6. Output raw text starting directly with === QUESTION 1 ===`;
}

/**
 * Default Prompt Template (Legacy fallback)
 */
export const AI_PROMPT_TEMPLATE = getSynchronizedAllInOnePrompt('Retail POS, Store Servers & Transaction Sync');

/**
 * Full Parser: Handles both Mock Database SQL (Part 1) and Questions (Part 2)
 */
export function parseCustomAssessmentTxt(rawContent) {
  if (!rawContent || !rawContent.trim()) {
    return { success: false, error: 'Input is empty. Please upload or paste your .txt content.' };
  }

  const cleanContent = rawContent.trim();
  let customDatabaseSql = '';
  let customSchema = [];
  let executionError = null;

  // 1. Look for MOCK DATABASE SQL block
  const dbMatch = cleanContent.match(/===\s*MOCK DATABASE SQL\s*===([\s\S]*?)(?:===\s*QUESTION|$)/i);
  if (dbMatch) {
    customDatabaseSql = dbMatch[1].trim();
  } else {
    // Check if raw CREATE TABLE exists in first half of document
    const createTableMatch = cleanContent.match(/(CREATE\s+TABLE[\s\S]*?)(?:===\s*QUESTION|$)/i);
    if (createTableMatch) {
      customDatabaseSql = createTableMatch[1].trim();
    }
  }

  // If custom database SQL found, test and initialize in AlaSQL
  if (customDatabaseSql) {
    try {
      ensureAlaSqlDatabase();
      // Split into individual SQL statements
      const statements = customDatabaseSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 5);

      statements.forEach(stmt => {
        try {
          alasql(stmt + ';');
        } catch (stmtErr) {
          console.warn('Custom SQL statement warning:', stmtErr.message, 'in:', stmt);
        }
      });
      alasql.useid = 'alasql';

      // Discover active tables from AlaSQL
      const tableNames = Object.keys(alasql.tables || {}).filter(t => !t.startsWith('_'));
      customSchema = tableNames.map(tableName => {
        const tbl = alasql.tables[tableName];
        let columns = [];
        let rowCount = 0;

        try {
          const sample = alasql(`SELECT * FROM ${tableName} LIMIT 1`);
          if (sample && sample[0]) {
            columns = Object.keys(sample[0]).map(col => ({
              name: col,
              type: typeof sample[0][col] === 'number' ? 'NUMBER' : 'STRING',
              description: `Attribute ${col}`
            }));
          }
          const countRes = alasql(`SELECT COUNT(*) AS [count] FROM ${tableName}`);
          rowCount = countRes && countRes[0] ? countRes[0].count : (tbl.data ? tbl.data.length : 0);
        } catch {
          // fallback
        }

        return {
          table: tableName,
          description: `Custom ${tableName} table`,
          columns,
          rowCount
        };
      }).filter(t => t.columns.length > 0);

    } catch (err) {
      executionError = err.message;
    }
  }

  // 2. Parse Questions
  const questionsResult = parseAiTxt(cleanContent);

  if (!questionsResult.success && (!customSchema || customSchema.length === 0)) {
    return {
      success: false,
      error: questionsResult.error || 'Failed to parse database and questions from the provided text.'
    };
  }

  return {
    success: true,
    hasCustomDatabase: customSchema.length > 0,
    databaseSql: customDatabaseSql,
    schema: customSchema,
    questions: questionsResult.questions || [],
    count: questionsResult.questions ? questionsResult.questions.length : 0,
    databaseError: executionError
  };
}

/**
 * Standard question extractor
 */
export function parseAiTxt(rawContent) {
  if (!rawContent || !rawContent.trim()) {
    return { success: false, error: 'The uploaded file or text is empty.' };
  }

  const cleanContent = rawContent.trim();

  // 1. JSON block check
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

  // 2. Split on "=== QUESTION"
  const questionBlocks = cleanContent.split(/(?:^|\n)\s*={2,}\s*QUESTION\s*\d*\s*={2,}\s*/i)
    .filter(block => block.trim().length > 0);

  if (questionBlocks.length >= 1) {
    const parsedQuestions = [];

    questionBlocks.forEach((block, idx) => {
      // Avoid parsing the database SQL block as a question
      if (block.includes('CREATE TABLE') && !block.includes('CATEGORY:')) {
        return;
      }
      const q = parseSingleBlock(block, idx);
      if (q && q.prompt) {
        parsedQuestions.push(q);
      }
    });

    if (parsedQuestions.length > 0) {
      return { 
        success: true, 
        questions: parsedQuestions.slice(0, 15),
        count: parsedQuestions.length 
      };
    }
  }

  return {
    success: false,
    error: 'Could not extract questions from the provided text. Ensure each question starts with === QUESTION N === and has PROMPT and EXPECTED_ANSWER.'
  };
}

function parseSingleBlock(block, index) {
  const lines = block.split('\n');
  const data = {};
  let currentKey = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (match) {
      currentKey = match[1].toUpperCase().replace(/-/g, '_');
      data[currentKey] = match[2].trim();
    } else if (currentKey) {
      data[currentKey] = (data[currentKey] ? data[currentKey] + '\n' : '') + trimmed;
    }
  }

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
    expectedQuery: expectedAnswer,
    expectedAnswer,
    explanation,
    tags: [category, difficulty, 'Custom-AI'],
    simpleGoal: scenario.length > 20 ? scenario.slice(0, 150) + '...' : prompt,
    simplePrompt: prompt,
    simpleSteps: [
      `Category: ${category}`,
      `Review target system and parameters`,
      `Execute and verify resolution command`
    ]
  };
}

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
    tags: [category, difficulty, 'Custom-AI'],
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
