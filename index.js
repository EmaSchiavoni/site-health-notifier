const SITES_LIST = process.env.SITES_TO_CHECK || '';

const sites = SITES_LIST.split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0 && !line.startsWith('#'));

async function runHealthcheck() {
  const timestamp = new Date().toISOString();

  for (const targetUrl of sites) {
    const startTime = Date.now();
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'HealthCheck-Agent/1.0' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorMsg = `HTTP Error ${response.status} ${response.statusText}`;
        await logFailure(targetUrl, errorMsg);
      }
    } catch (err) {
      await logFailure(targetUrl, err.message);
    }
  }
}

async function logFailure(targetUrl, reason) {
  console.error(`Healthcheck Fallido\n\nURL: ${targetUrl}\nCausa: ${reason}\nFecha: ${new Date().toISOString()}`);
}

runHealthcheck();