import { inspect } from 'node:util';

async function evaluateCode(code: string) {
  const isAsync = code.includes('async') || code.includes('await');

  let result;
  let hasError = false;

  try {
    // eslint-disable-next-line security/detect-eval-with-expression
    result = await eval(isAsync ? `(async () => { ${code} })()` : code);
    if (typeof result !== 'string') result = formatResult(result);
  } catch (error) {
    hasError = true;
    result = error.stack;
  }

  return {
    result,
    hasError
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatResult(result: any) {
  return inspect(result, { depth: 4 });
}

export default evaluateCode;