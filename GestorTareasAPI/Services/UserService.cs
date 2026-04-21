using GestorTareasAPI.Models;
using GestorTareasAPI.Repositories;

namespace GestorTareasAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> CreateUserAsync(User user)
        {
            // Aquí en el futuro podrías agregar validaciones de negocio
            // Ejemplo: if(email ya existe) throw exception;
            user.FechaCreacion = DateTime.Now;
            return await _userRepository.AddAsync(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
        }
    }
}