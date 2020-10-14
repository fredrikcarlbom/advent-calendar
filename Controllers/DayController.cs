using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace advent_calendar.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DayController : ControllerBase
    {
        private static List<Day> days = new List<Day>
        {
            new Day(1, true, "Lucka 1"),
            new Day(2, true, "En till lucka")
        };

        private readonly ILogger<DayController> _logger;

        public DayController(ILogger<DayController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Day> Get()
        {
            return days;
        }
    }
}
