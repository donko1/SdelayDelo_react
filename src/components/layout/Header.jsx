import { useUser } from "@context/UserContext";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useEffect, useMemo, useState } from "react";
import allNotesIcon from "@assets/allNotes.svg?react";
import archiveIcon from "@assets/archive.svg?react";
import myDayIcon from "@assets/myDay.svg?react";
import nextWeekIcon from "@assets/nextWeek.svg?react";
import searchIcon from "@assets/search.svg?react";
import XIcon from "@assets/x.svg?react";
import calendarIcon from "@assets/calendar.svg?react";
import { useLang } from "@context/LangContext";
import AccountIcon from "@assets/Account.svg?react";
import SettingsIcon from "@assets/settings.svg?react";
import BackIcon from "@assets/send.svg?react";
import loading from "@assets/loading.gif";
import { useAuth } from "@/context/AuthContext";
import {
  changeLanguageUser,
  changeTimezoneUser,
  fetchAccountDataByUser,
  setFA2ByUser,
} from "@/utils/api/user";
import { useTimezone } from "@/context/TimezoneContext";
import EyeIcon from "@assets/eye.svg?react";
import { useEscapeKey } from "@/utils/hooks/useEscapeKey";
import {
  checkCode,
  resetPassword,
  sendVerificationCode,
} from "@/utils/api/login";
import useError from "@/utils/hooks/useError";
import { useToastHook } from "@/utils/hooks/useToast";
import { useTags } from "@/utils/hooks/useTags";

function ProfileHeader({ onClose, title }) {
  return (
    <div className="m-[10px] mt-0 ml-0 flex justify-center mb-[30px]">
      <BackIcon
        onClick={onClose}
        className="absolute cursor-pointer left-[10px] top-[10px] padding-[30px] rotate-180 [&>*]:!fill-none [shape-rendering:crispEdges] text-black flex"
      />
      <h1 className="text-zinc-600 text-xl font-medium font-['Inter']">
        {title}
      </h1>
    </div>
  );
}

