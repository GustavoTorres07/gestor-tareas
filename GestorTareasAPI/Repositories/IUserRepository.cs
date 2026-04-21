using GestorTareasAPI.Models;

namespace GestorTareasAPI.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> AddAsync(User user);
        Task DeleteAsync(int id);
        Task<User?> GetByIdAsync(int id);
    }
}
