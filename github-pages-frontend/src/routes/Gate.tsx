import {useAuth} from "../context/AuthContext.tsx";
import AuthedShell from "./AuthedShell.tsx";
import Login from "../pages/login/Login.tsx";

function Gate() {
    const { isAuthed, loading } = useAuth();

    if (loading) return null;
    return isAuthed ? <AuthedShell /> : <Login />;
}

export default Gate;