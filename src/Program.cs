using FF.Magdalena.Serilog;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FF.Magdalena
{
    public class Program
    {
        private const string SETTINGS_FILE = "appsettings.json";

        public static void Main(string[] args)
        {
            var configuration = BuildConfiguration(args);
            SerlilogConfigurator.Create(configuration)
                                .Configure();
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static IConfigurationRoot BuildConfiguration(string[] args)
        {
            var minimalConfiguration = new ConfigurationBuilder()
                                            .AddCommandLine(args)
                                            .AddJsonFile(SETTINGS_FILE, optional: false, reloadOnChange: true)
                                            .Build();

            //var environment = minimalConfiguration.GetEnviroment();
            return new ConfigurationBuilder().AddConfiguration(minimalConfiguration)
                                            //.AddJsonFile($"appsettings.{environment}.json", optional: false, reloadOnChange: true)
                                            .AddEnvironmentVariables().Build();
        }
    }
}
