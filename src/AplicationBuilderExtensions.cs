using FF.Magdalena.MassTransit;
using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FF.Magdalena
{
    public static class AplicationBuilderExtensions
    {
        public static IApplicationBuilder UseMassTransit(this IApplicationBuilder applicationBuilder)
        {

            var busManager = (IBusManager)applicationBuilder.ApplicationServices.GetService(typeof(IBusManager));
            busManager.Start();
            return applicationBuilder;
        }
    }
}
