# Sistema de Gestión de Tareas Institucional

### Descripción del Proyecto

Este sistema es una solución **Fullstack** desarrollada para la administración y seguimiento de tareas en entornos institucionales. La aplicación no solo permite el flujo básico de tareas (CRUD), sino que implementa un control de acceso basado en roles (RBAC), normalización de estados mediante tablas maestras y una interfaz de usuario avanzada con filtros dinámicos y búsqueda global.

### Instrucciones de Ejecución (Paso a Paso)

#### 1. Requisitos Previos
* **SDK de .NET 8** instalado.
* **Node.js** (v18 o superior).
* **SQL Server** (LocalDB o Express).

#### 2. Base de Datos
1.  Localice la carpeta `/Database` en la raíz del proyecto.
2.  Ejecute el script SQL proporcionado. Este creará las tablas de `Users`, `Tasks` y la tabla maestra de `TaskStates`.
3.  El script incluye la inserción automática de los **usuarios y tareas de prueba** requeridos por la consigna.

#### 3. Backend (API REST)
1.  Abra la carpeta `GestorTareasAPI` y ejecute el archivo de solución `.sln` en Visual Studio 2022.
2.  Verifique la cadena de conexión en el archivo `appsettings.json`.
3.  Inicie el proyecto (F5). La documentación interactiva de los endpoints estará disponible en: `https://localhost:44390/swagger`.

#### 4. Frontend (React.js)
1.  Navegue a la carpeta `gestor-tareas-web`.
2.  **Configuración de Entorno:** Cree un archivo `.env` en la raíz de esta carpeta con el siguiente contenido:
    `VITE_API_URL=https://localhost:44390/api`
3.  Instale las dependencias y ejecute el servidor de desarrollo:
    ```bash
    npm install
    npm run dev
    ```

### Credenciales de Acceso para Pruebas
* **Perfil Administrador:** `admin@gob.ar` (Habilita gestión de usuarios y estados).
* **Perfil Usuario:** `ana.garcia@email.com` o cualquier otro correo del script SQL.

### Tecnologías Utilizadas
* **Backend:** ASP.NET Core 8, Entity Framework Core, xUnit (Testing).
* **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, SweetAlert2.
* **Base de Datos:** SQL Server.

### Herramientas de IA Utilizadas
**ChatGPT/Gemini/Claude** para:
* Definición de la arquitectura en capas y patrón Repository.
* Optimización de componentes funcionales de React y lógica del hook personalizado `useTasks`.
* Asistencia en la configuración de estilos con Tailwind CSS y mensajes de commit semánticos.

### Decisiones de Diseño Relevantes
* **Arquitectura en Capas:** Separación entre Controladores, Servicios y Repositorios para facilitar la escalabilidad y el testeo unitario.
* **Normalización de Estados:** Se optó por una tabla `TaskStates` independiente en lugar de un ENUM o texto plano, permitiendo que los estados sean dinámicos.
* **Hook Personalizado:** Implementación de `useTasks` para encapsular la lógica de consumo de API, manejo de errores y estados de carga (`loading`).
* **UX Avanzada:** Se añadieron funcionalidades de **ordenamiento alfabético**, **filtros de fecha** y un **buscador global**.

---
*Entrega para la evaluación de Desarrollador Junior Fullstack - Poder Judicial.*