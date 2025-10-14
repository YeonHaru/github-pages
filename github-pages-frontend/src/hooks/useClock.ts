import {useEffect, useState} from "react";
import {getClockBySeconds} from "../utils/dateUtils.ts";

export function useClock() {
    const [time, setTime] = useState(getClockBySeconds);
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getClockBySeconds);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return time;
}