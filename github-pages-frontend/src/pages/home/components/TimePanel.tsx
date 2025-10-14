import {useClock} from "../../../hooks/useClock.ts";
import {useCalendar} from "../../../hooks/useCalendar.ts";


function TimePanel() {

    const time = useClock();
    const {date} = useCalendar();

    return (

        <div className="
            text-white text-5xl
            grid place-items-center
            py-4
            ">
            <h1 className="py-1">{date}</h1>
            <h1 className="py-1">{time}</h1>
        </div>

    )
}

export default TimePanel;