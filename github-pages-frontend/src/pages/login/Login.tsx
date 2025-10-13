import {useAuth} from "../../context/AuthContext.tsx";
import {type FormEvent, useState} from "react";

function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = username.trim().replace(/\s+/g, " ");
        if (!value) return;
        login(value);
    };

    return(
        <main>
            <h1>Log In</h1>
            <form onSubmit={onSubmit}>
                <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Please enter your username"
                    autoFocus
                />
                <button type="submit">Enter</button>
            </form>
        </main>
    )

}

export default Login;