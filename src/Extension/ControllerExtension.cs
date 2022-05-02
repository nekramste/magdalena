using Microsoft.AspNetCore.Mvc;
using FF.Macau;

namespace FF.Magdalena.Controllers
{
    public static class ControllerExtension
    {
        public static string GetUserName(this Controller controller)
        {
            if (controller.User.IsNotNull())
            {
                if (controller.User.Identity.Name.IsNotNullOrEmpty())
                {
                    string[] nameParts = controller.User.Identity.Name.Split('\\');
                    return (nameParts.Length > 1) ? nameParts[1] : nameParts[0];
                }
            }
            return "Guest";
        }
    }
}
