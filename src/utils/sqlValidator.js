import alasql from 'alasql';

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
 * Validates user SQL query against the expected SQL query using AlaSQL
 */
export function validateQuery(userQuery, expectedQuery) {
  const startTime = performance.now();

  if (!userQuery || !userQuery.trim()) {
    return {
      isCorrect: false,
      userResult: null,
      expectedResult: null,
      error: 'Please enter a SQL query before checking your answer.',
      executionTimeMs: 0,
      feedback: 'Query is empty.'
    };
  }

  let userResult;
  let userExecutionTime;
  try {
    const queryToRun = userQuery.trim().replace(/;+\s*$/, '');
    const runStart = performance.now();
    userResult = alasql(queryToRun);
    userExecutionTime = Math.round((performance.now() - runStart) * 100) / 100;
  } catch (err) {
    const isTableNotFound = (err.message || '').toLowerCase().includes('table');
    return {
      isCorrect: false,
      userResult: null,
      expectedResult: null,
      error: err.message || 'SQL Syntax Error',
      executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
      feedback: isTableNotFound
        ? `No table found: ${err.message}. Check your table spelling in the Schema explorer.`
        : `Query execution failed: ${err.message || 'SQL Syntax or runtime error'}`
    };
  }

  // Ensure result is an array of objects
  if (!Array.isArray(userResult)) {
    return {
      isCorrect: false,
      userResult: userResult ? [userResult] : [],
      expectedResult: null,
      error: 'Query did not return a valid result set. Ensure you are using a SELECT query.',
      executionTimeMs: userExecutionTime,
      feedback: 'Invalid result format.'
    };
  }

  let expectedResult;
  try {
    const cleanExpected = expectedQuery.trim().replace(/;+\s*$/, '');
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

  // 2. Check column count and names
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
