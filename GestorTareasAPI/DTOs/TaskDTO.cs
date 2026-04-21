namespace GestorTareasAPI.DTOs
{
    public class TaskDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }

        public int IdEstado { get; set; } 
        public string Estado { get; set; } = string.Empty; 
        public int IdUsuario { get; set; } 
        public string UsuarioAsignado { get; set; } = string.Empty; 

        public DateTime FechaCreacion { get; set; }
    }
}
