import type {Advice} from "../types/advice.ts";

const ENDPOINT = "https://korean-advice-open-api.vercel.app/api/advice";

export async function fetchAdvice(): Promise<Advice> {
    const res = await fetch(ENDPOINT);
    if(!res.ok) throw new Error(`데이터를 불러오지 못했습니다.`);
    return res.json() as Promise<Advice>;
}