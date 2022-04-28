using FF.Magdalena.Exceptions;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading.Tasks;

namespace FF.Magdalena.Middleware
{
    public class ErrorHandlingMiddleware
    {
        #region Private Members
        private readonly RequestDelegate next;
        #endregion

        #region Ctor
        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }
        #endregion

        #region Public Method
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        #endregion

        #region Private Method
        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            int statusCode;
            var message = string.Empty;
            if (exception is InvalidRequestException)
            {
                statusCode = (int)HttpStatusCode.BadRequest;
                message = JsonConvert.SerializeObject(new { statusCode = statusCode, message = exception.Message });
            }
            else
            {
                statusCode = (int)HttpStatusCode.InternalServerError;
                message = JsonConvert.SerializeObject(new { statusCode = statusCode, message = "Internal Server Error" });
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;
            return context.Response.WriteAsync(message);

        }
        #endregion
    }
}
