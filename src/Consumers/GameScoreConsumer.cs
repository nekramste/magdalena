using FF.Clarke.ServiceModel;
using FF.Magdalena.Handlers;
using MassTransit;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FF.Magdalena.Consumers
{
    public class GameScoreConsumer : IConsumer<EventRaisedMessage<GameScoreDTO>>
    {
        #region Private Fields
        static readonly object _object = new object();
        private ScoreMessageHandler scoreMessageHandler { get; set; }
        #endregion

        public GameScoreConsumer(ScoreMessageHandler scoreMessageHandler)
        {
            this.scoreMessageHandler = scoreMessageHandler;
        }

        public async Task Consume(ConsumeContext<EventRaisedMessage<GameScoreDTO>> context)
        {
            try
            {
                await this.scoreMessageHandler.SendMessageToAllAsync(JsonConvert.SerializeObject(context.Message));
 
            }
            catch (Exception exc)
            {
                throw;
            }
        }
    }
}
