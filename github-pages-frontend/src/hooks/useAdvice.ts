import {useCallback, useEffect, useRef, useState} from "react";
import type {Advice} from "../types/advice.ts";
import {fetchAdvice} from "../api/fetchAdvice.ts";

export function useAdvice() {
    const [data, setData] = useState<Advice | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchAdvice();
            if (!mountedRef.current) return;
            setData(res);
        } catch (error) {
            if (!mountedRef.current) return;
            setData(null);
            setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return {
        data,
        loading,
        error,
        refetch: load,
    };
}

export type UseAdviceReturn = ReturnType<typeof useAdvice>;