#region Libraries
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
#endregion

namespace FF.Magdalena.Registration
{
    public static class ServicesRegistrationExtension
    {
        public static IServiceCollection AddNewtonsoftJsonSerializer(this IServiceCollection services)
        {
            services.AddSingleton(r => JsonSerializer.Create(new JsonSerializerSettings()));
            return services;
        }

        public static IServiceCollection AddConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions();
            services.Configure<ServiceUriOptions>(opt => configuration.GetSection("ServiceUriOptions").Bind(opt));
            return services;
        }
    }
}
