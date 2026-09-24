const LOG_ENDPOINT = process.env.LOG_ENDPOINT;

export async function sendOkLog(logData) {
  if (!LOG_ENDPOINT) return;
  await fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData)
  });
}
