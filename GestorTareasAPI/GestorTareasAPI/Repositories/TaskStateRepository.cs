using GestorTareasAPI.Data;
using GestorTareasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GestorTareasAPI.Repositories
{
    public class TaskStateRepository : ITaskStateRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskStateRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskState>> GetAllAsync()
        {
            return await _context.TaskStates.ToListAsync();
        }

        public async Task<TaskState?> GetByIdAsync(int id)
        {
            return await _context.TaskStates.FindAsync(id);
        }

        public async Task<TaskState> AddAsync(TaskState taskState)
        {
            _context.TaskStates.Add(taskState);
            await _context.SaveChangesAsync();
            return taskState;
        }

        public async Task DeleteAsync(int id)
        {
            var state = await _context.TaskStates.FindAsync(id);
            if (state != null)
            {
                _context.TaskStates.Remove(state);
                await _context.SaveChangesAsync();
            }
        }
    }
}