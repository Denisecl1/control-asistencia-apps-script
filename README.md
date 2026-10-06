# ✅ Control de Asistencia

Web App responsive desarrollada con **Google Apps Script** para registrar y consultar la asistencia de **30 participantes durante 10 sesiones**, utilizando **Google Sheets** como almacenamiento.

El proyecto fue desarrollado localmente desde **Visual Studio Code**, sincronizado con Google Apps Script mediante **clasp** y versionado con **Git y GitHub**.

---

## 📌 Características principales

- 📱 Interfaz responsive y mobile-first.
- 👥 Gestión de 30 participantes.
- 📅 Control de 10 sesiones.
- ✅ Registro de presentes y ausentes.
- 🔄 Recuperación de asistencias previamente guardadas.
- 💾 Persistencia de datos en Google Sheets.
- 🚫 Prevención de registros duplicados.
- 📊 Contador de participantes presentes.
- ⚡ Comunicación asíncrona mediante `google.script.run`.
- 🕒 Registro de fecha y hora de cada actualización.
- 🛠️ Desarrollo asistido con un agente de IA.
- 🔃 Sincronización mediante `clasp`.
- 🌿 Control de versiones con Git y GitHub.

---

## 🏗️ Arquitectura

La aplicación utiliza una arquitectura sencilla de tres capas:

```text
┌──────────────────────────────┐
│          USUARIO             │
│     Navegador / Teléfono     │
└──────────────┬───────────────┘
               │
               │ HTML / CSS / JavaScript
               │ google.script.run
               ▼
┌──────────────────────────────┐
│      GOOGLE APPS SCRIPT      │
│                              │
│ Code.gs                      │
│ Config.gs                    │
│ Setup.gs                     │
│ Asistencia.gs                │
└──────────────┬───────────────┘
               │
               │ SpreadsheetApp
               ▼
┌──────────────────────────────┐
│        GOOGLE SHEETS         │
│                              │
│ Participantes                │
│ Sesiones                     │
│ Asistencias                  │
└──────────────────────────────┘
```

### Flujo general

```text
Teléfono / Navegador
        ↓
    index.html
        ↓
 google.script.run
        ↓
Google Apps Script
        ↓
 SpreadsheetApp
        ↓
   Google Sheets
```

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| **HTML5** | Estructura de la interfaz |
| **CSS3** | Diseño responsive y mobile-first |
| **JavaScript** | Interacción del usuario |
| **Google Apps Script** | Backend de la aplicación |
| **Google Sheets** | Almacenamiento de datos |
| **Visual Studio Code** | Entorno de desarrollo |
| **Node.js / npm** | Instalación y ejecución de herramientas de desarrollo |
| **clasp** | Sincronización entre VS Code y Apps Script |
| **Git** | Control de versiones local |
| **GitHub** | Repositorio remoto |
| **Codex** | Agente de IA utilizado como apoyo durante el desarrollo |

> Node.js se utiliza como herramienta de desarrollo para ejecutar `clasp`.  
> La aplicación se ejecuta directamente en Google Apps Script.

---

## 📂 Estructura del proyecto

```text
control_asistencia/
│
├── .clasp.json       # Vinculación local con Google Apps Script
├── appsscript.json   # Manifiesto de Apps Script
├── Code.gs           # Punto de entrada de la Web App
├── Config.gs         # Configuración y acceso a Google Sheets
├── Setup.gs          # Inicialización de la base de datos
├── Asistencia.gs     # Lógica de consulta y guardado
├── index.html        # HTML, CSS y JavaScript del frontend
├── README.md         # Documentación del proyecto
└── .gitignore        # Archivos excluidos de Git
```

> `.clasp.json` se utiliza localmente para enlazar el proyecto con Apps Script y está excluido del repositorio mediante `.gitignore`.

---

## 🗃️ Estructura de Google Sheets

La aplicación utiliza una hoja de cálculo llamada:

```text
BD_Control_Asistencia
```

