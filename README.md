# Site healthcheck notificator

## Descripción

Este proyecto es un monitor liviano de disponibilidad diseñado para ejecutarse de forma periódica e independiente mediante GitHub Actions. Permite verificar el estado de múltiples sitios web y APIs sin necesidad de mantener un servidor en ejecución continua.

## Funcionamiento

1. **Planificación:** GitHub Actions ejecuta el script automáticamente a intervalos definidos mediante un disparador de tipo `cron` o de forma manual mediante `workflow_dispatch`.
2. **Evaluación:** El script procesa la lista de URLs configuradas y realiza peticiones HTTP GET con un tiempo límite de respuesta (*timeout*) de 10 segundos.
3. **Registro Exitoso:** Si la petición retorna un código de estado en el rango exitoso (2xx), el resultado se envía mediante un cuerpo JSON en una petición HTTP `POST` hacia un endpoint de logs externo.
4. **Notificación de Fallos:** Ante un error HTTP (códigos 4xx/5xx) o una falla a nivel de red/timeout, se emiten alertas concurrentes a través de Telegram y correo electrónico (API REST de Brevo).

---

## Configuración de Secretos en GitHub

Para el correcto funcionamiento en un repositorio público o privado, es necesario configurar las siguientes variables de entorno o secretos:

| Nombre | Descripción | Ejemplo de valor |
| --- | --- | --- |
| `SITES_TO_CHECK` | Lista de URLs a evaluar, separadas por saltos de línea. | `[https://sitio1.com](https://sitio1.com)`<br>

<br>`[https://api.sitio2.com/health](https://api.sitio2.com/health)` |
| `LOG_ENDPOINT` | Endpoint HTTP que recibirá los registros exitosos mediante POST. | `[https://api.midominio.com/logs](https://api.midominio.com/logs)` |
| `TELEGRAM_BOT_TOKEN` | Token de acceso del bot de Telegram. | `123456789:ABCdefGHIjklMNOpqrsTUVwxyZ` |
| `TELEGRAM_CHAT_ID` | Identificador único del chat o canal receptor en Telegram. | `-100123456789` |
| `BREVO_API_KEY` | Clave API V3 generada en la plataforma Brevo. | `xkeysib-...` |
| `NOTIFY_EMAIL_FROM` | Dirección de correo electrónico del remitente (verificada en Brevo). | `alertas@midominio.com` |
| `NOTIFY_EMAIL_TO` | Dirección de correo electrónico que recibirá las notificaciones. | `admin@midominio.com` |

---

## Estructura del Payload enviado al LOG_ENDPOINT

Cuando un sitio responde correctamente, el script envía una petición `POST` con la cabecera `Content-Type: application/json` conteniendo el siguiente cuerpo:

```json
{
  "url": "https://ejemplo.com",
  "status": 200,
  "responseTimeMs": 142,
  "timestamp": "2026-09-24T04:09:51.000Z",
  "healthy": true
}

```

---

## Ejecución Local

Para probar el script en un entorno de desarrollo local, defina las variables de entorno necesarias y ejecute:

```bash
pnpm install
SITES_TO_CHECK="https://httpbin.org/status/200" LOG_ENDPOINT="https://httpbin.org/post" node index.js

```