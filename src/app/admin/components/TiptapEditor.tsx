'use client';

import { useState, useRef } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import type { Level } from '@tiptap/extension-heading';

interface TiptapEditorProps {
    editor: Editor | null;
}

export default function TiptapEditor({ editor }: TiptapEditorProps) {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleHeading = (level: Level) => {
        if (editor) {
            editor.chain().focus().toggleHeading({ level }).run();
        }
    };

    if (!editor) return null;

    const headingLevels: Level[] = [1, 2, 3, 4, 5];

    return (
        <div className="space-y-2">
            <label className="block font-semibold text-sm text-gray-700">Контент</label>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 rounded-md border">
                <button
                    type="button"
                    title="Жирный"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                    B
                </button>
                <button
                    type="button"
                    title="Курсив"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                    I
                </button>

                {headingLevels.map((lvl) => (
                    <button
                        key={lvl}
                        title={`Заголовок H${lvl}`}
                        type="button"
                        onClick={() => toggleHeading(lvl)}
                        className={`p-1 rounded text-xs ${
                            editor.isActive('heading', { level: lvl }) ? 'bg-gray-300' : 'hover:bg-gray-200'
                        }`}
                    >
                        H{lvl}
                    </button>
                ))}

                <button
                    type="button"
                    title="Маркированный список"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                    • List
                </button>
                <button
                    type="button"
                    title="Нумерованный список"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                    1. List
                </button>


                {/* <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        /> */}
            </div>

            {/* Table Insert Controls */}
            <div className="flex items-center gap-3 flex-wrap text-sm">
                <label>Строк:</label>
                <input
                    type="number"
                    value={rows}
                    min={1}
                    className="border rounded px-2 py-1 w-16 text-sm"
                    onChange={(e) => setRows(Number(e.target.value))}
                />
                <label>Столбцов:</label>
                <input
                    type="number"
                    value={cols}
                    min={1}
                    className="border rounded px-2 py-1 w-16 text-sm"
                    onChange={(e) => setCols(Number(e.target.value))}
                />
                <button
                    type="button"
                    title="Вставить таблицу"
                    className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                    onClick={() => editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()}
                >
                    Таблица
                </button>
            </div>

            {/* Table Editing */}
            {editor.isActive('table') && (
                <div className="flex flex-wrap gap-2 mt-1">
                    <button
                        type="button"
                        title="Добавить строку"
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-500"
                        disabled={!editor.can().chain().focus().addRowAfter().run()}
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                    >
                        + строка
                    </button>
                    <button
                        type="button"
                        title="Удалить строку"
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-500"
                        disabled={!editor.can().chain().focus().deleteRow().run()}
                        onClick={() => editor.chain().focus().deleteRow().run()}
                    >
                        - строка
                    </button>
                    <button
                        type="button"
                        title="Добавить столбец"
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-500"
                        disabled={!editor.can().chain().focus().addColumnAfter().run()}
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                    >
                        + столбец
                    </button>
                    <button
                        type="button"
                        title="Удалить столбец"
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-500"
                        disabled={!editor.can().chain().focus().deleteColumn().run()}
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                    >
                        - столбец
                    </button>
                    <button
                        type="button"
                        title="Удалить таблицу"
                        className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-500"
                        onClick={() => editor.chain().focus().deleteTable().run()}
                    >
                        Удалить
                    </button>
                </div>
            )}

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="border rounded px-3 py-2 bg-white min-h-[200px] prose max-w-full overflow-auto"
            />
        </div>
    );
}
