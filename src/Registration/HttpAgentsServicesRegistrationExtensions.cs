#region Libraries
using AutoMapper;
using FF.Macau.Http;
using FF.Macau.Http.Json;
using FF.Magdalena.Agents;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using System;
#endregion

namespace FF.Magdalena.Registration
{
    public static class HttpAgentsServicesRegistrationExtensions
    {
        public static IServiceCollection AddHttpAgents(this IServiceCollection services)
        {
            services.TryAddSingleton<IHttpClientFactory>(provider => new HttpClientFactoryForJsonRequests(
             () => NetHttpClient.CreateForJsonRequest(),
             () => new JsonSerializer(provider.GetService<Newtonsoft.Json.JsonSerializer>())));

            services.AddSingleton<IClarkeAgent>(provider => new HttpClarkeAgent(
              uri: new Uri(provider.GetService<IOptions<ServiceUriOptions>>().Value.Clarke),
             httpClientFactory: provider.GetService<IHttpClientFactory>())
          );

            return services;
        }
    }
}
