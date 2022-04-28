using FF.Macau;
using FF.Magdalena.Middleware;
using Microsoft.AspNetCore.Builder;

namespace FF.Magdalena.Registration
{
    public static class MiddleWaresRegistrationExtension
    {
        public static IApplicationBuilder UseCustomMiddleWares(this IApplicationBuilder app)
        {
            Ensure.IsNotNull(app, nameof(app));
            return app.UseMiddleware<ErrorHandlingMiddleware>();
        }
    }
}