Contiene tres hojas.

### 👥 Participantes

| Campo | Descripción |
|---|---|
| `id_participante` | Identificador único del participante |
| `nombre` | Nombre del participante |
| `correo` | Correo electrónico |
| `activo` | Indica si el participante está activo |

Ejemplo:

```text
P01 | Participante 01 | participante01@ejemplo.com | TRUE
```

Se generan automáticamente los participantes desde:

```text
P01 → P30
```

---

### 📅 Sesiones

| Campo | Descripción |
|---|---|
| `id_sesion` | Identificador de la sesión |
| `numero` | Número de sesión |
| `fecha` | Fecha programada |
| `tema` | Nombre de la sesión |
| `estado` | PENDIENTE o REGISTRADA |

Se generan automáticamente:

```text
S01 → S10
```

Las sesiones se programan semanalmente a partir de la fecha en que se inicializa la base de datos.

---

### ✅ Asistencias

| Campo | Descripción |
|---|---|
| `id_sesion` | Sesión registrada |
| `id_participante` | Participante |
| `estado` | PRESENTE o AUSENTE |
| `hora_registro` | Fecha y hora del registro |

La llave lógica utilizada es:

```text
id_sesion + id_participante
```

Si el registro ya existe, se **actualiza**.

Si no existe, se **crea**.

Esto evita almacenar varias asistencias para el mismo participante dentro de una misma sesión.

---

## ⚙️ Configuración inicial

### 1. Crear Google Sheets

Crear una hoja de cálculo llamada:

```text
BD_Control_Asistencia
```

No es necesario crear manualmente las hojas `Participantes`, `Sesiones` y `Asistencias`.

---

### 2. Obtener el Spreadsheet ID

El identificador se encuentra en la URL de Google Sheets:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

Copiar únicamente el valor situado entre:

```text
/d/
```

y:

```text
/edit
```

---

### 3. Configurar `Config.gs`

Reemplazar:

```javascript
const SPREADSHEET_ID = 'PEGA_AQUI_EL_ID_DE_BD_CONTROL_ASISTENCIA';
```

por el ID correspondiente a la hoja de cálculo.

---

## 🔗 Configuración de clasp

Instalar clasp:

```bash
npm install -g @google/clasp@latest
```

Comprobar la instalación:

```bash
clasp --version
```

Iniciar sesión:

```bash
clasp login
```

Clonar un proyecto existente:

```bash
clasp clone SCRIPT_ID
```

---

## 🔄 Sincronización con Google Apps Script

### Enviar cambios desde VS Code

```bash
clasp push
```

### Descargar cambios desde Apps Script

```bash
clasp pull
```

### Abrir el proyecto remoto

```bash
clasp open-script
```

El flujo utilizado durante el desarrollo es:

```text
VS Code
   ↕
 clasp pull / push
   ↕
Google Apps Script
   ↕
Google Sheets
```

---

## 🚀 Inicialización de la base de datos

Después de sincronizar los archivos con Apps Script:

```bash
clasp push
```

Abrir el proyecto:

```bash
clasp open-script
```

Desde Google Apps Script ejecutar manualmente:

```javascript
prepararBaseDatos()
```

Esta función:

- crea las tres hojas necesarias;
- genera 30 participantes;
- genera 10 sesiones;
- configura los encabezados;
- asigna fechas semanales;
- evita duplicar los datos iniciales.

---

## 📱 Uso de la aplicación

1. Abrir la Web App.
2. Seleccionar una sesión.
3. Esperar a que se carguen los participantes.
4. Marcar los participantes presentes.
5. Utilizar **Marcar todos** o **Desmarcar todos** cuando sea necesario.
6. Verificar el contador:

```text
Presentes: N / 30
```

7. Pulsar **Guardar asistencia**.

Después del guardado, la sesión cambia de:

```text
PENDIENTE
```

a:

```text
REGISTRADA
```

---

## 🚫 Prevención de duplicados

