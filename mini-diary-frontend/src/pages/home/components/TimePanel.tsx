import {useClock} from "../../../hooks/useClock.ts";
import {useCalendar} from "../../../hooks/useCalendar.ts";


function TimePanel() {

    const time = useClock();
    const {date} = useCalendar();

    return (

        <div className="h-full flex items-center justify-center">
            <div className="
            text-white
            py-4
            text-center
            ">
                <p className="py-1 text-3xl">{date}</p>
                <p className="py-1 text-7xl">{time}</p>
            </div>
        </div>

    )
}

export default TimePanel;