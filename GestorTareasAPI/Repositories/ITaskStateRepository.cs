using GestorTareasAPI.Models;

namespace GestorTareasAPI.Repositories
{
    public interface ITaskStateRepository
    {
        Task<IEnumerable<TaskState>> GetAllAsync();
        Task<TaskState?> GetByIdAsync(int id);
        Task<TaskState> AddAsync(TaskState taskState);
        Task DeleteAsync(int id);
    }
}
