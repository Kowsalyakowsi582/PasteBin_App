/**
 * Get the current time, respecting TEST_MODE for deterministic testing
 */
export function getCurrentTime(headers: Headers): Date {
  if (process.env.TEST_MODE === "1") {
    const testNowMs = headers.get("x-test-now-ms");
    if (testNowMs) {
      return new Date(Number.parseInt(testNowMs, 10));
    }
  }
  return new Date();
}
