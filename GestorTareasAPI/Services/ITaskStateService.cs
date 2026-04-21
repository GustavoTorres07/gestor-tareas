using GestorTareasAPI.Models;

namespace GestorTareasAPI.Services
{
    public interface ITaskStateService
    {
        Task<IEnumerable<TaskState>> GetAllTaskStatesAsync();
        Task<TaskState> CreateTaskStateAsync(TaskState taskState);
        Task DeleteTaskStateAsync(int id);
    }
}
