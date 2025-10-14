import { useAdvice } from "../../../hooks/useAdvice.ts";

function AdvicePanel() {
    const { data, loading, error, refetch } = useAdvice();

    if (loading)
        return (
            <div className="flex items-center justify-center h-full text-white text-lg">
                🌿 명언을 불러오는 중...
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-400 text-center">
                <p>⚠️ 데이터를 불러오는 중 오류가 발생했습니다.</p>
                <button
                    onClick={refetch}
                    className="mt-3 px-3 py-1 border border-gray-400 rounded-md hover:bg-gray-700"
                >
                    다시 시도
                </button>
            </div>
        );

    if (!data)
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                데이터가 없습니다.
            </div>
        );

    return (
        <div className="text-white bg-gray-800/40 rounded-2xl shadow-md p-6 text-center flex flex-col items-center justify-center h-full">
            <p className="text-2xl font-semibold mb-3 leading-snug">{data.message}</p>
            <p className="text-sm text-gray-400">
                — {data.author}
                {data.authorProfile && ` (${data.authorProfile})`}
            </p>
            <button
                onClick={refetch}
                className="mt-4 px-4 py-1 border border-gray-400 rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
                다른 명언 보기
            </button>
        </div>
    );
}

export default AdvicePanel;
