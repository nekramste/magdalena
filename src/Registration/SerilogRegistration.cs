#region Libraries
using FF.Macau;
using Microsoft.Extensions.DependencyInjection;
using ILoggerFactory = Microsoft.Extensions.Logging.ILoggerFactory;
using Serilog;
using FF.Macau.Logging;
using Common.Logging;
using Serilog.Extensions.Logging;
using Common.Logging.Serilog;
#endregion

namespace FF.Magdalena.Registration
{
    public static class SerilogRegistration
    {
        #region Methods

        public static IServiceCollection AddSerilog(this IServiceCollection services)
        {
            Ensure.IsNotNull(services, nameof(services));
            ConfigureCommonLoggingWithSerilog();
            services.AddSingleton<ILoggerFactory>(_ => new SerilogLoggerFactory(Log.Logger))
                    .AddSingleton(_ => LoggerProvider.Current);
            return services;
        }

        public static void ConfigureCommonLoggingWithSerilog() =>
            LogManager.Adapter = new SerilogFactoryAdapter(Log.Logger);


        #endregion Methods
    }
}
