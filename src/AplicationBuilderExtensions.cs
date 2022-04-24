using FF.Magdalena.MassTransit;
using FF.Magdalena.Middleware;
using FF.Magdalena.WebSockets;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
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


        public static IApplicationBuilder MapWebSocketManager(this IApplicationBuilder app,
                                                            PathString path,
                                                            WebSocketHandler handler)
        {
            return app.Map(path, (_app) => _app.UseMiddleware<WebSocketManagerMiddleware>(handler));
        }
    }
}
