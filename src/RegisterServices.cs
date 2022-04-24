using FF.Magdalena.Consumers;
using FF.Magdalena.Providers;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using FF.Magdalena.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using FF.Magdalena.MassTransit;
using MassTransit.RabbitMqTransport;

namespace FF.Magdalena
{
    public static class RegisterServices
    {
        public static IServiceCollection AddServices(this IServiceCollection services, Action<IServiceCollection> actionRegisterOptions = null)
        {
            services.AddSingleton<IWeatherProvider, WeatherProviderFake>();


            services.AddSingleton<IBusManager, MassTransitManager>();
            services.AddSingleton<IBusControl>(provider =>
            {
                var options = provider.GetRequiredService<IOptions<RabbitMqConfiguration>>().Value;
                return CreateBus(services, provider);
            });

            services.AddSingleton<GameScoreConsumer, GameScoreConsumer>();
            return services;
        }

        public static IServiceCollection AddMassTransitSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions();
            services.Configure<RabbitMqConfiguration>(opt => configuration.GetSection("RabbitMqConfiguration").Bind(opt));
            return services;
        }

        private static IBusControl CreateBus(this IServiceCollection services,  IServiceProvider provider) =>
              Bus.Factory.CreateUsingRabbitMq(configurator =>
              {
                  var settings = provider.GetRequiredService<IOptions<RabbitMqConfiguration>>().Value;

                  var host = configurator.CreateHost(settings);
                  var consumerTypes = services.GetConsumerTypes();
                  if (consumerTypes.Any())
                  {
                      configurator.ConfigureConsumers(host, settings.Queue, provider, consumerTypes);
                  }
                  configurator.Durable = true;

                  configurator.Durable = true;
              });

        public static IRabbitMqHost CreateHost(this IRabbitMqBusFactoryConfigurator configurator, RabbitMqConfiguration settings)
        {
            return configurator.Host(settings.Host, hostConfigurator =>
            {
                hostConfigurator.SetHostCredentials(settings);
               
                hostConfigurator.UseCluster(c => c.ConfigureCluster(settings.Nodes));
               
            });
        }
          

        private static IRabbitMqHostConfigurator SetHostCredentials(this IRabbitMqHostConfigurator configurator, RabbitMqConfiguration settings)
        {
            configurator.Username(settings.UserName);
            configurator.Password(settings.Password);
            return configurator;
        }

        private static IList<Type> GetConsumerTypes(this IServiceCollection services) =>
         services.Where(s => s.IsConsumer())
                 .Select(s => s.ImplementationType)
                 .ToList();
        private static bool IsConsumer(this ServiceDescriptor descriptor) => typeof(IConsumer).IsAssignableFrom(descriptor.ImplementationType);

        private static void ConfigureConsumers(this IRabbitMqBusFactoryConfigurator configurator, IRabbitMqHost host, string inputQueue, IServiceProvider provider, IList<Type> consumerTypes) =>
         configurator.ReceiveEndpoint(host, inputQueue, c => c.RegisterConsumersIntoTheBus(provider, consumerTypes));

        private static void RegisterConsumersIntoTheBus(this IRabbitMqReceiveEndpointConfigurator configurator, IServiceProvider provider, IList<Type> consumerTypes)
        {
            foreach (var c in consumerTypes)
            {
                configurator.Consumer(c, type => provider.GetService(type));
            }
        }
        private static void ConfigureCluster(this IRabbitMqClusterConfigurator configurator, string nodeNames)
        {
            if (!string.IsNullOrEmpty(nodeNames))
            {
                foreach(var node in nodeNames.Split(";"))
                {
                    configurator.Node(node);
                }
            }
        }
    }
}
