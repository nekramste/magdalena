#region Libraries
using FF.Macau;
using System;
using System.Collections.Generic;
using System.Linq;
using MassTransit;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FF.Magdalena.Consumers;
using FF.Magdalena.Configuration;
using FF.Magdalena.MassTransit;
using FF.Magdalena.WebSockets;
using System.Reflection;
#endregion

namespace FF.Magdalena
{
    public static class RegisterServices
    {
        public static IServiceCollection AddServices(this IServiceCollection services, Action<IServiceCollection> actionRegisterOptions = null)
        {
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

        private static IBusControl CreateBus(this IServiceCollection services, IServiceProvider provider) =>
              Bus.Factory.CreateUsingRabbitMq(configurator =>
              {
                  var settings = provider.GetRequiredService<IOptions<RabbitMqConfiguration>>().Value;
                  var consumerTypes = services.GetConsumerTypes();

                  configurator.ConfigureHost(settings);
                  configurator.ConfigureConsumers(provider, settings.Queue, consumerTypes);
                  configurator.Durable = true;
              });

        public static void ConfigureHost(this IRabbitMqBusFactoryConfigurator configurator, RabbitMqConfiguration settings)
        {
            configurator.Host(settings.Host, hostConfigurator =>
            {
                hostConfigurator.SetHostCredentials(settings);

                hostConfigurator.UseCluster(c => c.ConfigureCluster(settings.Nodes));

            });
        }

        public static IServiceCollection AddWebSocketManager(this IServiceCollection services)
        {
            services.AddSingleton<ConnectionManager>();

            foreach (var type in Assembly.GetEntryAssembly().ExportedTypes)
            {
                if (type.GetTypeInfo().BaseType == typeof(WebSocketHandler))
                {
                    services.AddSingleton(type);
                }
            }

            return services;
        }

        private static void ConfigureConsumers(this IRabbitMqBusFactoryConfigurator configurator, IServiceProvider provider, string inputQueue, IEnumerable<Type> consumerTypes)
        {
            configurator.ReceiveEndpoint(inputQueue, receiveEndpointConfigurator =>
            {
                receiveEndpointConfigurator.RegisterConsumersIntoTheBus(provider, consumerTypes);
            });
        }

        private static IRabbitMqHostConfigurator SetHostCredentials(this IRabbitMqHostConfigurator configurator, RabbitMqConfiguration settings)
        {
            configurator.Username(settings.UserName);
            configurator.Password(settings.Password);
            configurator.RequestedConnectionTimeout(TimeSpan.FromSeconds(30));
            return configurator;
        }

        private static IList<Type> GetConsumerTypes(this IServiceCollection services) =>
         services.Where(s => s.IsConsumer())
                 .Select(s => s.ImplementationType)
                 .ToList();
        private static bool IsConsumer(this ServiceDescriptor descriptor) => typeof(IConsumer).IsAssignableFrom(descriptor.ImplementationType);

        private static void RegisterConsumersIntoTheBus(this IRabbitMqReceiveEndpointConfigurator configurator, IServiceProvider provider, IEnumerable<Type> consumerTypes)
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
                foreach (var node in nodeNames.Split(";"))
                {
                    configurator.Node(node);
                }
            }
        }
    }
}