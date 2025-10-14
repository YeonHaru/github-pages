import {useEffect, useState} from "react";

interface AdviceInterface {
    author: string;
    authorProfile: string;
    message: string;
}

function AdvicePanel() {
    const [advice, setAdvice] = useState<AdviceInterface | null>(null);
    const [loading, setLoading] = useState(true);

    // 1) fetch는 한 번만
    useEffect(() => {
        let ignore = false; // 언마운트 대비 가드
        (async () => {
            const res = await fetch("https://korean-advice-open-api.vercel.app/api/advice");
            const json: AdviceInterface = await res.json();
            if (!ignore) {
                setAdvice(json);
                setLoading(false);
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    if (loading) return <p>불러오는 중...</p>;
    if (!advice) return <p>데이터 없음</p>;

    return (
        <div className="h-full flex items-center justify-center">
            <div className="
                text-white
                px-4
                text-center
            ">
                <p className="py-1 text-2xl">{advice.message}</p>
                <p className="py-1 text-xl">
                    — {advice.author} ({advice.authorProfile})
                </p>
            </div>
        </div>
    );
}

export default AdvicePanel;
