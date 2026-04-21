using Microsoft.AspNetCore.Mvc;
using GestorTareasAPI.Models;
using GestorTareasAPI.Services;

namespace GestorTareasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskStatesController : ControllerBase
    {
        private readonly ITaskStateService _service;

        public TaskStatesController(ITaskStateService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskState>>> GetTaskStates()
        {
            var states = await _service.GetAllTaskStatesAsync();
            return Ok(states);
        }

        [HttpPost]
        // Nota: En un sistema con JWT configurado, aquí iría [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TaskState>> PostTaskState(TaskState taskState)
        {
            var newState = await _service.CreateTaskStateAsync(taskState);
            return Ok(newState);
        }

        [HttpDelete("{id}")]
        // Nota: En un sistema con JWT configurado, aquí iría [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTaskState(int id)
        {
            await _service.DeleteTaskStateAsync(id);
            return NoContent();
        }
    }
}