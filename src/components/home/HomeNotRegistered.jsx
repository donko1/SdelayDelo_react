import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@context/UserContext";
import { useAuth } from "@context/AuthContext";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";
import { create_demo } from "@utils/api/auth";

export default function HomeNotRegistered() {
  const { userToken, logout, login } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(userToken != null);
  const { refreshUser } = useUser();
  const { lang } = useLang();

  return (
    // {!isAuthenticated && (
    //       <Link to="/login">{chooseTextByLang("Войти", "login", lang)}</Link>
    //     )}
    //     <Link to="/login" className="start-button">
    //   <button>{chooseTextByLang("Начать", "Get started", lang)}</button>
    // </Link>
    //     <button
    //   onClick={async () => {
    //     let token = await create_demo();
    //     login(token);
    //   }}
    // >
    //   {chooseTextByLang("Демо", "Demo", lang)}
    // </button>
    <div className="p-0 m-0 w-full h-full relative overflow-x-hidden">
      <div className="mx-[50px] overflow-hidden">
        <div className="mt-[34px] flex w-full justify-between">
          <span className="text-black text-4xl font-normal font-['Jockey_One']">
            Sdelay delo
          </span>
          <Link
            to="/login"
            data-property-1="Default"
            className="h-10 px-10 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2.5"
          >
            <div className="justify-start text-black text-xl font-normal font-['Inter']">
              Log in
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-[48px]">
          <img
            src="/images/home-not-registered/background-1.png"
            alt="background-1"
            className="max-w-[30%] h-auto"
          />
          <div className="h-full mx-4 flex-1">
            <h1 className="text-center text-black text-7xl font-bold font-['Inter']">
              A simple to do list
              <br />
              to manage it all
            </h1>
            <h2 className=" mt-[33px] text-center justify-start text-zinc-500 text-3xl font-normal font-['Inter']">
              Plan your day, manage tasks, and focus on the matters - all in one
              place
            </h2>
            <div className="flex justify-center items-center mt-[50px] gap-[28px]">
              <Link
                to="/login"
                className="px-12 py-3.5 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-start text-black text-3xl font-medium font-['Inter']">
                  Get started
                </div>
              </Link>
              <button
                onClick={async () => {
                  let token = await create_demo();
                  login(token);
                }}
                className="px-12 py-3.5 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-start text-black text-3xl font-medium font-['Inter']">
                  View demo
                </div>
              </button>
            </div>
          </div>
          <img
            src="/images/home-not-registered/background-2.png"
            alt="background-2"
            className="max-w-[30%] h-auto"
          />
        </div>
        <img
          src="/svg/home-not-registered/wave.svg"
          alt="wave"
          className="absolute w-full left-0 top-[100vh]"
        />
        <div className="mt-[500px]">
          <h1 className="text-black text-5xl font-bold font-['Inter']">
            Where we fit
          </h1>
        </div>
      </div>
    </div>
  );
}
