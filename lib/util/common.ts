var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

export function debug(...x: any[]): void {
  if (!_DEBUG) return;
  console.log(...x);
};

export function assert(statement: any, err?: string, log?: any): asserts statement {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};