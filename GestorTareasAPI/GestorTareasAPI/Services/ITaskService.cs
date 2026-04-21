using GestorTareasAPI.DTOs;

namespace GestorTareasAPI.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDTO>> GetAllTasksAsync(string? status);
        Task<TaskDTO?> GetTaskByIdAsync(int id);
        Task<TaskDTO> CreateTaskAsync(TaskCreateDTO taskDto);
        Task<bool> UpdateTaskAsync(int id, TaskCreateDTO taskDto);
        Task<bool> DeleteTaskAsync(int id);
    }
}
