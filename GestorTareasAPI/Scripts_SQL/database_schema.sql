-- Creacion de la base de datos
CREATE DATABASE GestorTareasDB;
GO

USE GestorTareasDB;
GO

-- Creacion de la tabla Users
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    fecha_creacion DATETIME DEFAULT GETDATE()
);
GO

-- Creacion de la tabla TaskStates (Estados de las tareas)
CREATE TABLE TaskStates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL UNIQUE, 
    activo BIT DEFAULT 1                 
);
GO

-- Creacion de la tabla Tasks
CREATE TABLE Tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(MAX) NULL,
    id_estado INT NOT NULL,              
    id_usuario INT NOT NULL,             
    fecha_creacion DATETIME DEFAULT GETDATE(),
    
    -- Relaciones 
    CONSTRAINT FK_Tasks_TaskStates FOREIGN KEY (id_estado) REFERENCES TaskStates(id),
    CONSTRAINT FK_Tasks_Users FOREIGN KEY (id_usuario) REFERENCES Users(id) ON DELETE CASCADE
);
GO

-- ==========================================
-- INSERCION DE DATOS DE PRUEBA
-- ==========================================

-- Insertar Estados
INSERT INTO TaskStates (nombre, activo) VALUES 
('Pendiente', 1),
('En progreso', 1),
('Completada', 1),
('Cancelada', 0); 
GO

-- Insertar Usuarios
INSERT INTO Users (nombre, email) VALUES 
('Ana García', 'ana.garcia@email.com'),
('Carlos López', 'carlos.lopez@email.com'),
('María Fernández', 'maria.fernandez@email.com');
GO

-- Insertar Tareas de Oficina
INSERT INTO Tasks (titulo, descripcion, id_estado, id_usuario) VALUES 
('Redactar informe mensual', 'Recopilar los gastos del mes y armar el documento para contaduría', 1, 1),
('Organizar reunión de equipo', 'Reservar la sala de conferencias y enviar invitaciones por calendario', 2, 1),
('Comprar insumos de papelería', 'Pedir cajas de hojas A4, cartuchos de tóner y carpetas', 3, 2),
('Revisar bandeja de entrada', 'Responder consultas de proveedores en el correo general', 1, 2),
('Actualizar agenda de contactos', 'Cargar los números de teléfono de los nuevos clientes al sistema', 2, 3),
('Preparar presentación de ventas', 'Armar las diapositivas para la reunión con la gerencia', 3, 3);
GO