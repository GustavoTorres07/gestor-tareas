USE [master]
GO
/****** Objeto: Database [GestorTareasDB] Fecha de script: 21/04/2026 18:43:32 ******/
CREATE DATABASE [GestorTareasDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'GestorTareasDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.MSSQLSERVER\MSSQL\DATA\GestorTareasDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'GestorTareasDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.MSSQLSERVER\MSSQL\DATA\GestorTareasDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [GestorTareasDB] SET COMPATIBILITY_LEVEL = 170
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [GestorTareasDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [GestorTareasDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [GestorTareasDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [GestorTareasDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [GestorTareasDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [GestorTareasDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [GestorTareasDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [GestorTareasDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [GestorTareasDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [GestorTareasDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [GestorTareasDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [GestorTareasDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [GestorTareasDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [GestorTareasDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [GestorTareasDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [GestorTareasDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [GestorTareasDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [GestorTareasDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [GestorTareasDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [GestorTareasDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [GestorTareasDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [GestorTareasDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [GestorTareasDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [GestorTareasDB] SET RECOVERY FULL 
GO
ALTER DATABASE [GestorTareasDB] SET  MULTI_USER 
GO
ALTER DATABASE [GestorTareasDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [GestorTareasDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [GestorTareasDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [GestorTareasDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [GestorTareasDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [GestorTareasDB] SET OPTIMIZED_LOCKING = OFF 
GO
ALTER DATABASE [GestorTareasDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [GestorTareasDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [GestorTareasDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [GestorTareasDB]
GO
/****** Objeto: Table [dbo].[Tasks] Fecha de script: 21/04/2026 18:43:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tasks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Titulo] [nvarchar](150) NOT NULL,
	[Descripcion] [nvarchar](max) NULL,
	[IdEstado] [int] NOT NULL,
	[IdUsuario] [int] NOT NULL,
	[FechaCreacion] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[TaskStates] Fecha de script: 21/04/2026 18:43:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaskStates](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
	[Activo] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Objeto: Table [dbo].[Users] Fecha de script: 21/04/2026 18:43:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](150) NOT NULL,
	[FechaCreacion] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Tasks] ON 

INSERT [dbo].[Tasks] ([Id], [Titulo], [Descripcion], [IdEstado], [IdUsuario], [FechaCreacion]) VALUES (1, N'Redactar informe mensual', N'Recopilar los gastos del mes', 2, 1, CAST(N'2026-04-21T13:18:38.233' AS DateTime))
INSERT [dbo].[Tasks] ([Id], [Titulo], [Descripcion], [IdEstado], [IdUsuario], [FechaCreacion]) VALUES (2, N'Organizar reunión', N'Reservar sala y enviar invitaciones', 2, 1, CAST(N'2026-04-21T13:18:38.233' AS DateTime))
INSERT [dbo].[Tasks] ([Id], [Titulo], [Descripcion], [IdEstado], [IdUsuario], [FechaCreacion]) VALUES (3, N'Comprar insumos', N'Hojas A4 y tóner', 3, 2, CAST(N'2026-04-21T13:18:38.233' AS DateTime))
INSERT [dbo].[Tasks] ([Id], [Titulo], [Descripcion], [IdEstado], [IdUsuario], [FechaCreacion]) VALUES (4, N'Revisar correo', N'Responder a proveedores', 1, 2, CAST(N'2026-04-21T13:18:38.233' AS DateTime))
INSERT [dbo].[Tasks] ([Id], [Titulo], [Descripcion], [IdEstado], [IdUsuario], [FechaCreacion]) VALUES (7, N'Informe RR.HH', N'entregar informe sobre relevamiento ', 1, 1, CAST(N'2026-04-21T16:19:12.970' AS DateTime))
INSERT [dbo].[Tasks] ([Id], [Titulo], [Descripcion], [IdEstado], [IdUsuario], [FechaCreacion]) VALUES (9, N'Test2', N'Test2', 1, 1, CAST(N'2026-04-21T17:38:14.717' AS DateTime))
INSERT [dbo].[Tasks] ([Id], [Titulo], [Descripcion], [IdEstado], [IdUsuario], [FechaCreacion]) VALUES (11, N'test3', N'test3', 2, 1, CAST(N'2026-04-21T18:18:02.033' AS DateTime))
SET IDENTITY_INSERT [dbo].[Tasks] OFF
GO
SET IDENTITY_INSERT [dbo].[TaskStates] ON 

INSERT [dbo].[TaskStates] ([Id], [Nombre], [Activo]) VALUES (1, N'Pendiente', 1)
INSERT [dbo].[TaskStates] ([Id], [Nombre], [Activo]) VALUES (2, N'En progreso', 1)
INSERT [dbo].[TaskStates] ([Id], [Nombre], [Activo]) VALUES (3, N'Completada', 1)
INSERT [dbo].[TaskStates] ([Id], [Nombre], [Activo]) VALUES (4, N'Cancelada', 0)
SET IDENTITY_INSERT [dbo].[TaskStates] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [Nombre], [Email], [FechaCreacion]) VALUES (1, N'Ana García', N'ana.garcia@email.com', CAST(N'2026-04-21T13:18:38.233' AS DateTime))
INSERT [dbo].[Users] ([Id], [Nombre], [Email], [FechaCreacion]) VALUES (2, N'Carlos López', N'carlos.lopez@email.com', CAST(N'2026-04-21T13:18:38.233' AS DateTime))
INSERT [dbo].[Users] ([Id], [Nombre], [Email], [FechaCreacion]) VALUES (3, N'María Fernández', N'maria.fernandez@email.com', CAST(N'2026-04-21T13:18:38.233' AS DateTime))
INSERT [dbo].[Users] ([Id], [Nombre], [Email], [FechaCreacion]) VALUES (4, N'Administrador General', N'admin@gob.ar', CAST(N'2026-04-21T16:46:23.453' AS DateTime))
INSERT [dbo].[Users] ([Id], [Nombre], [Email], [FechaCreacion]) VALUES (5, N'Gustavo Torres', N'gustavo.torres@email.com', CAST(N'2026-04-21T17:40:11.703' AS DateTime))
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
/****** Objeto: Index [IX_Tasks_IdEstado] Fecha de script: 21/04/2026 18:43:32 ******/
CREATE NONCLUSTERED INDEX [IX_Tasks_IdEstado] ON [dbo].[Tasks]
(
	[IdEstado] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Objeto: Index [IX_Tasks_IdUsuario] Fecha de script: 21/04/2026 18:43:32 ******/
CREATE NONCLUSTERED INDEX [IX_Tasks_IdUsuario] ON [dbo].[Tasks]
(
	[IdUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [UQ__TaskStat__75E3EFCF5ACAA1EE] Fecha de script: 21/04/2026 18:43:32 ******/
ALTER TABLE [dbo].[TaskStates] ADD UNIQUE NONCLUSTERED 
(
	[Nombre] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Objeto: Index [UQ__Users__A9D10534D11DC446] Fecha de script: 21/04/2026 18:43:32 ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Tasks] ADD  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[TaskStates] ADD  DEFAULT ((1)) FOR [Activo]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Tasks_TaskStates] FOREIGN KEY([IdEstado])
REFERENCES [dbo].[TaskStates] ([Id])
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Tasks_TaskStates]
GO
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Tasks_Users] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Tasks_Users]
GO
USE [master]
GO
ALTER DATABASE [GestorTareasDB] SET  READ_WRITE 
GO
