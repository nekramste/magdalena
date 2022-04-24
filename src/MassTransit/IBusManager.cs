using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FF.Magdalena.MassTransit
{
    public interface IBusManager
    {
        void Start();
        void Stop();
    }
}
