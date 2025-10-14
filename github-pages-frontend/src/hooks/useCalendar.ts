import {getClockByMinutes, getDateString} from "../utils/dateUtils.ts";
import {useEffect, useState} from "react";

export function useCalendar() {
    const [date, setDate] = useState(getDateString());
    const [time, setTime] = useState(getClockByMinutes());

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(getDateString());
            setTime(getClockByMinutes());
        }, 60 * 1000);

        return () => clearInterval(interval);
    },[]);

    return {date, time};
}