function ProfileSettings({ onClose }) {
  const { username } = useUser();
  const [step, setStep] = useState("general");

  const [timezoneFilter, setTimezoneFilter] = useState("");
  const { showToast } = useToastHook();
  const [FA2, setFA2] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState();
  const [passwordSecond, setPasswordSecond] = useState();
  const [token, setToken] = useState();
  const [code, setCode] = useState();
  const [isChangingFA2, setIsChangingFA2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const { error, setError } = useError();

  const { lang, changeLanguage } = useLang();
  const { timezone, changeTimezone } = useTimezone();
  const { headers, logout } = useAuth();
  const { refreshUser } = useUser();

  const stepsTree = {
    general: ["settings", "account"],
    settings: ["timezone"],
    account: ["code"],
    code: ["reset"],
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAccountDataByUser(headers);
      const { email, FA2 } = data;
      setEmail(email);
      setFA2(FA2);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setError("");
  }, [code]);

  const checkPasswords = () => {
    if (password === passwordSecond) {
      return 1;
    }
    throw new Error("Password arent equal");
  };

  const isStepInHierarchy = (currentStep, targetStep) => {
    if (currentStep === targetStep) return true;

    let parent = Object.keys(stepsTree).find((parent) =>
      stepsTree[parent].includes(currentStep)
    );

    while (parent) {
      if (parent === targetStep) return true;
      parent = Object.keys(stepsTree).find((p) =>
        stepsTree[p]?.includes(parent)
      );
    }

    return false;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEscapeKey(() => {
    if (step !== "general") {
      const parent = Object.keys(stepsTree).find((parentStep) =>
        stepsTree[parentStep]?.includes(step)
      );
      setStep(parent || "general");
    } else {
      onClose();
    }
  });

  const handleToggleFA2 = async () => {
    if (!isChangingFA2) {
      setIsChangingFA2(true);
      const newValue = !FA2;

      try {
        await setFA2ByUser(headers, newValue);
        setFA2(newValue);
      } catch (error) {
        console.error("Ошибка при изменении FA2:", error);
        showToast(
          chooseTextByLang(
            "Произошла ошибка! Пожалуйста, повторите попытку",
            "Error occurred! Please try again ",
            lang
          ),
          "warning"
        );
      } finally {
        setIsChangingFA2(false);
      }
    }
  };

  const setLang = async (newLang) => {
    if (newLang !== lang) {
      try {
        await changeLanguageUser(headers, newLang);
        changeLanguage(newLang);
      } catch (e) {
        showToast(
          chooseTextByLang(
            "Произошла ошибка! Пожалуйста, повторите попытку",
            "Error occurred! Please try again ",
            lang
          ),
          "warning"
        );
      }
    }
  };

  const setTZ = async (newTZ) => {
    if (newTZ !== timezone) {
      try {
        await changeTimezoneUser(headers, newTZ);
        changeTimezone(newTZ);
      } catch (e) {
        showToast(
          chooseTextByLang(
            "Произошла ошибка! Пожалуйста, повторите попытку",
            "Error occurred! Please try again ",
            lang
          ),
          "warning"
        );
      }
    }
  };

  const mainTimezones = useMemo(
    () => [
      "Europe/Moscow",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "America/New_York",
      "America/Chicago",
      "America/Los_Angeles",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Dubai",
      "Australia/Sydney",
      "Pacific/Auckland",
      "UTC",
    ],
    []
  );

  const filteredTimezones = useMemo(() => {
    if (!timezoneFilter) return mainTimezones;
    const query = timezoneFilter.toLowerCase();
    return mainTimezones.filter((tz) => tz.toLowerCase().includes(query));
  }, [timezoneFilter, mainTimezones]);

  return (
    <div className="fixed min-w-[340px] min-h-[420px] top-0 left-0 p-[15px] rounded-br-[20px] shadow-2xl shadow-gray-500/20 bg-white">
      {step === "general" && (
        <>
          <h2
            className="pt-[35px] pl-[100px] p-[40px] text-xl font-bold font-['Inter'] text-black cursor-pointer"
            onClick={onClose}
          >
            {username}
          </h2>
          <div className="mt-[10px] px-[52px] flex flex-col items-center gap-5">
            <div
              onClick={() => setStep("account")}
              className="px-12 py-2 bg-white rounded-2xl shadow-[1px_4px_4px_0px_rgba(0,0,0,0.21),0px_-1px_4px_0px_rgba(0,0,0,0.05)] inline-flex justify-center items-center gap-2 cursor-pointer"
            >
              <AccountIcon />
              <span className="text-zinc-600 text-xl font-medium font-['Inter']">
                {chooseTextByLang("Аккаунт", "Account", lang)}
              </span>
            </div>

            <div
              onClick={() => setStep("settings")}
              className="px-12 py-2 bg-white rounded-2xl shadow-[1px_4px_4px_0px_rgba(0,0,0,0.21),0px_-1px_4px_0px_rgba(0,0,0,0.05)] inline-flex justify-center items-center gap-2 cursor-pointer"
            >
              <SettingsIcon className="w-[25px] h-[25px] text-black" />
              <span className="text-zinc-600 text-xl font-medium font-['Inter']">
                {chooseTextByLang("Настройки", "Settings", lang)}
              </span>
            </div>
          </div>

          <div className="mt-[30px] group/close text-center">
            <div
              className="px-7 py-1.5 group-hover/close:outline-red-500 transition-all duration-300 rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2.5 cursor-pointer"
              onClick={onClose}
            >
              <span className="text-zinc-400 group-hover/close:text-red-400 transition-all duration-300 text-lg font-medium font-['Inter']">
                {chooseTextByLang("Закрыть", "Close", lang)}
              </span>
              <XIcon
                color="black"
                className="rotate-45 transition-all duration-300 group-hover/close:rotate-[225deg] group-hover/close:text-red-500"
              />
            </div>
          </div>
        </>
      )}

      {isStepInHierarchy(step, "settings") && (
        <div className="mx-[30px]">
          <ProfileHeader
            onClose={() =>
              setStep(step === "settings" ? "general" : "settings")
            }
            title={"Settings"}
          />

          <div>
            <h1 className="text-black text-xl font-semibold font-['Inter']">
              {chooseTextByLang("Язык", "Language", lang)}
            </h1>
            <div className="flex max-w-[260px] justify-between items-center gap-[20px] w-full mt-[12px]">
              <button
                className={`px-[28px] py-1 ${
                  lang === "en"
                    ? "bg-zinc-950 text-stone-50 text-lg font-medium font-['Inter']"
                    : "text-zinc-400 text-lg font-medium font-['Inter']"
                } rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex`}
                onClick={async () => await setLang("en")}
              >
                English
              </button>
              <button
                className={`px-[28px] py-1 ${
                  lang === "ru"
                    ? "bg-zinc-950 text-stone-50 text-lg font-medium font-['Inter']"
                    : "text-zinc-400 text-lg font-medium font-['Inter']"
                } rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex`}
                onClick={async () => await setLang("ru")}
              >
                Русский
              </button>
            </div>
          </div>

          <h1 className="text-black text-xl font-semibold mt-[40px] font-['Inter']">
            {chooseTextByLang("Часовой пояс", "Time zone", lang)}
          </h1>

          {step === "timezone" ? (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Search timezone..."
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                value={timezoneFilter}
                onChange={(e) => setTimezoneFilter(e.target.value)}
                autoFocus
              />

              <div className="mt-2 max-h-[250px] overflow-y-auto border border-gray-200 rounded-lg">
                {filteredTimezones.map((tz) => (
                  <div
                    key={tz}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                      tz === timezone
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-neutral-600"
                    }`}
                    onClick={async () => {
                      await setTZ(tz);
                      setStep("settings");
                      setTimezoneFilter("");
                    }}
                  >
                    <div className="text-base font-['Inter'] font-normal">
                      {tz}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative mt-2">
              <button
                className="w-full bg-white rounded-[10px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] text-neutral-600 text-lg font-semibold font-['Inter'] flex justify-between items-center"
                onClick={() => setStep("timezone")}
              >
                <div className="mx-[10px] my-[6px] flex-1 text-left">
                  {timezone}
                </div>
                <div className="mx-2 w-4 h-4 flex items-center justify-center">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="#666"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {isStepInHierarchy(step, "account") && (
        <div className="mx-[35px]">
          <ProfileHeader
            onClose={() => setStep(step === "account" ? "general" : "account")}
            title={"Account"}
          />
          <h2 className="text-xl font-bold font-['Inter'] text-black cursor-pointer">
            {username}
          </h2>
          <div className="relative">
            <div className="my-[25px]">
              {step === "reset" && (
                <div className="bg-white w-full h-full absolute z-50">
                  <ProfileHeader title="" onClose={() => setStep("account")} />
                  <h1 className="mt-[50px] text-black text-lg font-semibold font-['Inter']">
                    {chooseTextByLang(
                      "Введите новый пароль",
                      "Enter new password",
                      lang
                    )}
                  </h1>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={chooseTextByLang(
                        "Новый пароль",
                        "New password",
                        lang
                      )}
                      className={`login-input px-[13px] py-[7px] pr-[50px] text-black/90 ${
                        error.type === "password" && "outline-[#ff1b1b]"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute group/eye right-[50px] top-1/2 transform -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                    >
                      <EyeIcon className="text-black" />
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
                  <h1 className="mt-[16px] text-black text-lg font-semibold font-['Inter']">
                    {chooseTextByLang(
                      "Повторите новый пароль",
                      "Repeat new password",
                      lang
                    )}
                  </h1>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordSecond}
                      onChange={(e) => setPasswordSecond(e.target.value)}
                      placeholder={chooseTextByLang(
                        "Новый пароль",
                        "New password",
                        lang
                      )}
                      className={`login-input px-[13px] py-[7px] w-full pr-[50px] text-black/90 ${
                        error.type === "password" && "outline-[#ff1b1b]"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute group/eye top-1/2 right-[50px] transform -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                    >
                      <EyeIcon className="text-black" />
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
                    <h2 className="text-red-400 text-sm font-normal font-['Inter']">
                      {error.text}
                    </h2>
                  )}

                  <div className="mt-[21px] flex justify-center">
                    <button
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          checkPasswords();
                          await resetPassword(token, password);
                        } catch (err) {
                          setError(err.message);
                          setIsLoading(false);
                          return;
                        }
                        showToast(
                          chooseTextByLang(
                            "Пароль сброшен!",
                            "Password reset!",
                            lang
                          ),
                          "success"
                        );
                        setStep("account");
                        setIsLoading(false);
                      }}
                      className="group/button-confirm relative px-[30px] py-[8px] rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex text-black text-xl font-normal font-['Inter'] cursor-pointer"
                    >
                      <span className="relative z-10 group-hover/button-confirm:text-white transition-colors duration-500">
                        {!isLoading ? (
                          chooseTextByLang("Подтвердить", "Confirm", lang)
                        ) : (
                          <img
                            className="w-8 mx-10"
                            src={loading}
                            alt="loading..."
                          />
                        )}
                      </span>
                      <div
                        className={`rounded-3xl absolute inset-0 w-0 bg-black group-hover/button-confirm:w-full ${
                          isLoading && "w-full"
                        } transition-all duration-500 z-0`}
                      ></div>
                    </button>
                  </div>
                </div>
              )}
              {step === "code" && (
                <div className="bg-white w-full h-full absolute z-50">
                  <ProfileHeader title="" onClose={() => setStep("account")} />

                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={chooseTextByLang("Код", "Code", lang)}
                    className={`login-input mt-[40px] px-[13px] py-[7px] pr-12 text-black/90 ${
                      error.type === "code" && "outline-[#ff1b1b]"
                    }`}
                    required
                  />
                  {error.type === "code" && (
                    <h2 className="text-red-400 text-xl font-normal font-['Inter']">
                      {chooseTextByLang(
                        "Код неверный. Пожалуйста, повторите попытку",
                        "Incorrect code. Please try again",
                        lang
                      )}
                    </h2>
                  )}
                  <div className="mt-[21px] flex justify-center">
                    <div className="flex justify-center">
                      <button
                        onClick={async () => {
                          try {
                            const { token: tkn } = await checkCode(email, code);
                            setToken(tkn);
                            setStep("reset");
                          } catch (err) {
                            setError(err.message);
                          }
                        }}
                        className="group/button-confirm relative px-[30px] py-[8px] rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex text-black text-xl font-normal font-['Inter'] cursor-pointer"
                      >
                        <span className="relative z-10 group-hover/button-confirm:text-white transition-colors duration-500">
                          {!isLoading ? (
                            chooseTextByLang("Подтвердить", "Confirm", lang)
                          ) : (
                            <img
                              className="w-8 mx-10"
                              src={loading}
                              alt="loading..."
                            />
                          )}
                        </span>
                        <div
                          className={`rounded-3xl absolute inset-0 w-0 bg-black group-hover/button-confirm:w-full ${
                            isLoading && "w-full"
                          } transition-all duration-500 z-0`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <h1 className="text-black text-xl font-semibold font-['Inter']">
                {chooseTextByLang("Почта", "Email", lang)}
              </h1>
              <h2 className="mt-[2px] text-zinc-950/80 text-xl font-normal font-['Inter']">
                {email}
              </h2>
            </div>
            <div className="my-[25px]">
              <h1 className="text-black text-xl font-semibold font-['Inter']">
                {chooseTextByLang("Пароль", "Password", lang)}
              </h1>
              <div className="relative">
                <h2
                  onClick={async () => {
                    if (!isLoading) {
                      setResetLoading(true);
                      await sendVerificationCode(email);
                      setStep("code");
                      setResetLoading(false);
                    }
                  }}
                  className="p-[10px] relative pl-0 text-zinc-950/50 text-base font-normal font-['Inter']"
                >
                  {chooseTextByLang("Сбросить пароль", "Reset password", lang)}
                </h2>
                {resetLoading && (
                  <div className="flex items-center justify-center absolute top-1/2 transform -translate-y-1/2 left-16">
                    <img className="w-10" src={loading} alt="loading..." />
                  </div>
                )}
              </div>
            </div>
            <div className="my-[25px]">
              <h1 className="text-black text-xl font-semibold font-['Inter']">
                {chooseTextByLang(
                  "Двухэтапная аутентификация",
                  "Two-step authentication",
                  lang
                )}
              </h1>
              <label className="inline-block cursor-pointer">
                <input
                  type="checkbox"
                  checked={FA2}
                  onChange={handleToggleFA2}
                  className="sr-only peer"
                />

                <div className="w-10 h-5 relative">
                  <div
                    className={`
      w-10 h-5 left-0 top-0 absolute rounded-[50px] transition-colors
      ${FA2 ? "bg-black" : "bg-gray-300 "}
    `}
                  />

                  <div
                    className={`
      w-4 h-4 absolute top-[2px] rounded-full bg-white transition-transform
      ${FA2 ? "translate-x-[22px]" : "translate-x-[2px]"}
    `}
                  />
                  <img
                    className={`h-full absolute left-0 ${
                      FA2 ? "translate-x-[20px]" : "translate-x-[2px]"
                    } ${!isChangingFA2 && "opacity-0"}`}
                    src={loading}
                    alt="loading..."
                  />
                </div>
              </label>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setIsLoading(true);
                  logout();
                  refreshUser();
                }}
                className="group/button-logout relative px-[30px] py-[8px] rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex text-black text-xl font-normal font-['Inter'] cursor-pointer"
              >
                <span className="relative z-10 group-hover/button-logout:text-white transition-colors duration-500">
                  {!isLoading ? (
                    chooseTextByLang("Выйти", "Log out", lang)
                  ) : (
                    <img className="w-8 mx-10" src={loading} alt="loading..." />
                  )}
                </span>
                <div
                  className={`rounded-3xl absolute inset-0 w-0 bg-black group-hover/button-logout:w-full ${
                    isLoading && "w-full"
                  } transition-all duration-500 z-0`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Header({
  activeElem,
  setAct,
  setOpenArchived,
  setOpenSearch,
  openForm,
}) {
  const { username } = useUser();
  const { lang } = useLang();
  const { tags } = useTags();
  const [ProfileSettingsOpened, setProfileSettingsOpened] = useState(false);
  const [tagsOpened, setTagsOpened] = useState(false);

  const dataForElems = [
    {
      id: "addNote",
      text: chooseTextByLang("Добавить заметку", "Add note", lang),
      icon: XIcon,
    },
    {
      id: "search",
      text: chooseTextByLang("Поиск", "Search", lang),
      icon: searchIcon,
    },
    {
      id: "myDay",
      text: chooseTextByLang("Входящие", "Inbox", lang),
      icon: myDayIcon,
    },
    {
      id: "next7Days",
      text: chooseTextByLang("Следующие 7 дней", "Next 7 days", lang),
      icon: nextWeekIcon,
    },
    {
      id: "allNotes",
      text: chooseTextByLang("Все мои заметки", "All my notes", lang),
      icon: allNotesIcon,
    },
    {
      id: "Calendar",
      text: chooseTextByLang("Календарь", "Calendar", lang),
      icon: calendarIcon,
    },
    {
      id: "archive",
      text: chooseTextByLang("Архив", "Archive", lang),
      icon: archiveIcon,
    },
    {
      id: "myTags",
      text: chooseTextByLang("Мои тэги", "My tags", lang),
    },
  ];

  return (
    <div>
      {ProfileSettingsOpened && (
        <ProfileSettings onClose={() => setProfileSettingsOpened(false)} />
      )}
      <div className="flex flex-col bg-transparent text-white min-w-[270px]">
        <div
          className="h-24 flex items-center justify-center cursor-pointer"
          onClick={() => setProfileSettingsOpened(!ProfileSettingsOpened)}
        >
          <h1 className="justify-start text-stone-50 text-xl font-bold font-['Inter']">
            {username}
          </h1>
        </div>
        {dataForElems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer my-[30px] ml-[20px] flex items-center"
            onClick={() => {
              if (item.id === "addNote") {
                openForm(true);
              } else if (item.id === "archive") {
                setOpenArchived(true);
              } else if (item.id === "myTags") {
                setTagsOpened(!tagsOpened);
              } else if (item.id === "search") {
                setOpenSearch(true);
              } else {
                setAct(item.id);
              }
            }}
          >
            {item.icon && (
              <item.icon
                className={`mr-[16px] max-w-[40px] max-h-[40px] group-hover:scale-125 transition-all duration-300 ${
                  item.id === "archive" || item.id === "next7Days"
                    ? "block [&>*]:!fill-none"
                    : ""
                } ${
                  item.id === "addNote"
                    ? "group-hover:bg-white group-hover:text-black group-hover:rounded-full"
                    : ""
                }`}
                style={
                  item.id !== "addNote"
                    ? {
                        color: activeElem === item.id ? "#191212" : "white",
                        ...((item.id === "archive" ||
                          item.id === "next7Days" ||
                          item.id === "addNote") && {
                          shapeRendering: "crispEdges",
                          overflow: "visible",
                        }),
                      }
                    : {}
                }
              />
            )}

            <span
              className="justify-start group-hover:FAF9F9 transition-all duration-300 text-stone-50 text-[21px] group-hover:text-[25px] hover:font-weight:800 font-bold font-['Inter']"
              style={{ color: activeElem === item.id ? "#191212" : "white" }}
            >
              {item.text}
            </span>
          </div>
        ))}
        {tagsOpened && (
          // tags.map((item) => (
          //   <div key={item.id} className="h-12 w-full cursor-pointer">
          //     <span className="text-[25px] text-left block pl-4">
          //       #{item.title}
          //     </span>
          //   </div>
          // ))
          <h1 className="h-12 w-full text-[25px] ">
            {chooseTextByLang(
              "Данная функция в разработке...",
              "This feature in development",
              lang
            )}
          </h1>
        )}
      </div>
    </div>
  );
}

export default Header;
