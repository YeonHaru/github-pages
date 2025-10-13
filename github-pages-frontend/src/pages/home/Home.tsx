import {useAuth} from "../../context/AuthContext.tsx";
import TodoList from "./components/TodoList.tsx";

function Home() {
    const { user } =useAuth();

    return (
        <div>
            <h1 className="text-pink-500">Welcome {user?.username}</h1>
            <TodoList />
        </div>

    )

}

export default Home;