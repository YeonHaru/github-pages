import ViewContainer from "../../components/ViewContainer.tsx";
import HomeCard from "./components/HomeCard.tsx";
import TimePanel from "./components/TimePanel.tsx";
import AdvicePanel from "./components/AdvicePanel.tsx";
import WeatherPanel from "./components/WeatherPanel.tsx";


function Home() {

    return (
        <ViewContainer>
            <main className=" py-10 flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4 auto-rows-[40vh]">
                    <HomeCard><TimePanel /></HomeCard>
                    <HomeCard><AdvicePanel/></HomeCard>
                    <HomeCard><WeatherPanel /></HomeCard>
                    <HomeCard>dd</HomeCard>
                </div>
            </main>
        </ViewContainer>

    )

}

export default Home;