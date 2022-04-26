using FF.Magdalena.Agents;
using FF.Magdalena.Handlers;
using FF.Magdalena.WebSockets;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace FF.Magdalena.Controllers
{
    public class ConnectionController : Controller
    {

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

        [HttpGet]
        public async Task<ReadyResult> Ready(string connectionId)
        {
            var socket = this.connectionManager.GetSocketById(connectionId);


            if (socket != null)
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
