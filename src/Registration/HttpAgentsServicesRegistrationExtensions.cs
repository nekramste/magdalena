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
             //uri: new Uri("http://localhost:8008/"),   
             uri: new Uri("http://nelsonbwks.sport.local:8008/api/grade/scores"),
             httpClientFactory: provider.GetService<IHttpClientFactory>())
          );

            return services;
        }
    }
}
