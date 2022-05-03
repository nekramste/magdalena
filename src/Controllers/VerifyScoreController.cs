using FF.Clarke.ServiceModel;
using FF.Macau;
using FF.Magdalena.Agents;
using FF.Magdalena.Handlers;
using FF.Magdalena.WebSockets;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Common.Logging;
using FF.Macau.Logging;

namespace FF.Magdalena.Controllers
{
    [Route("api/grade")]
    [ApiController]
    public class VerifyScoreController : Controller
    {
        #region Members
        private readonly IClarkeAgent clarkeAgent;
        private readonly ScoreMessageHandler webSocketHandler;
        private readonly ILog logger;
        #endregion

        public VerifyScoreController(IClarkeAgent agent, ScoreMessageHandler webSocketHandler, ILoggerProvider loggerProvider)
        { 
            Ensure.IsNotNull(agent, nameof(agent));
            Ensure.IsNotNull(webSocketHandler, nameof(webSocketHandler));

            this.webSocketHandler = webSocketHandler;
            this.clarkeAgent = agent;
            this.logger = loggerProvider.GetLogger<VerifyScoreController>();
        }

        [HttpPost]
        public async Task Verify(VerifiedGameScoreDTO verifiedGameScore)
        {
            try
            {
                verifiedGameScore.Context.User = this.GetUserName();

                var score = await this.clarkeAgent.GetScores(verifiedGameScore.GameScore.Header.EventNumber);
                this.MarkAsSentToGrade(score, verifiedGameScore);

                await webSocketHandler.SendMessageToAllAsync(JsonConvert.SerializeObject(score));
                await clarkeAgent.VerifyGrade(verifiedGameScore);
            }
            catch (Exception exc)
            {
                this.logger.Error($"An error occurred while post the Verify.", exc);
                throw;
            }
        }

        [HttpGet]
        public async Task<IEnumerable<GameScoreDTO>> GetScores()
        {
            try
            {
                return await clarkeAgent.GetRecentScores();
            }
            catch (Exception exc)
            {
                this.logger.Error($"An error occurred while get the GetScores.", exc);
                throw;
            }
        }

        #region Private Methods
        private void MarkAsSentToGrade(GameScoreDTO score, VerifiedGameScoreDTO verifiedGameScore)
        {
            var newScores = score.Scores.ToList();
            var scoreToGrade = newScores.FirstOrDefault(score => score.Period.Number == verifiedGameScore.GameScore.CurrentScore.Period.Number);

            if (scoreToGrade.IsNotNull())
            {
                scoreToGrade.Status = ScoreGradeStatusDTO.WasSendToGrade;
                score.CurrentScore = scoreToGrade;
            }
            score.Scores = newScores;
            verifiedGameScore.GameScore = score;
        }
        #endregion
    }
}
