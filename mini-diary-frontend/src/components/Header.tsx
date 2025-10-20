import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import ViewContainer from "./ViewContainer.tsx";
import {useCalendar} from "../hooks/useCalendar.ts";

function Header() {
    const {user, logout} = useAuth();
    const {date, time} = useCalendar()

    return (
        <div className="bg-gray-900/50">
            <ViewContainer>
                <header className="text-white py-4">
                    <nav className="mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-lg font-semibold hover:text-gray-200 transition-colors"
                            >Home</Link>

                            <Link
                                to="/todo"
                                className="text-lg font-semibold hover:text-gray-200 transition-colors"
                            >Todo</Link>

                            <Link
                                to="/about"
                                className="text-lg font-semibold hover:text-gray-200 transition-colors"
                            >About</Link>

                        </div>
                        <div className="flex items-center space-x-3">
                            {user && <span>Welcome, <strong>{user.username}</strong>!</span>}
                            <button
                                onClick={logout}
                                className="px-3 py-1 text-sm border-2 rounded-md hover:text-gray-200 hover:border-gray-200"
                            >Log Out</button>
                            <div className="pl-2 font-semibold">
                                <p>{date}</p>
                                <p>{time}</p>
                            </div>
                        </div>
                    </nav>
                </header>
            </ViewContainer>
        </div>
    );
}

export default Header;