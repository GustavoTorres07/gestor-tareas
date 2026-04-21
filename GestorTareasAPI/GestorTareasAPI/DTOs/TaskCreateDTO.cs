namespace GestorTareasAPI.DTOs
{
    public class TaskCreateDTO
    {
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int IdEstado { get; set; }
        public int IdUsuario { get; set; }
    }
}
