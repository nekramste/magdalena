using Microsoft.AspNetCore.Mvc;

namespace FF.Magdalena.Controllers
{
    public static class ControllerExtension
    {
        public static string GetUserName(this Controller controller)
        {
            return controller.User.Identity.Name.Split('\\')[1] ?? "unknownUser";
        }
    }
}
