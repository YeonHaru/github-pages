import {useEffect, useMemo, useState, type ChangeEvent, type FormEvent} from "react";

type Todo = {
    id: number;
    text: string;
    done: boolean;
    createdAt: number;
};

const STORAGE_KEY = "gp.todos";
const MAX_TEXT_LEN = 200;

function load(): Todo[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
        return [];
    }
}

function save(items: Todo[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // ignore
    }
}

function TodoList() {
    const [text, setText] = useState("");
    const [todos, setTodos] = useState<Todo[]>(() => load());

    useEffect(() => {
        save(todos);
    }, [todos]);

    const ordered = useMemo(() => {
        return [...todos].sort((a, b) => {
            if (a.done !== b.done) return a.done ? 1 : -1;
            return b.createdAt - a.createdAt;
        });
    }, [todos]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const v = text.trim().replace(/\s+/g, " ");
        if (!v || v.length > MAX_TEXT_LEN) return;
        const now = Date.now();
        setTodos((prev) => [{ id: now, text: v, done: false, createdAt: now }, ...prev]);
        setText("");
    };

    const toggle = (id: number) =>
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

    const remove = (id: number) => setTodos((prev) => prev.filter((t) => t.id !== id));
    const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.done));

    const remaining = todos.filter((t) => !t.done).length;
    const isTooLong = text.length > MAX_TEXT_LEN;

    return (
        <section
            className="mx-auto mt-10 max-w-[500px] rounded-xl bg-black/50 p-6 shadow-lg text-gray-100"
            aria-label="Todo List"
        >
            {/* Header */}
            <header className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Todo List</h2>
                <span className="rounded-md border border-gray-600/50 px-3 py-1 text-xs text-gray-300">
          {remaining} left
        </span>
            </header>

            {/* Form */}
            <form onSubmit={onSubmit} className="mb-5 flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        id="todo-input"
                        type="text"
                        value={text}
                        onChange={onChange}
                        placeholder="What needs to be done?"
                        autoComplete="off"
                        autoFocus
                        className={`flex-1 rounded-md border bg-black/60 px-4 py-2 text-sm text-gray-100 placeholder-gray-400 outline-none transition
              ${
                            isTooLong
                                ? "border-red-400/70 focus:border-red-400/90"
                                : "border-gray-700/60 focus:border-gray-500/80 focus:ring-2 focus:ring-gray-500/30"
                        }`}
                    />
                    <button
                        type="submit"
                        className="rounded-md border-2 border-gray-600/70 bg-gray-800/60 px-4 py-2 text-sm font-semibold transition-colors
                       hover:border-gray-400 hover:text-gray-200"
                    >
                        Add
                    </button>
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                    <span>Press Enter to add</span>
                    <span className={isTooLong ? "text-red-400" : ""}>
            {text.length}/{MAX_TEXT_LEN}
          </span>
                </div>
            </form>

            {/* Clear Button */}
            <div className="mb-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={clearCompleted}
                    className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-200"
                >
                    Clear completed
                </button>
                <span className="text-xs text-gray-400">{ordered.length} total</span>
            </div>

            {/* List */}
            <ul className="divide-y divide-gray-700/40 rounded-md border border-gray-700/60 bg-gray-800/50">
                {ordered.length === 0 ? (
                    <li className="p-6 text-center text-sm text-gray-400">No todos yet.</li>
                ) : (
                    ordered.map((t) => (
                        <li key={t.id} className="group flex items-start justify-between p-3">
                            <label className="flex flex-1 cursor-pointer select-none items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={t.done}
                                    onChange={() => toggle(t.id)}
                                    className="mt-1 size-4 cursor-pointer rounded border-gray-600 accent-gray-400"
                                />
                                <span
                                    className={`break-words text-sm leading-6 ${
                                        t.done ? "text-gray-500 line-through" : "text-gray-100"
                                    }`}
                                >
                  {t.text}
                </span>
                            </label>
                            <button
                                type="button"
                                onClick={() => remove(t.id)}
                                className="ml-2 rounded-md border border-gray-600/70 px-2 py-1 text-xs text-gray-400 transition hover:border-gray-400 hover:text-gray-200"
                            >
                                Delete
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
}

export default TodoList;
