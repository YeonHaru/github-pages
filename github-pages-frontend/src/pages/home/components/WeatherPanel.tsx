import {useWeather} from "../../../hooks/useWeather.ts";

function WeatherPanel() {
    const {weather, loading, error} = useWeather();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!weather) return null;

    const icon = weather.weather[0].icon;
    const temp = weather.main.temp.toFixed(1);
    const desc = weather.weather[0].description;
    
    return (
        <div className="h-full flex items-center justify-center">
            <div className="
                text-white
                px-4
                text-center
            ">
                <h2 className="text-2xl font-bold">{weather.name}</h2>
                <p className="text-lg">{desc}</p>
                <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                     alt={desc}
                />
                <p>{temp}°C</p>
            </div>
        </div>
    )
}

export default WeatherPanel;