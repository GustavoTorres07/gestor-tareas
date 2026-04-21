namespace GestorTareasAPI.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }

        // Relación con el Estado
        public int IdEstado { get; set; }
        public TaskState? Estado { get; set; }

        // Relación con el Usuario
        public int IdUsuario { get; set; }
        public User? Usuario { get; set; }

        public DateTime FechaCreacion { get; set; }
    }
}
