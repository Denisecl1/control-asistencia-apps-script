function obtenerSesiones() {
  const libro = obtenerLibro_();
  return leerFilas_(obtenerHoja_(libro, HOJAS.SESIONES)).map(fila => ({
    id_sesion: String(fila[0]),
    numero: Number(fila[1]),
    fecha: fila[2] instanceof Date
      ? Utilities.formatDate(fila[2], 'America/Mexico_City', 'yyyy-MM-dd') : String(fila[2]),
    tema: String(fila[3]),
    estado: String(fila[4])
  })).sort((a, b) => a.numero - b.numero);
}

function obtenerParticipantes(idSesion) {
  const libro = obtenerLibro_();
  validarSesion_(libro, idSesion);
  const estados = new Map();
  leerFilas_(obtenerHoja_(libro, HOJAS.ASISTENCIAS)).forEach(fila => {
    if (fila[0] === idSesion) estados.set(String(fila[1]), String(fila[2]));
  });
  return leerFilas_(obtenerHoja_(libro, HOJAS.PARTICIPANTES))
    .filter(fila => fila[3] === true)
    .map(fila => ({
      id_participante: String(fila[0]), nombre: String(fila[1]), correo: String(fila[2]),
      estado: estados.get(String(fila[0])) || 'PENDIENTE'
    })).sort((a, b) => a.id_participante.localeCompare(b.id_participante));
}

function guardarAsistencia(idSesion, participantes) {
  const bloqueo = LockService.getScriptLock();
  bloqueo.waitLock(30000);
  try {
    const libro = obtenerLibro_();
    validarSesion_(libro, idSesion);
    const activos = new Set(leerFilas_(obtenerHoja_(libro, HOJAS.PARTICIPANTES))
      .filter(fila => fila[3] === true).map(fila => String(fila[0])));
    if (!Array.isArray(participantes) || participantes.length !== activos.size || !activos.size) {
      throw new Error('Envía la asistencia de todos los participantes activos.');
    }
    const recibidos = new Set();
    participantes.forEach(participante => {
      if (!participante || !activos.has(participante.id_participante) ||
          recibidos.has(participante.id_participante) ||
          !['PRESENTE', 'AUSENTE'].includes(participante.estado)) {
        throw new Error('Hay participantes duplicados, desconocidos o estados inválidos.');
      }
      recibidos.add(participante.id_participante);
    });
    const hoja = obtenerHoja_(libro, HOJAS.ASISTENCIAS);
    const filas = leerFilas_(hoja);
    const indices = new Map();
    filas.forEach((fila, indice) => {
      const clave = String(fila[0]) + ':' + String(fila[1]);
      if (indices.has(clave)) throw new Error('Existen asistencias duplicadas en la hoja. Corrige los datos antes de guardar.');
      indices.set(clave, indice);
    });
    const hora = new Date();
    participantes.forEach(participante => {
      const clave = idSesion + ':' + participante.id_participante;
      const registro = [idSesion, participante.id_participante, participante.estado, hora];
      if (indices.has(clave)) filas[indices.get(clave)] = registro;
      else {
        indices.set(clave, filas.length);
        filas.push(registro);
      }
    });
    hoja.getRange(2, 1, filas.length, 4).setValues(filas);
    marcarSesionRegistrada_(idSesion);
    SpreadsheetApp.flush();
    return { mensaje: 'Asistencia guardada correctamente.', id_sesion: idSesion,
      presentes: participantes.filter(p => p.estado === 'PRESENTE').length };
  } finally {
    bloqueo.releaseLock();
  }
}

function marcarSesionRegistrada_(idSesion) {
  const hoja = obtenerHoja_(obtenerLibro_(), HOJAS.SESIONES);
  const indice = leerFilas_(hoja).findIndex(fila => fila[0] === idSesion);
  if (indice < 0) throw new Error('La sesión no existe.');
  hoja.getRange(indice + 2, 5).setValue('REGISTRADA');
}

function obtenerHoja_(libro, nombre) {
  const hoja = libro.getSheetByName(nombre);
  if (!hoja) throw new Error('Falta la hoja ' + nombre + '. Ejecuta prepararBaseDatos().');
  return hoja;
}

function validarSesion_(libro, idSesion) {
  if (typeof idSesion !== 'string' || !/^S(0[1-9]|10)$/.test(idSesion) ||
      !leerFilas_(obtenerHoja_(libro, HOJAS.SESIONES)).some(fila => fila[0] === idSesion)) {
    throw new Error('Selecciona una sesión válida.');
  }
}
