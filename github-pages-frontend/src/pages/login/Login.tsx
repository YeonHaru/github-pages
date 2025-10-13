import { useAuth } from "../../context/AuthContext.tsx";
import { type FormEvent, useState } from "react";

/**
 * 단순 로그인 페이지
 * - 기존 기능 그대로 유지
 * - TailwindCSS v4 스타일 적용
 */
function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = username.trim().replace(/\s+/g, " ");
        if (!value) return;
        login(value);
    };

    return (
        <main className="min-h-dvh grid place-items-center ">
            {/* 카드 */}
            <div className="w-full max-w-[400px] rounded-2xl bg-black/60 p-8 shadow-lg ">
                {/* 제목 */}
                <h1 className="mb-6 text-center text-2xl font-semibold text-white">
                    Log In
                </h1>

                {/* 폼 */}
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Please enter your username"
                        autoFocus
                        className="rounded-xl bg-white px-4 py-3 text-base outline-none transition
                        border-2 border-white focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="rounded-xl bg-blue-400 py-3 text-sm font-semibold text-white transition
                       hover:bg-blue-600 active:translate-y-[1px] "
                    >
                        Enter
                    </button>
                </form>

                {/* 안내 문구 */}
                <p className="mt-6 text-center text-xs text-white">
                    GitHub Pages · React + TailwindCSS v4
                </p>
            </div>
        </main>
    );
}

export default Login;
