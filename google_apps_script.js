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
    const id = data.id || ("solicitud_" + new Date().getTime());
    const nombre = data.nombre || data.solicitante || "No especificado";
    const fecha = data.fecha || "No especificada";
    const horaIngreso = data.horaIngreso || "No especificada";
    const horaTermino = data.horaTermino || "No especificada";
    const motivo = data.motivo || "No especificado";
    const fechaRegistro = data.fechaRegistro || new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });

    // Procesar documentos aceptados
    let docsAceptados = [];
    if (typeof data.documentosAceptados === "string") {
      try {
        docsAceptados = JSON.parse(data.documentosAceptados);
      } catch (err) {
        docsAceptados = [data.documentosAceptados];
      }
    } else if (Array.isArray(data.documentosAceptados)) {
      docsAceptados = data.documentosAceptados;
    } else {
      docsAceptados = [
        "Uso del área de pruebas ELSE v2.pdf",
        "Ax1 Listado Personal Autorizado.pdf",
        "Ax2 Listado EPP mínimo.pdf"
      ];
    }

    const normativasFormateadas = docsAceptados.map(function(doc) {
      if (typeof doc === "string") {
        return {
          documento: doc,
          aceptado: true
        };
      }
      return doc;
    });

    // Construcción del objeto JSON con los campos de la solicitud
    const payloadJson = {
      id: id,
      radicado: radicado,
      solicitante: nombre,
      fecha: fecha,
      horaIngreso: horaIngreso,
      horaTermino: horaTermino,
      motivo: motivo,
      fechaRegistro: fechaRegistro,
      documentosAceptados: normativasFormateadas
    };

    // Formato RAW_JSON requerido
    const rawJsonText = "RAW_JSON\t\n" + JSON.stringify(payloadJson, null, 2);

    // Asunto del correo
    const asunto = `[ABB Área de Pruebas] Solicitud de Ingreso - ${nombre} (${radicado})`;

    // Enviar correo con formato RAW_JSON en texto plano y bloque preformateado HTML
    MailApp.sendEmail({
      to: DESTINATARIO_CORREO,
      subject: asunto,
      body: rawJsonText,
      htmlBody: `<pre style="font-family: Consolas, 'Courier New', monospace; font-size: 13px; background-color: #f8f9fa; color: #212529; padding: 16px; border: 1px solid #e9ecef; border-radius: 4px; white-space: pre-wrap; word-break: break-word;">${rawJsonText}</pre>`
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", radicado: radicado, id: id }))
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
