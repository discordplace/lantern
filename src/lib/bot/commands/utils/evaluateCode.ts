import { inspect } from 'node:util';

/**
 * Evaluates a string of code, supporting both synchronous and asynchronous execution.
 *
 * This function checks if the provided code starts with "async" to determine whether to
 * evaluate it as an asynchronous self-invoking function or as a regular synchronous expression.
 * The evaluated result or error is then formatted using Node.js's inspect function with a depth
 * of 0.
 *
 * @param code - The string of code to evaluate. If it starts with "async", it will be wrapped in
 * an async IIFE; otherwise, it will be evaluated directly.
 */
async function evaluateCode(code: string): Promise<{ result: string; hasError: boolean }> {
  try {
    const isAsync = code.startsWith('async');
    // eslint-disable-next-line security/detect-eval-with-expression
    const result = await eval(isAsync ? `(async () => { ${code} })()` : code);

    return {
      result: inspect(result, { depth: 0 }),
      hasError: false
    };
  } catch (error) {
    return {
      result: inspect(error, { depth: 0 }),
      hasError: true
    };
  }
}

export default evaluateCode;