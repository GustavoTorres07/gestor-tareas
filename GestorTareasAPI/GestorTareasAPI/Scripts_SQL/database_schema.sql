CREATE DATABASE GestorTareasDB;
GO
USE GestorTareasDB;
GO

-- TABLA DE USUARIOS
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    FechaCreacion DATETIME DEFAULT GETDATE()
);

-- TABLA DE ESTADOS
CREATE TABLE TaskStates (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE, 
    Activo BIT DEFAULT 1
);

-- TABLA DE TAREAS
CREATE TABLE Tasks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Titulo NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(MAX) NULL,
    IdEstado INT NOT NULL,              
    IdUsuario INT NOT NULL,             
    FechaCreacion DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_Tasks_TaskStates FOREIGN KEY (IdEstado) REFERENCES TaskStates(Id),
    CONSTRAINT FK_Tasks_Users FOREIGN KEY (IdUsuario) REFERENCES Users(Id) ON DELETE CASCADE
);

-- INDICES 
CREATE INDEX IX_Tasks_IdEstado ON Tasks(IdEstado);
CREATE INDEX IX_Tasks_IdUsuario ON Tasks(IdUsuario);
GO

-- 5. INSERCIÓN DE DATOS
INSERT INTO TaskStates (Nombre, Activo) VALUES 
('Pendiente', 1), ('En progreso', 1), ('Completada', 1), ('Cancelada', 0);

INSERT INTO Users (Nombre, Email) VALUES 
('Ana García', 'ana.garcia@email.com'),
('Carlos López', 'carlos.lopez@email.com'),
('María Fernández', 'maria.fernandez@email.com');

INSERT INTO Tasks (Titulo, Descripcion, IdEstado, IdUsuario) VALUES 
('Redactar informe mensual', 'Recopilar los gastos del mes', 1, 1),
('Organizar reunión', 'Reservar sala y enviar invitaciones', 2, 1),
('Comprar insumos', 'Hojas A4 y tóner', 3, 2),
('Revisar correo', 'Responder a proveedores', 1, 2),
('Actualizar agenda', 'Cargar nuevos clientes', 2, 3),
('Preparar presentación', 'Diapositivas para gerencia', 3, 3);
GO