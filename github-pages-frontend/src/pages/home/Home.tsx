import ViewContainer from "../../components/ViewContainer.tsx";
import TimePanel from "./components/TimePanel.tsx";


function Home() {

    return (
        <ViewContainer>
            <div className="
                flex justify-center items-center
                mt-16
                ">
                <div className="
                    bg-black/50
                    p-8
                    rounded-2xl
                    ">
                    <TimePanel></TimePanel>
                </div>
            </div>
        </ViewContainer>

    )

}

export default Home;