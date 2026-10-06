const SPREADSHEET_ID = '12V9njakMBSCxQHZ6aPrXp7JY5FDQ8D9Vzf6RAZf3hio';
const HOJAS = {
  PARTICIPANTES: 'Participantes',
  SESIONES: 'Sesiones',
  ASISTENCIAS: 'Asistencias'
};

function obtenerLibro_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}
