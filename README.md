# Control de asistencia

Web App responsive para registrar la asistencia de 30 participantes durante 10 sesiones.

## Arquitectura y tecnologías

Google Sheets almacena los datos; Google Apps Script valida y guarda los registros. El frontend mobile-first utiliza HTML, CSS y JavaScript en un único archivo y se comunica mediante `google.script.run`, con manejadores de éxito y error. No utiliza frameworks ni dependencias externas. clasp sincroniza el proyecto y Git/GitHub permiten controlar sus versiones.

## Estructura

```text
control_asistencia/
├── .clasp.json       # Vinculación con el proyecto Apps Script
├── appsscript.json   # Manifiesto, zona horaria y runtime
├── Code.gs           # doGet(): sirve la interfaz
├── Config.gs         # SPREADSHEET_ID, HOJAS y acceso al libro
├── Setup.gs          # Creación de hojas y datos iniciales
├── Asistencia.gs     # Consulta, validación y guardado de asistencia
├── index.html        # HTML, CSS y JavaScript del frontend
├── README.md         # Documentación
└── .gitignore        # Exclusiones de Git
```

## Preparación

1. Crea una hoja de cálculo llamada **BD_Control_Asistencia**.
2. Copia su identificador (entre `/d/` y `/edit` en su dirección) y reemplaza el marcador `PEGA_AQUI_EL_ID_DE_BD_CONTROL_ASISTENCIA` en `Config.gs`.
3. Con clasp instalado y autenticado (`clasp login`), ejecuta `clasp push` desde este directorio. Se utiliza la vinculación existente de `.clasp.json`.
4. Abre el proyecto en Apps Script y ejecuta `prepararBaseDatos()`. Autoriza el acceso solicitado.
5. Implementa el proyecto como aplicación web desde Apps Script. Configura la ejecución y el acceso para las personas responsables de capturar asistencia. Usa la dirección que genere Google; este repositorio no incluye una URL de implementación.

El manifiesto usa `America/Mexico_City`, `STACKDRIVER` y `V8`. El identificador del libro se configura en `Config.gs`; no se utilizan Script Properties.

## Datos

| Hoja | Columnas, en orden |
|---|---|
| Participantes | id_participante, nombre, correo, activo |
| Sesiones | id_sesion, numero, fecha, tema, estado |
| Asistencias | id_sesion, id_participante, estado, hora_registro |

La inicialización carga P01–P30, con nombres Participante 01–Participante 30, correos participante01@ejemplo.com–participante30@ejemplo.com y `activo = true`. Carga S01–S10 con temas Sesión 1–Sesión 10, fechas semanales desde la inicialización y estado `PENDIENTE`. Puede ejecutarse nuevamente sin duplicar ni reemplazar los datos existentes.

## Uso y duplicados

Selecciona una sesión, marca los presentes y guarda. Las casillas sin marcar se guardan como `AUSENTE`; las marcadas, como `PRESENTE`. Una sesión sin captura muestra inicialmente las casillas desmarcadas, pero no escribe ausencias hasta guardar. El frontend muestra participantes activos.

El backend exige una captura completa de los participantes activos y valida sus identificadores y estados. La combinación `id_sesion + id_participante` identifica cada asistencia: si existe se actualiza; si no, se inserta. Un bloqueo de Apps Script protege la lectura y escritura frente a guardados simultáneos. Cada captura guarda `new Date()` en `hora_registro` y cambia la sesión a `REGISTRADA`. Las fechas que se devuelven al frontend se serializan como texto.

Evita editar manualmente las asistencias o escribir desde otros proyectos, pues Sheets no impone una restricción de unicidad. Si se detectan duplicados existentes, el guardado informa del problema.

## Sincronización y versiones

Usa `clasp push` para enviar cambios locales. `clasp pull` descarga cambios remotos y puede reemplazar archivos locales; revisa el estado de Git antes de ejecutarlo. Después de cambiar una implementación versionada, actualiza su versión en Apps Script para publicar los cambios.

Revisa los cambios con `git status` y `git diff`, crea commits y envíalos al remoto de GitHub configurado mediante `git push`. No incluyas credenciales en el repositorio. `.clasp.json` conserva la vinculación local y está excluido por el `.gitignore` existente.
