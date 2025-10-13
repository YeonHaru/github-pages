// 로컬 스토리지 키
import {createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";

export const AUTH_STORAGE_KEY = "gp.auth.v1";

// 사용자 정보 타입
export type AuthUser = {
    username: string;
};

// 컨텍스트가 외부에 제공할 것들
export type AuthContextValue = {
    isAuthed: boolean;
    user: AuthUser | null;
    loading: boolean; // 초기 복원 중 플래시 방지
    login: (username: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
    children: ReactNode;
};

function normalizeUsername(input: string): string {
    return input.trim().replace(/\s+/g, " ");
}

// 로컬 스토리지: 세션 읽기
function readSession(): AuthUser | null {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.username === "string" && parsed.username.trim()) {
            return {username: normalizeUsername(parsed.username)};
        }
        return null;
    } catch {
        return null;
    }
}

function writeSession(user: AuthUser): void {
    try {
        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({username: user.username}),
        );
    } catch {

    }
}

// 로컬 스토리지 세션 제거

function clearSession(): void {
    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
        //     무시
    }
}

// 전역 인증 컨텍스트 프로바이더

export function AuthProvider({children}: Props) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // 초기 복원
    useEffect(() => {
        const session = readSession();
        setUser(session);
        setLoading(false);
    }, []);

    // 멀티 탭 동기화
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== AUTH_STORAGE_KEY) return;
            const session = readSession();
            setUser(session);
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const login = useCallback((username: string) => {
        const normalized = normalizeUsername(username);
        if (!normalized) {
            return;
        }
        const next: AuthUser = {username: normalized};
        setUser(next);
        writeSession(next);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        clearSession();
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
            isAuthed: !!user,
            user,
            loading,
            login,
            logout,
        }),
        [user, loading, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return ctx;
}