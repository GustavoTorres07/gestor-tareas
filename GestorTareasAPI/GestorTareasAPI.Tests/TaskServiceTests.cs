using Xunit;
using Moq;
using GestorTareasAPI.Services;
using GestorTareasAPI.Repositories;
using GestorTareasAPI.Models;
using GestorTareasAPI.DTOs;

namespace GestorTareasAPI.Tests
{
    public class TaskServiceTests
    {
        [Fact]
        public async Task GetAllTasks_ShouldMapCorrectNames_WhenDataExists()
        {
            var mockRepo = new Mock<ITaskRepository>();
            var fakeTasks = new List<TaskItem>
            {
                new TaskItem {
                    Id = 1,
                    Titulo = "Test Tarea",
                    Estado = new TaskState { Nombre = "Pendiente" },
                    Usuario = new User { Nombre = "Gustavo" }
                }
            };

            mockRepo.Setup(repo => repo.GetAllAsync(null)).ReturnsAsync(fakeTasks);
            var service = new TaskService(mockRepo.Object);

            var result = await service.GetAllTasksAsync(null);

            var taskDto = Assert.Single(result); 
            Assert.Equal("Pendiente", taskDto.Estado);
            Assert.Equal("Gustavo", taskDto.UsuarioAsignado);
        }

        [Fact]
        public async Task GetTaskById_ShouldReturnNull_WhenTaskDoesNotExist()
        {
            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(repo => repo.GetByIdAsync(999)) 
                    .ReturnsAsync((TaskItem)null);

            var service = new TaskService(mockRepo.Object);

            var result = await service.GetTaskByIdAsync(999);

            Assert.Null(result);
        }


        [Fact]
        public async Task CreateTask_ShouldReturnCreatedTaskWithDate_WhenDataIsValid()
        {
            var mockRepo = new Mock<ITaskRepository>();
            var taskDto = new TaskCreateDTO
            {
                Titulo = "Nueva Tarea de Prueba",
                Descripcion = "Descripción de prueba",
                IdEstado = 1,
                IdUsuario = 1
            };

            mockRepo.Setup(repo => repo.CreateAsync(It.IsAny<TaskItem>()))
                    .ReturnsAsync((TaskItem t) => {
                        t.Id = 10; 
                        return t;
                    });

            var service = new TaskService(mockRepo.Object);

            var result = await service.CreateTaskAsync(taskDto);

            Assert.NotNull(result);
            Assert.Equal(10, result.Id);
            Assert.Equal("Nueva Tarea de Prueba", result.Titulo);
            mockRepo.Verify(repo => repo.CreateAsync(It.IsAny<TaskItem>()), Times.Once);
        }
    }
}