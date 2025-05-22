'use client';

import { useState, ChangeEvent } from 'react';

const exampleJSON = `[
  {
    "title": "Как выбрать садовую мебель",
    "slug": "kak-vybrat-sadovuyu-mebel",
    "content": "Подробный гайд по выбору садовой мебели: материалы, размеры, стиль.",
    "imageUrl": "https://example.com/images/sadovaya-mebel-1.jpg",
    "categoryName": "Садовая мебель",
    "authorName": "Иван Иванов"
  }
]`;

export default function UploadPostsJSON() {
    const [jsonInput, setJsonInput] = useState(exampleJSON);
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTextUpload = async () => {
        try {
            const posts = JSON.parse(jsonInput);

            if (!Array.isArray(posts)) {
                setMessage('JSON должен быть массивом объектов постов');
                return;
            }

            await uploadToServer(posts);
        } catch (e) {
            setMessage('Некорректный JSON');
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage('Выберите файл JSON');
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const text = await file.text();
            const posts = JSON.parse(text);

            if (!Array.isArray(posts)) {
                setMessage('JSON из файла должен быть массивом объектов постов');
                return;
            }

            await uploadToServer(posts);
        } catch (e) {
            setMessage('Ошибка при чтении файла или некорректный JSON');
        } finally {
            setLoading(false);
        }
    };

    const uploadToServer = async (posts: any[]) => {
        try {
            const res = await fetch('/api/admin/posts/upload-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(posts),
            });

            if (!res.ok) {
                const error = await res.text();
                setMessage(`Ошибка загрузки: ${error}`);
                return;
            }

            setMessage(`Постов загружено: ${posts.length}`);
            setJsonInput('');
            setFile(null);
        } catch (e) {
            setMessage('Ошибка отправки данных на сервер');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Загрузка постов через JSON</h1>

            {/* Ручной ввод */}
            <div>
                <label className="block font-semibold mb-2 text-gray-700">Вставьте JSON вручную:</label>
                <textarea
                    className="w-full h-64 rounded-md border border-gray-300 p-3 font-mono text-sm
                        text-black placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    placeholder="Вставьте JSON-массив постов здесь"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                />
                <button
                    onClick={handleTextUpload}
                    className="mt-3 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    Загрузить из текста
                </button>
            </div>

            <hr className="my-6 border-gray-300" />

            {/* Загрузка из файла */}
            {/* Загрузка из файла */}
            <div className="space-y-3">
                <label className="block font-semibold mb-2 text-gray-700">Или выберите JSON-файл:</label>

                <div className="flex items-center justify-between space-x-4">
                    {/* Левая часть: кнопка выбора файла + имя файла */}
                    <div className="flex items-center space-x-4 flex-grow">
                        {/* Скрытый input файла */}
                        <input
                            id="file-upload"
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {/* Кастомная кнопка */}
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition select-none"
                        >
                            Выбрать файл
                        </label>
                        {/* Имя файла или "Файл не выбран" */}
                        <span className="text-gray-700 font-medium truncate">
        {file ? file.name : 'Файл не выбран'}
      </span>
                    </div>

                    {/* Правая часть: кнопка загрузки */}
                    <button
                        onClick={handleFileUpload}
                        disabled={loading}
                        className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Загрузка...' : 'Загрузить из файла'}
                    </button>
                </div>
            </div>


            {message && (
                <p className="mt-4 text-center text-red-600 whitespace-pre-wrap">{message}</p>
            )}
        </div>
    );
}
