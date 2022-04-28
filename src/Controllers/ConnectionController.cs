using Common.Logging;
using FF.Macau;
using FF.Macau.Logging;
using FF.Magdalena.Agents;
using FF.Magdalena.Handlers;
using FF.Magdalena.Models;
using FF.Magdalena.WebSockets;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace FF.Magdalena.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class ConnectionController : Controller
    {
        #region Private Fields
        private readonly ScoreMessageHandler scoreMessageHandler;
        private readonly ConnectionManager connectionManager;
        private readonly IClarkeAgent scoreRepository;
        private readonly ILog logger;
        #endregion

        #region Constructor
        public ConnectionController(ScoreMessageHandler scoreMessageHandler, ConnectionManager connectionManager, IClarkeAgent scoreRepository, ILoggerProvider loggerProvider)
        {
            Ensure.IsNotNull(loggerProvider, nameof(loggerProvider));

            this.scoreMessageHandler = scoreMessageHandler;
            this.connectionManager = connectionManager;
            this.scoreRepository = scoreRepository;
            this.logger = loggerProvider.GetLogger<ConnectionController>();

        }
        #endregion


        [HttpGet("ready/{connectionId}")]
        public async Task<ReadyResult> Ready(string connectionId)
        {
            try
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
            catch (Exception exc)
            {
                this.logger.Error($"An error occurred while get the Ready.", exc);
                throw;
            }
        }


        [HttpGet("context/info")]
        public async Task<Context> GetContext()
        {
            try
            {
                return new Context(this.GetUserName());
            }
            catch (Exception exc)
            {
                this.logger.Error($"An error occurred while get the GetContext.", exc);
                throw;
            }
        }

        public class ReadyResult 
        {
            public bool Success { get; set; }
            public string Message { get; set; }
        }
    }
}
