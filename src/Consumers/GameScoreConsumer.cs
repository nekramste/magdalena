using FF.Feeds.Messages;
using MassTransit;
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
        #endregion

        public async Task Consume(ConsumeContext<EventRaisedMessage<GameScoreDTO>> context)
        {
            try
            {
                lock (_object)
                {
                }
            }
            catch (Exception exc)
            {
                throw;
            }
        }
    }
}
