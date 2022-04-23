using System.Collections.Generic;
using blog.Models;

namespace blog.Providers
{
    public interface IWeatherProvider
    {
        List<WeatherForecast> GetForecasts();
    }
}
