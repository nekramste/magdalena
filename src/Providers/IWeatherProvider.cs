using System.Collections.Generic;
using blog.Models;

namespace FF.Magdalena.Providers
{
    public interface IWeatherProvider
    {
        List<WeatherForecast> GetForecasts();
    }
}
