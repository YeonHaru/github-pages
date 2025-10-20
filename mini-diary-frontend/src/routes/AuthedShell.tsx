import Header from "../components/Header";
import {Route, Routes} from "react-router-dom";
import Home from "../pages/home/Home.tsx";
import About from "../pages/about/About.tsx";
import Todo from "../pages/todo/Todo.tsx";

function AuthedShell() {
    return(
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/todo" element={<Todo />}/>
                <Route path="/about" element={<About />} />
            </Routes>
        </>
    )
}

export default AuthedShell;