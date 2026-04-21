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
    }
}