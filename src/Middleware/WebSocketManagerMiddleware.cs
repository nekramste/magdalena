using FF.Macau;
using FF.Magdalena.WebSockets;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace FF.Magdalena.Middleware
{
    public class WebSocketManagerMiddleware
    {
        #region Members
        private readonly RequestDelegate next;
        private WebSocketHandler webSocketHandler { get; set; }

        #endregion

        #region Constants
        private const int BUFFER_SIZE = 4 * 1024;
        #endregion



        public WebSocketManagerMiddleware(RequestDelegate next, WebSocketHandler webSocketHandler)
        {
            this.next = next;
            this.webSocketHandler = webSocketHandler;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.WebSockets.IsWebSocketRequest)
            {
                using (var webSocket = await context.WebSockets.AcceptWebSocketAsync())
                {
                    await webSocketHandler.OnConnected(webSocket);

                    await HandleWebSocketConnectionAsync(webSocket);

                }
            }
            else
            {
                await next(context);
            }
        }

        private async Task HandleWebSocketConnectionAsync(WebSocket webSocket)
        {
            var buffer = new byte[BUFFER_SIZE];

            var keepAliveTask = SendAliveMessagesAsync(webSocket);

            try
            {
                while (webSocket.State == WebSocketState.Open)
                {
                    var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);


                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
                        break;
                    }
                }
            }
            finally
            {
                await keepAliveTask;
            }
        }

        private async Task Receive(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
        {
            var buffer = new byte[BUFFER_SIZE];

            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(buffer: new ArraySegment<byte>(buffer),
                                                        cancellationToken: CancellationToken.None);

                handleMessage(result, buffer);
            }
        }

        private async Task SendAliveMessagesAsync(WebSocket webSocket)
        {
            var pingInterval = TimeSpan.FromSeconds(30);
            while (webSocket.State == WebSocketState.Open)
            {
                await Task.Delay(pingInterval);
                if (webSocket.State == WebSocketState.Open)
                {
                    await webSocket.SendAsync(
                        new ArraySegment<byte>(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(this.CreateAliveMessage()))),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None
                    );
                }
            }
        }

        private object CreateAliveMessage()
        {
            return new
            {
                message = "Alive",
                time = SystemTime.Now()
            };
        }
    }
}