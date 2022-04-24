using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FF.Magdalena.MassTransit
{
    public class MassTransitManager : IBusManager
    {
        #region Private Fields

        private readonly IBusControl busControl;
        private readonly Guid instanceID;
        #endregion

        #region Ctor
        public MassTransitManager(IBusControl massTransitBus)
        {

            this.busControl = massTransitBus;
            this.instanceID = Guid.NewGuid();
        }
        #endregion

        #region Public Methods
        public void Start()
        {
            try
            {
                this.busControl.Start();
            }
            catch (Exception exc)
            {
                //TODO: Log error
                throw;
            }
        }

        public void Stop()
        {
            try
            {
                this.busControl.Stop();
            }
            catch (Exception exc)
            {
                //TODO: Log error
                throw;
            }

        }
        #endregion
    }
}
