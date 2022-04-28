using FF.Macau;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace FF.Magdalena.Serilog
{
    public class SerlilogConfigurator
    {
        private readonly IConfiguration configuration;

        private SerlilogConfigurator(IConfiguration configuration)
        {
            Ensure.IsNotNull(configuration, nameof(configuration));
            this.configuration = configuration;
        }
        public void Configure()
        {
            var logger = new LoggerConfiguration()
              .ReadFrom.Configuration(this.configuration)
              .CreateLogger();
            Log.Logger = logger;
        }


        public static SerlilogConfigurator Create(IConfiguration configuration) => new SerlilogConfigurator(configuration);

    }
}
