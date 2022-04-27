using FF.Magdalena.Agents;
using FF.Magdalena.Handlers;
using FF.Magdalena.WebSockets;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FF.Magdalena.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class ConnectionController : ControllerBase
    {
            private static readonly string[] Summaries = new[]
            {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };


        #region Private Fields
        private readonly ScoreMessageHandler scoreMessageHandler;
        private readonly ConnectionManager connectionManager;
        private readonly IClarkeAgent scoreRepository;
        #endregion

        #region Constructor
        public ConnectionController(ScoreMessageHandler scoreMessageHandler, ConnectionManager connectionManager, IClarkeAgent scoreRepository)
        {
            this.scoreMessageHandler = scoreMessageHandler;
            this.connectionManager = connectionManager;
            this.scoreRepository = scoreRepository;
        }
        #endregion


        [HttpGet("ready/{connectionId}")]
        public async Task<ReadyResult> Ready(string connectionId)
        {
            var socket = this.connectionManager.GetSocketById(connectionId);


            if (socket != null)
            {
                try
                {
                    var scores = await this.scoreRepository.GetRecentScores();

                    foreach (var score in scores)
                    {
                        await this.scoreMessageHandler.SendMessageAsync(socket, JsonConvert.SerializeObject(score));
                    }

                    return new ReadyResult()
                    {
                        Success = true,
                        Message = "Queued"
                    };
                }
                catch
                {
                    return new ReadyResult()
                    {
                        Message = "Could not connect to API",
                        Success = false
                    };
                }
            }

            return new ReadyResult()
            {
                Success = false,
            };
        }


        public class ReadyResult 
        {
            public bool Success { get; set; }
            public string Message { get; set; }
        }
    }
}
