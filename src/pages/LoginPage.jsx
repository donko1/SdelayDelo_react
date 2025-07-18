import React, { useState } from "react";
import {
  fetchEmailByUsername,
  sendVerificationCode,
  checkCode,
  loginUser,
  resetPassword,
  registerUser,
  updateUserInfo,
} from "@utils/api/login";
import { check_if_email_registered } from "@utils/api/auth";
import { useAuth } from "@context/AuthContext";
import { getUserLocaleInfo } from "@utils/helpers/locale";
import { useUser } from "@context/UserContext";
import { useNavigate } from "react-router-dom";

function AuthFlow() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secretEmail, setSecretEmail] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resolvedEmail = isEmail(identifier)
        ? identifier
        : await fetchEmailByUsername(identifier);

      setEmail(resolvedEmail);
      const isRegistered = await check_if_email_registered(resolvedEmail);

      if (isRegistered) {
        setStep("login");
      } else {
        await sendVerificationCode(resolvedEmail);
        setStep("send_code");
      }
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFA2Submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { token: tkn } = await checkCode(email, code);
      const data = await loginUser(email, password, tkn);
      login(data.access_token);
      refreshUser();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { token: newToken } = await checkCode(email, code);
      setToken(newToken);
      setStep("register");
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { token: tkn } = await checkCode(email, code);
      await resetPassword(tkn, password);
      setStep("");
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await loginUser(email, password);

      if (data.requires2FA) {
        setSecretEmail(data.email);
        setStep("FA2");
        return;
      }

      login(data.access_token);
      refreshUser();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await registerUser(email, username, password, token);

      try {
        const { language, timeZone } = getUserLocaleInfo();
        await updateUserInfo(data.access_token, language, timeZone);
      } catch (err) {
        console.error("Ошибка обновления данных:", err);
      }

      login(data.access_token);
      refreshUser();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="w-full flex h-full justify-between items-center overflow-hidden absolute">
        <img className="h-[100vh]" src="/svg/login/background-1.svg" alt="" />
        <img className="h-[100vh]" src="/svg/login/background-2.svg" alt="" />
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="relative flex justify-center max-w-[45vw] max-h-[60vh] bg-white rounded-2xl shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black">
          <div className="mt-[43px]  px-[15vw]">
            <div className="text-center text-black text-4xl font-normal font-['Jockey_One']">
              Sdelay delo
            </div>
            <form className="mt-[30px] relative" onSubmit={handleEmailSubmit}>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (step !== "email") setStep("email");
                }}
                placeholder="Email/username"
                className="placeholder:text-stone-400 text-2xl font-normal font-['Inter'] px-4 py-2.5 origin-top-left rounded-[20px] outline outline-1 outline-offset-[-1px] outline-black/90 inline-flex"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute cursor-pointer w-9 h-9 rounded-full border border-zinc-600 right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-full h-full relative ">
                  <div className="w-2.5 h-0 left-[22.38px] top-[17.05px] absolute origin-top-left rotate-[-138.93deg] outline outline-2 outline-offset-[-1px] outline-zinc-600"></div>
                  <div className="w-2.5 h-0 left-[22.18px] top-[16.71px] absolute origin-top-left rotate-[128.94deg] outline outline-2 outline-offset-[-1px] outline-zinc-600"></div>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Old functional(it will be deleted when new design will end)
// ###########################################################

// <div className="max-w-md mx-auto p-4 space-y-6">
//   <form onSubmit={handleEmailSubmit} className="space-y-4">
//     <div className="flex gap-2">
//       <input
//         type="text"
// value={identifier}
// onChange={(e) => {
//   setIdentifier(e.target.value);
//   if (step !== "email") setStep("email");
// }}
// placeholder="Email или username"
// className="flex-1 p-2 border rounded"
// required
//       />

//       <button
// type="submit"
// disabled={isLoading}
//         className="px-4 bg-blue-500 text-white rounded disabled:opacity-50"
//       >
//         →
//       </button>
//     </div>
//   </form>

//   {error && (
//     <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>
//   )}
//   {step === "FA2" && (
//     <div className="p-2 text-yellow-600 bg-red-100 rounded">
//       Для входа введите код, отправленный на {secretEmail}
//     </div>
//   )}

//   {(step === "login" || step === "FA2") && (
//     <form onSubmit={handleLogin} className="space-y-4">
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Пароль"
//         className="w-full p-2 border rounded"
//         required
//       />
//       {step === "login" && (
//         <>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50"
//           >
//             Войти
//           </button>
//           <button
//             onClick={() => {
//               setStep("change_password");
//               if (!email) {
//                 setEmail(fetchEmailByUsername(username));
//               }
//               sendVerificationCode(email);
//             }}
//             disabled={isLoading}
//             className="w-full p-2 bg-yellow-500 text-white rounded disabled:opacity-50"
//           >
//             Сбросить пароль
//           </button>
//         </>
//       )}
//     </form>
//   )}

//   {step === "change_password" && (
//     <form onSubmit={handleChangePassword} className="space-y-4">
//       <input
//         type="text"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         placeholder="Код из письма"
//         className="w-full p-2 border rounded"
//         required
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Новый пароль"
//         className="w-full p-2 border rounded"
//         required
//       />
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full p-2 bg-purple-500 text-white rounded disabled:opacity-50"
//       >
//         Сбросить пароль
//       </button>
//     </form>
//   )}

//   {step === "FA2" && (
//     <form onSubmit={handleFA2Submit} className="space-y-4">
//       <input
//         type="text"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         placeholder="Код из письма"
//         className="w-full p-2 border rounded"
//         required
//       />
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full p-2 bg-yellow-500 text-white rounded disabled:opacity-50"
//       >
//         Подтвердить код
//       </button>
//     </form>
//   )}

//   {step === "send_code" && (
//     <form onSubmit={handleCodeSubmit} className="space-y-4">
//       <input
//         type="text"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         placeholder="Код из письма"
//         className="w-full p-2 border rounded"
//         required
//       />
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full p-2 bg-yellow-500 text-white rounded disabled:opacity-50"
//       >
//         Подтвердить код
//       </button>
//     </form>
//   )}

//   {step === "register" && (
//     <form onSubmit={handleRegister} className="space-y-4">
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         placeholder="Имя пользователя"
//         className="w-full p-2 border rounded"
//         required
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Пароль"
//         className="w-full p-2 border rounded"
//         required
//       />
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full p-2 bg-purple-500 text-white rounded disabled:opacity-50"
//       >
//         Зарегистрироваться
//       </button>
//     </form>
//   )}
// </div>

export default function LoginPage() {
  return <AuthFlow />;
}
