using GestorTareasAPI.Models;

namespace GestorTareasAPI.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user);
        Task DeleteUserAsync(int id);
    }
}
