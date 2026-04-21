namespace GestorTareasAPI.Models
{
    public class TaskState
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }
}
