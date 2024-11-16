using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace FF.Magdalena.WebSockets
{
    public class ConnectionManager
    {
        #region Properties
        private ConcurrentDictionary<string, WebSocket> sockets = new ConcurrentDictionary<string, WebSocket>(); 
        #endregion

        #region Methods
        public WebSocket GetSocketById(string id)
        {
            return sockets.FirstOrDefault(p => p.Key == id).Value;
        }

        public ConcurrentDictionary<string, WebSocket> GetAll()
        {
            return sockets;
        }

        public string GetId(WebSocket socket)
        {
            return sockets.FirstOrDefault(p => p.Value == socket).Key;
        }

        public Task AddSocket(WebSocket socket)
        {
            sockets.TryAdd(CreateConnectionId(), socket);
            return Task.FromResult(true);
        }

        public async Task RemoveSocket(string id)
        {
            WebSocket socket;
            sockets.TryRemove(id, out socket);

            await socket.CloseAsync(closeStatus: WebSocketCloseStatus.NormalClosure,
                                    statusDescription: "Closed by the ConnectionManager",
                                    cancellationToken: CancellationToken.None);
        } 
        #endregion

        private string CreateConnectionId()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
