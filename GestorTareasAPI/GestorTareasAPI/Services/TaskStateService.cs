using GestorTareasAPI.Models;
using GestorTareasAPI.Repositories;

namespace GestorTareasAPI.Services
{
    public class TaskStateService : ITaskStateService
    {
        private readonly ITaskStateRepository _repository;

        public TaskStateService(ITaskStateRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TaskState>> GetAllTaskStatesAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TaskState> CreateTaskStateAsync(TaskState taskState)
        {
            // Aquí centralizamos la lógica. Por ejemplo, podríamos validar
            // que el nombre no venga vacío antes de enviarlo a la base de datos.
            return await _repository.AddAsync(taskState);
        }

        public async Task DeleteTaskStateAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}