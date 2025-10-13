import {useAuth} from "../../context/AuthContext.tsx";
import TodoList from "./components/TodoList.tsx";
import ViewContainer from "../../components/ViewContainer.tsx";

function Home() {
    const {user} = useAuth();

    return (
        <ViewContainer>
            <div>
                <h1 className="text-pink-500">Welcome {user?.username}</h1>
                <TodoList/>
            </div>
        </ViewContainer>

    )

}

export default Home;