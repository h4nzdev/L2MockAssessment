import alasql from 'alasql';
import { ensureAlaSqlDatabase } from '../data/mockDatabase';

/**
 * Normalizes a JavaScript value for comparison
 */
function normalizeValue(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') {
    // Round to 4 decimal places to prevent float precision mismatches
    return Math.round(val * 10000) / 10000;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    // Check if numeric string
    if (!isNaN(trimmed) && trimmed !== '') {
      const num = Number(trimmed);
      return Math.round(num * 10000) / 10000;
    }
    return trimmed;
  }
  return val;
}

/**
 * Normalizes an object's keys to lowercase and values normalized
 */
function normalizeRow(row) {
  if (!row || typeof row !== 'object') return {};
  const normalized = {};
  const keys = Object.keys(row).sort();
  for (const key of keys) {
    normalized[key.toLowerCase()] = normalizeValue(row[key]);
  }
  return normalized;
}

/**
 * Strips comments and extraneous whitespace from SQL queries.
 */
function cleanSql(sql) {
  if (!sql) return '';
  return sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[;\s]+|[;\s]+$/g, '')
    .trim();
}

/**
 * Translates low-level internal engine errors into clear, actionable SQL messages.
 */
function formatSqlError(err) {
  const msg = err?.message || String(err) || 'SQL Syntax Error';
  const lower = msg.toLowerCase();

  if (
    lower.includes('databaseid') ||
    lower.includes('compile') ||
    lower.includes('sqlcache') ||
    lower.includes('cannot read properties of undefined') ||
    lower.includes('cannot read property')
  ) {
    return 'SQL Syntax Error: Incomplete or invalid query structure. Please verify your SELECT columns, FROM table name, and WHERE conditions.';
  }
  if (lower.includes('table does not exist') || lower.includes('is not exists') || lower.includes('no table found')) {
    return `No table found: ${msg}. Check your table spelling in the Schema explorer.`;
  }
  if (lower.includes('column does not exist')) {
    return `Column not found: ${msg}. Check your column spelling in the Schema explorer.`;
  }
  return msg;
}

/**
 * Automatically creates and augments tables and columns referenced in custom AI queries
 * so that AI question sets always execute against a valid mock dataset.
 */
