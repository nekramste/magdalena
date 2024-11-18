#region Libraries
using System;
using System.Configuration;
#endregion

namespace FF.Magdalena.Configuration
{
    public class RabbitMqConfiguration
    {
        #region
        public Uri Host { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Queue { get; set; }
        public string Nodes { get; set; }
        #endregion
    }
}
