namespace GestorTareasAPI.DTOs
{
    public class TaskDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Estado { get; set; } = string.Empty;
        public string UsuarioAsignado { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
    }
}
