import type {ReactNode} from "react";

function ViewContainer({children} : {children: ReactNode}) {
    return (
        <div className="mx-auto w-[95vw] sm:w-[90vw] lg:w-[80vw]">
            {children}
        </div>
    )
}

export default ViewContainer;