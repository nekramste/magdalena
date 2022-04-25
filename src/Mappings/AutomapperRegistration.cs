#region Libraries

using AutoMapper;
using FF.Macau;
using FF.Macau.AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

#endregion Libraries

namespace FF.Magdalena.Mappings
{
    public static class AutomapperRegistration
    {
        #region Constants

        private const string APPLICATION_PREFIX = "FF.Magdalena";
        private static Type profileType = typeof(AutoMapper.Profile);

        #endregion Constants

        #region Methods

        public static IServiceCollection AddAutoMapper(this IServiceCollection services)
        {
            Ensure.IsNotNull(services, nameof(services));

            services.AddSingleton<FF.Macau.Mapping.IMapper, AutoMapperMapper>()
                    .AddSingleton<IMapper>(provider =>
                    {
                        return new MapperConfiguration(ConfigureAutoMapper).CreateMapper();
                    });
            return services;
        }

        private static void ConfigureAutoMapper(IMapperConfigurationExpression configurationExpression) =>
            AppDomain.CurrentDomain
                     .GetAssemblies()
                     .Where(asembly => asembly.FullName.Contains(APPLICATION_PREFIX))
                     .ConcreteTypes()
                     .Where(type => profileType.IsAssignableFrom(type))
                     .ForEach(configurationExpression.AddProfile);

        #endregion Methods
    }
}
