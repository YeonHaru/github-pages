import { useEffect, useState } from "react";

interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
    };
    weather: {
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        speed: number;
    };
}

export function useWeather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("이 브라우저에서는 위치 정보를 지원하지 않아요 🥲");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const apiKey = "dc1d98df26190b0cc5b4c232aad250f7"; //
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                    );
                    if (!res.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");
                    const data = await res.json();
                    setWeather(data);
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("알 수 없는 오류가 발생했습니다.");
                    }
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError("위치 정보를 가져올 수 없습니다.");
                setLoading(false);
            }
        );
    }, []);

    return { weather, loading, error };
}