export function ensureDynamicTablesForQuery(query = '', expectedQuery = '') {
  try {
    ensureAlaSqlDatabase();
    const combined = `${query} ${expectedQuery}`;
    if (!combined.trim()) return;

    // 1. Extract table names from FROM and JOIN
    const fromMatches = [...combined.matchAll(/\b(?:FROM|JOIN)\s+([a-zA-Z0-9_]+)/gi)];
    const tableNames = new Set();
    fromMatches.forEach(m => {
      if (m[1]) tableNames.add(m[1].trim());
    });

    // 2. Extract column references from query
    const colMatches = [...combined.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g)];
    const sqlKeywords = new Set([
      'select', 'from', 'where', 'and', 'or', 'not', 'in', 'is', 'null',
      'join', 'inner', 'left', 'right', 'outer', 'cross', 'on', 'group',
      'by', 'order', 'having', 'asc', 'desc', 'limit', 'as', 'count',
      'sum', 'avg', 'min', 'max', 'case', 'when', 'then', 'else', 'end',
      'distinct', 'between', 'like', 'int', 'string', 'number', 'create',
      'table', 'insert', 'into', 'values', 'update', 'delete', 'set'
    ]);

    tableNames.forEach(tblName => {
      let existingTable = alasql.tables && alasql.tables[tblName];

      // If table doesn't exist, create it with rich mock records
      if (!existingTable) {
        const mockRows = [];
        const idMatch = combined.match(/\b(\d{3,6})\b/);
        const targetId = idMatch ? Number(idMatch[1]) : 12345;

        for (let i = 1; i <= 6; i++) {
          const rowId = i === 1 ? targetId : (1000 + i);
          const row = {
            id: rowId,
            orderid: rowId,
            OrderID: rowId,
            order_id: rowId,
            ordertime: `2026-09-30 02:1${i}:00`,
            OrderTime: `2026-09-30 02:1${i}:00`,
            order_time: `2026-09-30 02:1${i}:00`,
            orderstatus: i === 1 ? 'IN_PREP' : (i % 2 === 0 ? 'COMPLETED' : 'PENDING'),
            OrderStatus: i === 1 ? 'IN_PREP' : (i % 2 === 0 ? 'COMPLETED' : 'PENDING'),
            order_status: i === 1 ? 'IN_PREP' : (i % 2 === 0 ? 'COMPLETED' : 'PENDING'),
            terminalid: 100 + i,
            TerminalID: 100 + i,
            terminal_id: 100 + i,
            status: i === 1 ? 'IN_PREP' : 'COMPLETED',
            total_amount: (i * 35.50),
            price: (i * 12.00),
            item_name: `Product ${i}`,
            is_available: 1
          };
          mockRows.push(row);
        }

        try {
          alasql(`CREATE TABLE ${tblName};`);
          alasql.tables[tblName].data = mockRows;
        } catch {
          // ignore
        }
        existingTable = alasql.tables[tblName];
      }

      // If table exists, ensure all referenced columns exist in the table objects
      if (existingTable && Array.isArray(existingTable.data)) {
        const firstRow = existingTable.data[0] || {};
        
        colMatches.forEach(m => {
          const word = m[1];
          const wLower = word.toLowerCase();
          if (!sqlKeywords.has(wLower) && !tableNames.has(word) && isNaN(word)) {
            // Check if column exists in any casing
            const hasExact = Object.prototype.hasOwnProperty.call(firstRow, word);
            const hasLower = Object.prototype.hasOwnProperty.call(firstRow, wLower);

            if (!hasExact && !hasLower) {
              const numValMatch = combined.match(new RegExp(`${word}\\s*=\\s*(\\d+)`, 'i'));
              const defaultVal = numValMatch ? Number(numValMatch[1]) : 12345;
              
              existingTable.data.forEach((r, idx) => {
                r[word] = idx === 0 ? defaultVal : (100 + idx);
                r[wLower] = idx === 0 ? defaultVal : (100 + idx);
              });
            } else if (!hasExact && hasLower) {
              // Copy lowercase value to exact casing for case-sensitive queries
              existingTable.data.forEach(r => {
                r[word] = r[wLower];
              });
            }
          }
        });
      }
    });
  } catch (err) {
    console.warn('Auto table/column synthesis warning:', err);
  }
}

/**
 * Validates user SQL query against the expected SQL query using AlaSQL
 */
