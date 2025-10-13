// src/components/TodoList.tsx
import {useEffect, useMemo, useState, type ChangeEvent, type FormEvent} from "react";

type Todo = {
    id: number;
    text: string;
    done: boolean;
    createdAt: number;
};

const STORAGE_KEY = "gp.todos"; // 단순 배열만 저장
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

    // 변경 시 저장
    useEffect(() => {
        save(todos);
    }, [todos]);

    // 미완료 우선 → 최신 생성순
    const ordered = useMemo(() => {
        return [...todos].sort((a, b) => {
            if (a.done !== b.done) return a.done ? 1 : -1;
            return b.createdAt - a.createdAt;
        });
    }, [todos]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const v = text.trim().replace(/\s+/g, " ");
        if (!v || v.length > MAX_TEXT_LEN) return;

        const now = Date.now();
        setTodos((prev) => [{ id: now, text: v, done: false, createdAt: now }, ...prev]);
        setText("");
    };

    const toggle = (id: number) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    };

    const remove = (id: number) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    };

    const clearCompleted = () => {
        setTodos((prev) => prev.filter((t) => !t.done));
    };

    return (
        <section>
            <h2>Todo List</h2>

            <form onSubmit={onSubmit}>
                <label htmlFor="todo-input">Add a new todo</label>
                <input
                    id="todo-input"
                    type="text"
                    value={text}
                    onChange={onChange}
                    placeholder="What needs to be done?"
                    autoComplete="off"
                    autoFocus
                />
                <button type="submit">Add</button>
            </form>

            <div>
                <button type="button" onClick={clearCompleted}>Clear completed</button>
            </div>

            <ul>
                {ordered.length === 0 ? (
                    <li>No todos yet.</li>
                ) : (
                    ordered.map((t) => (
                        <li key={t.id}>
                            <input
                                type="checkbox"
                                checked={t.done}
                                onChange={() => toggle(t.id)}
                                aria-label={`toggle ${t.text}`}
                            />
                            <span>{t.text}</span>
                            <button type="button" onClick={() => remove(t.id)} aria-label="delete">
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