Cada registro se identifica mediante:

```text
id_sesion + id_participante
```

Ejemplo:

```text
S01 + P01
```

Al guardar nuevamente una sesión:

- no se crean otros 30 registros;
- los registros existentes se actualizan;
- se conserva una sola asistencia por participante y sesión;
- se actualiza `hora_registro`.

---

## 🧪 Pruebas realizadas

Durante el desarrollo se comprobaron los siguientes escenarios:

- ✅ Carga de las 10 sesiones.
- ✅ Carga de los 30 participantes.
- ✅ Registro de presentes y ausentes.
- ✅ Prueba con 25 presentes y 5 ausentes.
- ✅ Recuperación de una asistencia previamente guardada.
- ✅ Modificación posterior de participantes.
- ✅ Segundo guardado sin generar registros duplicados.
- ✅ Cambio de estado de sesión a `REGISTRADA`.
- ✅ Registro de fecha y hora.
- ✅ Funcionamiento desde computadora.
- ✅ Funcionamiento desde dispositivo móvil.
- ✅ Diseño sin desplazamiento horizontal en pantalla móvil.

---

## 🌐 Publicación de la Web App

Durante el desarrollo se utiliza una implementación de prueba:

```text
/dev
```

Para la versión final se utiliza una implementación publicada:

```text
/exec
```

La aplicación se ejecuta desde la cuenta propietaria del proyecto y los permisos de acceso se configuran desde Google Apps Script.

Por seguridad, las URLs específicas de implementación no se almacenan en este repositorio.

---

## 🤖 Uso del agente de IA

Durante el desarrollo se utilizó **Codex** como agente de IA dentro de Visual Studio Code.

El agente se utilizó para:

- analizar la arquitectura del proyecto;
- proponer la estructura de archivos;
- apoyar en la generación inicial del código;
- revisar funciones del backend;
- apoyar en la creación de la interfaz;
- detectar posibles mejoras.

Las propuestas del agente no se aceptaron automáticamente.

Antes de incorporar modificaciones se revisaron mediante:

```bash
git status
```

y:

```bash
git diff
```

Cuando una propuesta no coincidía con los requisitos de la práctica, se solicitó al agente que la corrigiera antes de modificar el proyecto.

Esto permitió utilizar la IA como una herramienta de apoyo manteniendo la revisión y responsabilidad del desarrollador.

---

## 🌿 Control de versiones con Git

Consultar el estado:

```bash
git status
```

Revisar modificaciones:

```bash
git diff
```

Agregar cambios:

```bash
git add .
```

Crear un commit:

```bash
git commit -m "Descripción del cambio"
```

Enviar cambios a GitHub:

```bash
git push origin main
```

Consultar el historial:

```bash
git log --oneline
```

---

## 🔐 Seguridad

El proyecto evita publicar archivos locales o sensibles mediante `.gitignore`.

Se excluyen, entre otros:

```text
.clasp.json
.clasprc.json
node_modules/
.env
```

No deben almacenarse en GitHub:

- contraseñas;
- tokens;
- credenciales;
- archivos de autenticación;
- claves privadas.

---

## 📌 Flujo completo de desarrollo

```text
Visual Studio Code
        │
        ├── Codex → apoyo al desarrollo
        │
        ├── Git → historial local
        │
        └── clasp
             │
             ▼
      Google Apps Script
             │
             ▼
        Google Sheets
             │
             ▼
          Web App
             │
             ▼
     Navegador / Teléfono
```

---

## 📄 Versión

```text
v1.0
```

Primera versión funcional de la aplicación de control de asistencia.

---

## 🎓 Proyecto académico

Actividad desarrollada:
**DIANA DENISE CAMPOS LOZANO**

 Materia:

**Inteligencia Artificial Aplicada a las TIC**

Tema:

**2.1 Agentes de IA en las TIC**

Proyecto:

**Desarrollo asistido por IA de una Web App con Google Apps Script, Git y clasp**


