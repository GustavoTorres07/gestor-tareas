using GestorTareasAPI.DTOs;
using GestorTareasAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GestorTareasAPI.Controllers
{
    /// <summary>
    /// Controlador para la gestión de tareas del sistema
    /// </summary>
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

        /// <summary>
        /// Obtiene el listado completo de tareas, con la opcion de filtrar por nombre de estado
        /// </summary>
        /// <param name="status">Nombre del estado para filtrar</param>
        /// <returns>Lista de tareas mapeadas a DTOs</returns>
        /// <response code="200">Retorna la lista de tareas exitosamente</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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

        /// <summary>
        /// Obtiene el detalle de una tarea especifica por su ID
        /// </summary>
        /// <param name="id">ID numerico de la tarea</param>
        /// <returns>Un objeto TaskDTO</returns>
        /// <response code="200">Tarea encontrada</response>
        /// <response code="404">No se encontro ninguna tarea con el ID proporcionado</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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

        /// <summary>
        /// Registra una nueva tarea en la base de datos
        /// </summary>
        /// <param name="taskDto">Datos de la tarea a crear</param>
        /// <returns>La tarea recien creada con su ID asignado</returns>
        /// <response code="201">Tarea creada exitosamente</response>
        /// <response code="400">Datos de entrada invalidos</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TaskDTO>> CreateTask([FromBody] TaskCreateDTO taskDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var result = await _service.CreateTaskAsync(taskDto);

                return CreatedAtAction(nameof(GetTask), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear una nueva tarea");
                return StatusCode(500, "No se pudo crear la tarea.");
            }
        }

        /// <summary>
        /// Actualiza la información de una tarea existente
        /// </summary>
        /// <param name="id">ID de la tarea a modificar</param>
        /// <param name="taskDto">Nuevos datos para la tarea</param>
        /// <response code="204">Actualización exitosa</response>
        /// <response code="404">La tarea especificada no existe</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskCreateDTO taskDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var updated = await _service.UpdateTaskAsync(id, taskDto);
                if (!updated) return NotFound(new { message = "No se pudo actualizar: Tarea no encontrada." });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la tarea {Id}", id);
                return StatusCode(500, "Error interno al intentar actualizar.");
            }
        }

        /// <summary>
        /// Elimina una tarea de forma permanente
        /// </summary>
        /// <param name="id">ID de la tarea a borrar</param>
        /// <response code="200">Tarea eliminada correctamente</response>
        /// <response code="404">La tarea no existe</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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