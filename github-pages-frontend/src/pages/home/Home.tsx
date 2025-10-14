// import TodoList from "./components/TodoList.tsx";
import ViewContainer from "../../components/ViewContainer.tsx";
import TimePanel from "./components/TimePanel.tsx";
import TodoList from "./components/TodoList.tsx";


function Home() {

    return (
        <ViewContainer>
            <div>
                <TimePanel></TimePanel>
                <TodoList></TodoList>
            </div>
        </ViewContainer>

    )

}

export default Home;