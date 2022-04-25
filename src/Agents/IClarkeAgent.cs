using FF.Clarke.ServiceModel;
using System.Threading.Tasks;

namespace FF.Magdalena.Agents
{
    public interface IClarkeAgent
    {
        Task VerifyGrade(VerifiedGameScoreDTO gameScore);
    }
}
