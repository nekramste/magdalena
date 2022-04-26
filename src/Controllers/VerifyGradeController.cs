using FF.Clarke.ServiceModel;
using FF.Macau;
using FF.Magdalena.Agents;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FF.Magdalena.Controllers
{
    [Route("api/grade")]
    [ApiController]
    public class VerifyGradeController : ControllerBase
    {
        #region Members
        private readonly IClarkeAgent clarkeAgent;
        #endregion

        public VerifyGradeController(IClarkeAgent agent)
        { 
            Ensure.IsNotNull(agent, nameof(agent));

            this.clarkeAgent = agent;
        }

        [HttpPost]
        public async Task Verify(VerifiedGameScoreDTO gameScore)
        {
            try
            {
                await clarkeAgent.VerifyGrade(gameScore);
            }
            catch (Exception exc)
            {

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
                return null;
            }
        }
    }
}
