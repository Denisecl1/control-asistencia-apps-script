function prepararBaseDatos() {
  const bloqueo = LockService.getScriptLock();
  bloqueo.waitLock(30000);
  try {
    const libro = obtenerLibro_();
    const participantes = prepararHoja_(libro, HOJAS.PARTICIPANTES,
      ['id_participante', 'nombre', 'correo', 'activo']);
    const sesiones = prepararHoja_(libro, HOJAS.SESIONES,
      ['id_sesion', 'numero', 'fecha', 'tema', 'estado']);
    prepararHoja_(libro, HOJAS.ASISTENCIAS,
      ['id_sesion', 'id_participante', 'estado', 'hora_registro']);

    const idsParticipantes = new Set(leerFilas_(participantes).map(fila => String(fila[0])));
    const nuevosParticipantes = [];
    for (let numero = 1; numero <= 30; numero++) {
      const sufijo = String(numero).padStart(2, '0');
      if (!idsParticipantes.has('P' + sufijo)) {
        nuevosParticipantes.push(['P' + sufijo, 'Participante ' + sufijo,
          'participante' + sufijo + '@ejemplo.com', true]);
      }
    }
    agregarFilas_(participantes, nuevosParticipantes);

    const filasSesiones = leerFilas_(sesiones);
    const idsSesiones = new Set(filasSesiones.map(fila => String(fila[0])));
    // Conserva el calendario original incluso si faltan sesiones al repetir el setup.
    const existente = filasSesiones.find(fila => fila[2] instanceof Date && Number(fila[1]) >= 1);
    const fechaBase = existente ? new Date(existente[2].getTime()) : new Date();
    if (existente) fechaBase.setDate(fechaBase.getDate() - (Number(existente[1]) - 1) * 7);
    const nuevasSesiones = [];
    for (let numero = 1; numero <= 10; numero++) {
      const id = 'S' + String(numero).padStart(2, '0');
      if (!idsSesiones.has(id)) {
        const fecha = new Date(fechaBase.getTime());
        fecha.setDate(fecha.getDate() + (numero - 1) * 7);
        nuevasSesiones.push([id, numero, fecha, 'Sesión ' + numero, 'PENDIENTE']);
      }
    }
    agregarFilas_(sesiones, nuevasSesiones);
    if (sesiones.getLastRow() > 1) {
      sesiones.getRange(2, 3, sesiones.getLastRow() - 1, 1).setNumberFormat('yyyy-mm-dd');
    }
    SpreadsheetApp.flush();
    return 'Base de datos preparada: 30 participantes y 10 sesiones.';
  } finally {
    bloqueo.releaseLock();
  }
}

function prepararHoja_(libro, nombre, encabezados) {
  const hoja = libro.getSheetByName(nombre) || libro.insertSheet(nombre);
  if (hoja.getLastRow() === 0) {
    hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
    hoja.setFrozenRows(1);
  } else {
    const actuales = hoja.getRange(1, 1, 1, encabezados.length).getValues()[0];
    if (actuales.some((valor, indice) => valor !== encabezados[indice])) {
      throw new Error('Encabezados incorrectos en la hoja ' + nombre + '.');
    }
  }
  return hoja;
}

function leerFilas_(hoja) {
  return hoja.getLastRow() < 2 ? [] :
    hoja.getRange(2, 1, hoja.getLastRow() - 1, hoja.getLastColumn()).getValues();
}

function agregarFilas_(hoja, filas) {
  if (filas.length) hoja.getRange(hoja.getLastRow() + 1, 1, filas.length, filas[0].length).setValues(filas);
}
