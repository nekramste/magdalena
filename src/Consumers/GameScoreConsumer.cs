using FF.Clarke.ServiceModel;
using FF.Magdalena.Handlers;
using MassTransit;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace FF.Magdalena.Consumers
{
    public class GameScoreConsumer : IConsumer<EventRaisedMessage<GameScoreDTO>>
    {
        #region Private Fields
        private readonly ScoreMessageHandler scoreMessageHandler;
        #endregion

        #region Constructor
        public GameScoreConsumer(ScoreMessageHandler scoreMessageHandler)
        {
            this.scoreMessageHandler = scoreMessageHandler;
        }
        #endregion

        #region Methods
        public async Task Consume(ConsumeContext<EventRaisedMessage<GameScoreDTO>> context)
        {
            try
            {
                await this.scoreMessageHandler.SendMessageToAllAsync(JsonConvert.SerializeObject(context.Message.Message));

            }
            catch (Exception exc)
            {
                throw;
            }
        } 
        #endregion
    }
}