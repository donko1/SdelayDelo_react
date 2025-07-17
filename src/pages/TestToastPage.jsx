import { useToast } from "@utils/hooks/useToast";
import { useState } from "react";

export default function TestToastsPage() {
  const { showToast, ToastContainer } = useToast();
  const [comments, setComments] = useState([]);
  const [counter, setCounter] = useState(1);

  const addComment = () => {
    const newComment = `Комментарий #${counter}`;
    showToast(`Добавлен комментарий: #${counter}`, "success", () => {
      setComments([...comments, newComment]);
    });
    setCounter(counter + 1);
  };

  const showRandomToast = () => {
    const types = ["info", "success", "error", "warning"];
    const messages = [
      "Это информационное сообщение",
      "Операция выполнена успешно!",
      "Произошла критическая ошибка!",
      "Внимание: требуется проверка",
    ];

    const randomIndex = Math.floor(Math.random() * types.length);
    showToast(messages[randomIndex], types[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            Демонстрация Toast-уведомлений
          </h1>
          <p className="text-lg text-indigo-700">
            Попробуйте разные типы уведомлений с функцией отмены действия
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Действия
            </h2>

            <div className="space-y-4">
              <button
                onClick={addComment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Добавить комментарий
              </button>

              <button
                onClick={() =>
                  showToast("Это информационное сообщение", "info")
                }
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-lg transition-all"
              >
                Показать Info Toast
              </button>

              <button
                onClick={() =>
                  showToast("Операция выполнена успешно!", "success")
                }
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-lg transition-all"
              >
                Показать Success Toast
              </button>

              <button
                onClick={() =>
                  showToast("Произошла критическая ошибка!", "error")
                }
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-lg transition-all"
              >
                Показать Error Toast
              </button>

              <button
                onClick={() =>
                  showToast("Внимание: требуется проверка", "warning")
                }
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-medium py-3 px-4 rounded-lg shadow hover:shadow-lg transition-all"
              >
                Показать Warning Toast
              </button>

              <button
                onClick={showRandomToast}
                className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-lg transition-all"
              >
                Случайное уведомление
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Добавленные комментарии
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {comments.length}
              </span>
            </div>

            {comments.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {comments.map((el, index) => (
                  <div
                    key={index}
                    className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg"
                  >
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700">{el}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-indigo-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-1">
                  Комментариев пока нет
                </h3>
                <p className="text-gray-500 text-sm">
                  Нажмите "Добавить комментарий" чтобы создать первый
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-3">
            Как это работает
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <span className="text-indigo-800 font-bold">1</span>
              </div>
              <p className="text-gray-700">
                Нажмите "Добавить комментарий" для создания элемента
              </p>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <span className="text-indigo-800 font-bold">2</span>
              </div>
              <p className="text-gray-700">Появится Toast с кнопкой "Undo"</p>
            </li>
            <li className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <span className="text-indigo-800 font-bold">3</span>
              </div>
              <p className="text-gray-700">
                Нажмите "Undo" чтобы отменить добавление
              </p>
            </li>
          </ul>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
