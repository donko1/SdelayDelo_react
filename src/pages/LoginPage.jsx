import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import ArrowIcon from "@assets/arrow.svg?react";
import EyeIcon from "@assets/eye.svg?react";
import loading from "@assets/loading.gif";
import SubmitButton from "@components/ui/LoginButtonSubmit";
import useError from "@hooks/useError";

// TODO: Make russian language
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
  const { error, setError } = useError();
  const isRegistered = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [secretEmail, setSecretEmail] = useState("");
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resolvedEmail = isEmail(identifier)
        ? identifier
        : await fetchEmailByUsername(identifier);

      setEmail(resolvedEmail);

      isRegistered.current = await check_if_email_registered(resolvedEmail);

      if (isRegistered.current) {
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
      setStep("login");
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
    setIsLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [password, username, code, email, identifier]);

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
        <div className="relative flex justify-center w-[45vw] min-h-[645px] bg-white rounded-2xl shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black">
          <div className="mt-[43px] justify-center px-[40%]">
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="title-email"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-black text-4xl font-normal font-['Jockey_One']"
                >
                  Sdelay delo
                </motion.div>
              ) : (
                <motion.div
                  key="title-back"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-5 w-full items-center"
                >
                  <ArrowIcon
                    className="-rotate-90 w-8 h-8 cursor-pointer transition-all duration-300 hover:-translate-x-2"
                    preserveAspectRatio="none"
                    onClick={() => setStep("email")}
                  />
                  <h2 className="text-black text-2xl font-normal font-['Inter']">
                    {isRegistered.current ? `Welcome back!` : "Welcome to SD!"}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>

            {["unknown", "noUser"].includes(error.type) && (
              <div className="p-2 text-red-600 text-xl text-center mt-2 rounded">
                {error.text}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-[30px] relative"
                  onSubmit={handleEmailSubmit}
                >
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (step !== "email") setStep("email");
                    }}
                    placeholder="Email/username"
                    className="login-input"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute cursor-pointer w-9 h-9 rounded-full border border-zinc-600 right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    {!isLoading ? (
                      <div className="w-full h-full relative hover:bg-black rounded-full group/email-continue transition-all duration-300 ">
                        <div className="w-2.5 h-0 left-[22.38px] top-[17.05px] absolute origin-top-left rotate-[-138.93deg] outline outline-1 group-hover/email-continue:outline-white transition-all duration-300 outline-zinc-600"></div>
                        <div className="w-2.5 h-0 left-[22.18px] top-[16.71px] absolute origin-top-left rotate-[128.94deg] outline outline-1  group-hover/email-continue:outline-white transition-all duration-300 outline-zinc-600"></div>
                      </div>
                    ) : (
                      <div className="w-full h-full relative hover:bg-black rounded-full group/email-continue transition-all duration-300 ">
                        <img
                          className="w-full"
                          src={loading}
                          alt="loading..."
                        />
                      </div>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {step === "send_code" && (
                <motion.form
                  key="send_code-step"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCodeSubmit}
                  className="mt-[20px]"
                >
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code"
                    className={`login-input ${
                      error.type === "code" && "outline-[#ff1b1b]"
                    }`}
                    required
                  />
                  {error.type === "code" && (
                    <h2 className="text-red-400 text-xl font-normal font-['Inter']">
                      Incorrect code. Please try again
                    </h2>
                  )}

                  <div className="flex justify-center">
                    <SubmitButton disabled={isLoading} text="Submit code" />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {["login", "FA2"].includes(step) && (
                <motion.form
                  key={`login-step-${step}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-[20px]"
                  onSubmit={handleLogin}
                >
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className={`login-input pr-10 ${
                        error.type === "password" && "outline-[#ff1b1b]"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute group/eye right-3 top-1/2 transform -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                    >
                      <EyeIcon />
                      <div
                        className={`w-full transition-all duration-300 outline outline-black absolute top-1/2 ${
                          !showPassword
                            ? "outline-0 group-hover/eye:rotate-45 group-hover/eye:outline-2"
                            : "rotate-45 outline-2 pointer-events-none"
                        }`}
                      />
                      <div
                        className={`w-full transition-all duration-300 outline outline-black absolute top-1/2 ${
                          !showPassword
                            ? "outline-0 group-hover/eye:-rotate-45 group-hover/eye:outline-2"
                            : "-rotate-45 outline-2 pointer-events-none"
                        }`}
                      />
                    </button>
                  </div>

                  {error.type === "password" && (
                    <h2 className="text-red-400 text-xl font-normal font-['Inter']">
                      Incorrect password. Please try again
                    </h2>
                  )}
                  {step === "login" && (
                    <div className="mt-[18px]">
                      <h1
                        onClick={() => {
                          setStep("change_password");
                          if (!email) {
                            setEmail(fetchEmailByUsername(username));
                          }
                          sendVerificationCode(email);
                          setIsLoading(false);
                        }}
                        className="text-neutral-500 text-2xl font-light font-['Inter'] text-center cursor-pointer"
                      >
                        Forgot password?
                      </h1>
                      <div className="flex justify-center">
                        <SubmitButton disabled={isLoading} text="Sign in" />
                      </div>
                    </div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {step === "change_password" && (
                <motion.form
                  key="change_password-step"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleChangePassword}
                  className="mt-[20px]"
                >
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code"
                    className={`login-input ${
                      error.type === "code" && "outline-[#ff1b1b]"
                    }`}
                    required
                  />
                  {error.type === "code" && (
                    <h2 className="text-red-400 text-xl font-normal font-['Inter']">
                      Incorrect code. Please try again
                    </h2>
                  )}

                  <div className="relative mt-[20px]">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      className="login-input pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute group/eye right-3 top-1/2 transform -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                    >
                      <EyeIcon />

                      <div
                        className={`w-full transition-all duration-300 outline outline-black absolute top-1/2 ${
                          !showPassword
                            ? "outline-0 group-hover/eye:rotate-45 group-hover/eye:outline-2"
                            : "rotate-45 outline-2 pointer-events-none"
                        }`}
                      />
                      <div
                        className={`w-full transition-all duration-300 outline outline-black absolute top-1/2 ${
                          !showPassword
                            ? "outline-0 group-hover/eye:-rotate-45 group-hover/eye:outline-2"
                            : "-rotate-45 outline-2 pointer-events-none"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <SubmitButton disabled={isLoading} text="Reset password" />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {step === "FA2" && (
                <motion.form
                  key="fa2-step"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleFA2Submit}
                  className="mt-[20px]"
                >
                  {step === "FA2" && (
                    <div className=" text-yellow-600 text-xl mt-5 break-words mb-[20px]">
                      To continue enter the code sent to {secretEmail}
                    </div>
                  )}
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code"
                    className={`login-input ${
                      error.type === "code" && "outline-[#ff1b1b]"
                    }`}
                    required
                  />
                  {error.type === "code" && (
                    <h2 className="text-red-400 text-xl font-normal font-['Inter']">
                      Incorrect code. Please try again
                    </h2>
                  )}

                  <div className="flex justify-center">
                    <SubmitButton disabled={isLoading} text="Submit code" />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {step === "register" && (
                <motion.form
                  key="register-step"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleRegister}
                  className="mt-[20px]"
                >
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="login-input"
                    required
                  />

                  <div className="relative mt-[20px]">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="login-input pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute group/eye right-3 top-1/2 transform -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                    >
                      <EyeIcon />

                      <div
                        className={`w-full transition-all duration-300 outline outline-black absolute top-1/2 ${
                          !showPassword
                            ? "outline-0 group-hover/eye:rotate-45 group-hover/eye:outline-2"
                            : "rotate-45 outline-2 pointer-events-none"
                        }`}
                      />
                      <div
                        className={`w-full transition-all duration-300 outline outline-black absolute top-1/2 ${
                          !showPassword
                            ? "outline-0 group-hover/eye:-rotate-45 group-hover/eye:outline-2"
                            : "-rotate-45 outline-2 pointer-events-none"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <SubmitButton disabled={isLoading} text="Create account" />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <AuthFlow />;
}
