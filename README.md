\- Sistema de Gestion de Tareas



Este sistema es una solución integral para la administracion de tareas en entornos institucionales. A diferencia de una lista de tareas simple, este proyecto implementa un control de acceso por roles, gestion de entidades relacionadas y una interfaz optimizada para la toma de decisiones.



* Instrucciones de Ejecucion (Paso a Paso)
1. Requisitos Previos



* SDK de .NET 8 y Visual Studio 2022



* Node.js (v18 o superior)



* SQL Server (LocalDB o Express)



2\. Base de Datos



* Localice los archivos en la carpeta /Database.



* Ejecute el script SQL para crear las tablas. Notara que incluimos una tabla maestra de Estados, lo que permite que el sistema sea escalable.



* El script incluye los datos de prueba requeridos (3 usuarios y 6 tareas).



3\. Backend (API REST)



* Abra GestorTareasAPI.sln en Visual Studio.



* Inicie el proyecto (F5). La API corre en: https://localhost:44390.



* Puede probar los endpoints desde la interfaz de Swagger que se abre automáticamente.



4\. Frontend (React.js)



* Abra la carpeta gestor-tareas-web en VS Code.



IMPORTANTE (Configuración de Entorno): Cree un archivo llamado .env en la raíz de esta carpeta y pegue la siguiente línea:

VITE\_API\_URL=https://localhost:44390/api

(Esto es necesario para que el Frontend sepa dónde está conectada la API).



* En la terminal ejecute:
npm install

&#x20;  npm run dev



\- Credenciales de Acceso (Prueba)

Perfil Administrador: admin@gob.ar (Permite gestionar Usuarios y Estados).



Perfil Usuario: Cualquier otro correo registrado (Ej: ana.garcia@email.com).



\-	Decisiones de Diseño y Valor Agregado



Más allá de los requisitos básicos, hemos implementado lo siguiente



* Normalización de DB (Tabla de Estados): No usamos un simple texto para el estado de las tareas. Creamos una tabla independiente para los Estados, relacionada mediante FK. Esto permite cambiar el nombre de un estado en un solo lugar y que se refleje en todo el sistema.



* Pantalla de Login y Seguridad: Implementamos un sistema de acceso que identifica al usuario por su correo. Si el correo es el del administrador, el sistema habilita pestañas exclusivas de configuración.



* Gestión de Usuarios y Estados (ABM): El administrador puede crear, editar y eliminar usuarios o tipos de estados directamente desde la interfaz, sin ir a la base de datos.



* UX Avanzada en Tablas:



* Ordenamiento Alfabético/Numérico: Se puede hacer clic en las cabeceras (ID, Asunto, Fecha) para ordenar los datos.



* Filtros Inteligentes: Buscador global en tiempo real y filtros por rango de fechas.



* Limpieza de Estado: El sistema limpia automáticamente todos los filtros y búsquedas al cerrar sesión, evitando que un usuario vea los filtros aplicados por el anterior.



\-	Tecnologías Utilizadas



* Backend: ASP.NET Core 8, Entity Framework Core, xUnit.



* Frontend: React.js, Lucide Icons (iconografía), SweetAlert2 (notificaciones), Tailwind CSS.



* Base de Datos: SQL Server



\-	Herramientas de IA Utilizadas



Gemini/ChatGPT/Claude: Utilizados para la estructuración del patrón Repository, asistencia en la lógica de ordenamiento dinámico en React y optimización de las consultas SQL para asegurar la integridad referencial.

