using FF.Clarke.ServiceModel;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FF.Magdalena.Agents
{
    public interface IClarkeAgent
    {
        Task VerifyGrade(VerifiedGameScoreDTO gameScore);

        Task<IEnumerable<GameScoreDTO>> GetRecentScores();
    }
}
