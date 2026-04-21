using Xunit;
using Moq;
using GestorTareasAPI.Services;
using GestorTareasAPI.Repositories;
using GestorTareasAPI.Models;

namespace GestorTareasAPI.Tests
{
    public class TaskServiceTests
    {
        [Fact]
        public async Task GetAllTasks_ShouldReturnEmptyList_WhenNoTasksExist()
        {
            var mockRepo = new Mock<ITaskRepository>();
            mockRepo.Setup(repo => repo.GetAllAsync(null))
                    .ReturnsAsync(new List<TaskItem>());

            var service = new TaskService(mockRepo.Object);

            var result = await service.GetAllTasksAsync(null);

            Assert.Empty(result);
        }
    }
}