import { sendOkLog } from "./okLog";
import { sendEmailNotification } from "./emailNotification";

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

      const responseTimeMs = Date.now() - startTime;

      if (response.ok) {
        await sendOkLog({
          url: targetUrl,
          status: response.status,
          responseTimeMs,
          timestamp,
          healthy: true
        });
      } else {
        const errorMsg = `HTTP Error ${response.status} ${response.statusText}`;
        await notifyFailure(targetUrl, errorMsg, responseTimeMs);
      }
    } catch (err) {
      const responseTimeMs = Date.now() - startTime;
      await notifyFailure(targetUrl, err.message, responseTimeMs);
    }
  }
}

async function notifyFailure(targetUrl, reason, duration) {
  const time = new Date().toISOString();
  const emailSubject = `[Alerta Healthcheck] Fallo detectado en servicio`;
  const emailBody = `Fallo detectado durante el chequeo:<br><br><b>URL:</b> ${targetUrl}<br><b>Error:</b> ${reason}<br><b>Latencia:</b> ${duration}ms<br><b>Fecha UTC:</b> ${time}`;

  await sendEmailNotification(emailSubject, emailBody);
}

runHealthcheck();