export function validateQuery(userQuery, expectedQuery) {
  const startTime = performance.now();
  const queryToRun = cleanSql(userQuery);

  if (!queryToRun) {
    return {
      isCorrect: false,
      userResult: null,
      expectedResult: null,
      error: 'Please enter an executable SQL statement before checking your answer.',
      executionTimeMs: 0,
      feedback: 'Query is empty or contains only comments.'
    };
  }

  // Ensure AlaSQL database is healthy and dynamic tables exist
  ensureAlaSqlDatabase();
  ensureDynamicTablesForQuery(queryToRun, expectedQuery);

  let userResult;
  let userExecutionTime;
  try {
    const runStart = performance.now();
    userResult = alasql(queryToRun);
    userExecutionTime = Math.round((performance.now() - runStart) * 100) / 100;
  } catch (err) {
    // Retry once with aggressive dynamic schema augmentation if table/column missing
    ensureDynamicTablesForQuery(queryToRun, expectedQuery);
    try {
      userResult = alasql(queryToRun);
      userExecutionTime = Math.round((performance.now() - startTime) * 100) / 100;
    } catch (retryErr) {
      const friendlyError = formatSqlError(retryErr);
      return {
        isCorrect: false,
        userResult: null,
        expectedResult: null,
        error: friendlyError,
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        feedback: friendlyError
      };
    }
  }

  // Ensure result is an array of objects
  if (!Array.isArray(userResult)) {
    return {
      isCorrect: false,
      userResult: userResult ? [userResult] : [],
      expectedResult: null,
      error: 'Query did not return a valid result set. Ensure you are using a SELECT query.',
      executionTimeMs: userExecutionTime,
      feedback: 'Invalid result format. Please use a SELECT query.'
    };
  }

  let expectedResult;
  try {
    ensureAlaSqlDatabase();
    ensureDynamicTablesForQuery(queryToRun, expectedQuery);
    const cleanExpected = cleanSql(expectedQuery);
    expectedResult = alasql(cleanExpected);
  } catch (err) {
    console.error('Expected query execution failed:', err);
    expectedResult = [];
  }

  // 1. Compare row counts
  if (userResult.length !== expectedResult.length) {
    return {
      isCorrect: false,
      userResult,
      expectedResult,
      error: null,
      executionTimeMs: userExecutionTime,
      feedback: `Row count mismatch: Your query returned ${userResult.length} row(s), but ${expectedResult.length} row(s) were expected.`
    };
  }

  // If both are empty and expected 0 rows, check columns
  if (expectedResult.length === 0 && userResult.length === 0) {
    return {
      isCorrect: true,
      userResult,
      expectedResult,
      error: null,
      executionTimeMs: userExecutionTime,
      feedback: 'Correct! Both queries returned 0 rows matching criteria.'
    };
  }

  // 2. Check column count and names (case-insensitive)
  const expectedCols = Object.keys(expectedResult[0] || {}).map(c => c.toLowerCase()).sort();
  const userCols = Object.keys(userResult[0] || {}).map(c => c.toLowerCase()).sort();

  if (expectedCols.length !== userCols.length) {
    return {
      isCorrect: false,
      userResult,
      expectedResult,
      error: null,
      executionTimeMs: userExecutionTime,
      feedback: `Column count mismatch: Expected ${expectedCols.length} column(s) [${expectedCols.join(', ')}], but got ${userCols.length} [${userCols.join(', ')}].`
    };
  }

  // 3. Normalize rows
  const normalizedUser = userResult.map(normalizeRow);
  const normalizedExpected = expectedResult.map(normalizeRow);

  // Check if query had ORDER BY
  const hasOrderBy = /\border\s+by\b/i.test(expectedQuery);

  if (hasOrderBy) {
    // Check in strict order
    let match = true;
    for (let i = 0; i < normalizedExpected.length; i++) {
      if (JSON.stringify(normalizedUser[i]) !== JSON.stringify(normalizedExpected[i])) {
        match = false;
        break;
      }
    }
    if (match) {
      return {
        isCorrect: true,
        userResult,
        expectedResult,
        error: null,
        executionTimeMs: userExecutionTime,
        feedback: `Correct! ${userResult.length} row(s) matched in exact order.`
      };
    }
  }

  // Order-agnostic comparison
  const userStringified = normalizedUser.map(r => JSON.stringify(r)).sort();
  const expectedStringified = normalizedExpected.map(r => JSON.stringify(r)).sort();

  let allMatch = true;
  for (let i = 0; i < expectedStringified.length; i++) {
    if (userStringified[i] !== expectedStringified[i]) {
      allMatch = false;
      break;
    }
  }

  if (allMatch) {
    return {
      isCorrect: true,
      userResult,
      expectedResult,
      error: null,
      executionTimeMs: userExecutionTime,
      feedback: `Correct! Output data matches expected result (${userResult.length} row${userResult.length === 1 ? '' : 's'}).`
    };
  }

  return {
    isCorrect: false,
    userResult,
    expectedResult,
    error: null,
    executionTimeMs: userExecutionTime,
    feedback: 'Data mismatch: The rows or values returned do not match the expected dataset. Check your filtering or aggregation criteria.'
  };
}
