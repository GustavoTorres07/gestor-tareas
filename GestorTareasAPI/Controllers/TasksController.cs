using GestorTareasAPI.DTOs;
using GestorTareasAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GestorTareasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskService service, ILogger<TasksController> logger)
        {
            _service = service;
            _logger = logger;
        }

        // GET: api/Tasks o api/Tasks?status=Pendiente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDTO>>> GetTasks([FromQuery] string? status)
        {
            try
            {
                var tasks = await _service.GetAllTasksAsync(status);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las tareas");
                return StatusCode(500, "Error interno al recuperar los datos.");
            }
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDTO>> GetTask(int id)
        {
            try
            {
                var task = await _service.GetTaskByIdAsync(id);
                if (task == null) return NotFound(new { message = $"La tarea con ID {id} no existe." });

                return Ok(task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la tarea {Id}", id);
                return StatusCode(500, "Error al procesar la solicitud.");
            }
        }

        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<TaskDTO>> CreateTask([FromBody] TaskCreateDTO taskDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var result = await _service.CreateTaskAsync(taskDto);

                // Retorna 201 Created y la ruta para ver el recurso creado
                return CreatedAtAction(nameof(GetTask), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear una nueva tarea");
                return StatusCode(500, "No se pudo crear la tarea.");
            }
        }

        // PUT: api/Tasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskCreateDTO taskDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var updated = await _service.UpdateTaskAsync(id, taskDto);
                if (!updated) return NotFound(new { message = "No se pudo actualizar: Tarea no encontrada." });

                return NoContent(); // 204: Éxito pero no devuelve contenido (estándar para PUT)
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la tarea {Id}", id);
                return StatusCode(500, "Error interno al intentar actualizar.");
            }
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var deleted = await _service.DeleteTaskAsync(id);
                if (!deleted) return NotFound(new { message = "No se pudo eliminar: Tarea no encontrada." });

                return Ok(new { message = "Tarea eliminada con éxito." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la tarea {Id}", id);
                return StatusCode(500, "Error interno al intentar eliminar.");
            }
        }
    }
}