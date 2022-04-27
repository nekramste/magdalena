using FF.Clarke.ServiceModel;
using FF.Macau;
using FF.Macau.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FF.Magdalena.Agents
{
    public class HttpClarkeAgent : IClarkeAgent
    {
        #region Members
        private readonly Uri uri;
        private readonly IHttpClientFactory httpClientFactory;
        private const string GET_RECENT_SCORES = "/api/scores";
        private const string VERIFY_GRADE = "/api/grade";
        #endregion

        #region Constructor
        public HttpClarkeAgent(Uri uri, IHttpClientFactory httpClientFactory)
        {
            Ensure.IsNotNull(uri, nameof(uri));
            Ensure.IsNotNull(httpClientFactory, nameof(httpClientFactory));

            this.uri = uri;
            this.httpClientFactory = httpClientFactory;
        }
        #endregion

        #region Methods
        public async Task VerifyGrade(VerifiedGameScoreDTO gameScore)
        {
            try
            {

                using (var client = this.httpClientFactory.Create(uri))
                {
                    await client.PostAsync(VERIFY_GRADE, gameScore).ConfigureAwait(false);
                }

            }
            catch (Exception ex)
            {
                throw new Exception("There was an issue", ex);
            }
        }

        public async Task<IEnumerable<GameScoreDTO>> GetRecentScores()
        {
            try
            {
                using (var client = this.httpClientFactory.Create(uri))
                {
                   return await client.GetAsync<IEnumerable<GameScoreDTO>>(GET_RECENT_SCORES).ConfigureAwait(false);
                }

            }
            catch (Exception ex)
            {
                throw new Exception("There was an issue", ex);
            }
        }

        public async Task<GameScoreDTO> GetScores(int gameNumber)
        {
            try
            {
                using (var client = this.httpClientFactory.Create(uri))
                {
                    return await client.GetAsync<GameScoreDTO>($"{GET_RECENT_SCORES}/{gameNumber}").ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("There was an issue", ex);
            }
        }


        #endregion
    }
}
