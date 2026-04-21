using GestorTareasAPI.DTOs;
using GestorTareasAPI.Models;
using GestorTareasAPI.Repositories;

namespace GestorTareasAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TaskDTO>> GetAllTasksAsync(string? status)
        {
            var tasks = await _repository.GetAllAsync(status);

            return tasks.Select(t => new TaskDTO
            {
                Id = t.Id,
                Titulo = t.Titulo,
                Descripcion = t.Descripcion,
                Estado = t.Estado?.Nombre ?? "Sin Estado",
                UsuarioAsignado = t.Usuario?.Nombre ?? "Sin Asignar",
                FechaCreacion = t.FechaCreacion
            });
        }

        public async Task<TaskDTO?> GetTaskByIdAsync(int id)
        {
            var t = await _repository.GetByIdAsync(id);
            if (t == null) return null;

            return new TaskDTO
            {
                Id = t.Id,
                Titulo = t.Titulo,
                Descripcion = t.Descripcion,
                Estado = t.Estado?.Nombre ?? "Sin Estado",
                UsuarioAsignado = t.Usuario?.Nombre ?? "Sin Asignar",
                FechaCreacion = t.FechaCreacion
            };
        }

        public async Task<TaskDTO> CreateTaskAsync(TaskCreateDTO taskDto)
        {
            var newTask = new TaskItem
            {
                Titulo = taskDto.Titulo,
                Descripcion = taskDto.Descripcion,
                IdEstado = taskDto.IdEstado,
                IdUsuario = taskDto.IdUsuario,
                FechaCreacion = DateTime.Now
            };

            var createdTask = await _repository.CreateAsync(newTask);

            return new TaskDTO { Id = createdTask.Id, Titulo = createdTask.Titulo };
        }

        public async Task<bool> UpdateTaskAsync(int id, TaskCreateDTO dto)
        {
            var existingTask = await _repository.GetByIdAsync(id);
            if (existingTask == null) return false;

            existingTask.Titulo = dto.Titulo;
            existingTask.Descripcion = dto.Descripcion;
            existingTask.IdEstado = dto.IdEstado;
            existingTask.IdUsuario = dto.IdUsuario;

            return await _repository.UpdateAsync(existingTask);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}