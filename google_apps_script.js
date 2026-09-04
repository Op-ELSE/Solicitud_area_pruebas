/**
 * Google Apps Script - Manejador de Solicitudes de Ingreso a Área de Pruebas (ABB)
 * 
 * INSTRUCCIONES PARA ACTIVAR:
 * 1. Ve a https://script.google.com/ y crea un "Nuevo proyecto".
 * 2. Borra el código existente y pega este archivo completo.
 * 3. Configura tu correo electrónico en la variable DESTINATARIO_CORREO abajo.
 * 4. Haz clic en "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 5. Selecciona tipo: "Aplicación web" (Web App).
 * 6. Configura:
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone - incluso anónima).
 * 7. Haz clic en "Implementar", autoriza los permisos y COPIA la URL de la aplicación web.
 * 8. Pega esa URL en el formulario web o en la configuración de la plataforma.
 */

// CONFIGURACIÓN: Ingresa tu correo electrónico aquí
const DESTINATARIO_CORREO = "tu_correo@abb.com"; // <-- CAMBIA ESTO POR TU CORREO

function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    const radicado = data.radicado || ("ABB-AP-" + Math.floor(100000 + Math.random() * 900000));
    const nombre = data.nombre || "No especificado";
    const fecha = data.fecha || "No especificada";
    const motivo = data.motivo || "No especificado";
    const fechaRegistro = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });

    // Asunto del correo
    const asunto = `[ABB Área de Pruebas] Solicitud de Ingreso - ${nombre} (${radicado})`;

    // Cuerpo en formato HTML profesional estilo ABB
    const htmlBody = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #E0E0E0; border-top: 5px solid #FF000F; background: #FFFFFF;">
        <div style="padding: 24px; border-bottom: 1px solid #EEEEEE; display: flex; align-items: center; justify-content: space-between;">
          <h2 style="color: #FF000F; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">ABB</h2>
          <span style="background: #F4F4F4; padding: 6px 12px; font-size: 12px; font-weight: bold; color: #555; border-radius: 3px;">
            ${radicado}
          </span>
        </div>
        
        <div style="padding: 28px;">
          <h3 style="color: #1A1A1A; margin-top: 0; font-size: 18px;">Notificación de Solicitud de Ingreso al Área de Pruebas</h3>
          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            Se ha registrado una nueva solicitud formal de acceso con aceptación obligatoria de los procedimientos y normativas de seguridad.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="background-color: #F9F9F9; border-bottom: 1px solid #EFEFEF;">
              <td style="padding: 10px 14px; font-weight: bold; color: #333; width: 35%;">Radicado:</td>
              <td style="padding: 10px 14px; color: #111; font-family: monospace; font-weight: bold;">${radicado}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EFEFEF;">
              <td style="padding: 10px 14px; font-weight: bold; color: #333;">Solicitante:</td>
              <td style="padding: 10px 14px; color: #111;">${nombre}</td>
            </tr>
            <tr style="background-color: #F9F9F9; border-bottom: 1px solid #EFEFEF;">
              <td style="padding: 10px 14px; font-weight: bold; color: #333;">Fecha requerida:</td>
              <td style="padding: 10px 14px; color: #111;">${fecha}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EFEFEF;">
              <td style="padding: 10px 14px; font-weight: bold; color: #333;">Fecha de registro:</td>
              <td style="padding: 10px 14px; color: #111;">${fechaRegistro}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #333; vertical-align: top;">Motivo del Trabajo:</td>
              <td style="padding: 10px 14px; color: #111; white-space: pre-wrap;">${motivo}</td>
            </tr>
          </table>

          <div style="background-color: #FAFAFA; border: 1px solid #E5E5E5; border-left: 4px solid #00875A; padding: 14px 18px; margin-top: 25px; border-radius: 2px;">
            <h4 style="margin: 0 0 8px 0; color: #00875A; font-size: 14px;">✓ Aceptación de Normativas Confirmada:</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #444; line-height: 1.6;">
              <li>Ax1 Listado Personal Autorizado.pdf</li>
              <li>Ax2 Listado EPP mínimo.pdf</li>
              <li>Uso del área de pruebas ELSE v2.pdf</li>
            </ul>
          </div>
        </div>

        <div style="background: #F4F4F4; padding: 14px 24px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #EAEAEA;">
          Este es un correo automático emitido por la Plataforma de Área de Pruebas de ABB. Por favor no responder directamente a este mensaje.
        </div>
      </div>
    `;

    // Enviar correo
    MailApp.sendEmail({
      to: DESTINATARIO_CORREO,
      subject: asunto,
      htmlBody: htmlBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", radicado: radicado }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Servicio de recepción de solicitudes de Área de Pruebas ABB activo.");
}
