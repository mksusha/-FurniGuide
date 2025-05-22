'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

const exampleJSON = `[
  {
    "name": "Автор 10",
    "bio": "Био автора 10, краткое описание.",
    "avatarUrl": "https://example.com/avatars/author10.jpg"
  }
]`;

export default function UploadAuthorsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jsonInput, setJsonInput] = useState(exampleJSON);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    }

    async function handleFileSubmit(e: FormEvent) {
        e.preventDefault();
        if (!file) {
            setMessage('Выберите файл JSON');
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const text = await file.text();
            const json = JSON.parse(text);

            const res = await fetch('/api/admin/authors/upload-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(json),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(`Ошибка: ${data.error || 'Неизвестная ошибка'}`);
            } else {
                setMessage(`Добавлено авторов: ${data.length}`);
            }
        } catch (err) {
            setMessage('Ошибка при чтении или отправке файла');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleTextSubmit() {
        try {
            const parsed = JSON.parse(jsonInput);

            const res = await fetch('/api/admin/authors/upload-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(`Ошибка: ${data.error || 'Неизвестная ошибка'}`);
            } else {
                setMessage(`Добавлено авторов: ${data.length}`);
                setJsonInput('');
            }
        } catch {
            setMessage('Некорректный JSON');
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Загрузка авторов из JSON</h1>

            {/* Загрузка через файл */}
            <form onSubmit={handleFileSubmit} className="space-y-4">
                <label className="block font-semibold mb-2 text-gray-700">Выберите JSON-файл:</label>

                <div className="flex items-center space-x-4">
                    <input
                        id="author-file-upload"
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="author-file-upload"
                        className="cursor-pointer bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition select-none"
                    >
                        Выбрать файл
                    </label>
                    <span className="text-gray-700 font-medium truncate flex-grow">
                        {file ? file.name : 'Файл не выбран'}
                    </span>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Загрузка...' : 'Загрузить из файла'}
                    </button>
                </div>
            </form>

            <hr className="my-6 border-gray-300" />

            {/* Ввод через textarea */}
            <div className="space-y-3">
                <label className="block font-semibold mb-2 text-gray-700">Или вставьте JSON вручную:</label>
                <textarea
                    className="w-full h-48 rounded-md border border-gray-300 p-3 font-mono text-sm
                        text-black placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    placeholder="Вставьте JSON-массив авторов здесь"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                />
                <button
                    onClick={handleTextSubmit}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    Загрузить из текста
                </button>
            </div>

            {message && (
                <p className="mt-4 text-center text-red-600 whitespace-pre-wrap">{message}</p>
            )}
        </div>
    );
}
