using System;

namespace FF.Magdalena.Models
{
    public class Context
    {
        public string User { get; private set; }

        public DateTime Date { get; private set; }

        public Context(string user)
        {
            this.User = user;
            this.Date = DateTime.Now;
        }
    }
}
