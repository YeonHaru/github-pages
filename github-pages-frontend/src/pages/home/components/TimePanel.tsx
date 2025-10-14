import {useEffect, useState} from "react";

function TimePanel() {

    function getClock() {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    }

    const [time, setTime] = useState(getClock());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getClock());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <h1>{time}</h1>
        </>
    )
}

export default TimePanel;