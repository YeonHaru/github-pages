import type {ReactNode} from "react";

type Props = {
    children: ReactNode;
};

function HomeCard({children} : Props){

    return(
        <div className="bg-black/30 rounded-2xl">
            {children}
        </div>
    )

}

export default HomeCard;