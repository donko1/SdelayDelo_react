import { useState, useEffect, useRef } from "react";
import QuotesIcon from "@assets/quotes.svg?react";
import { useInView } from "react-intersection-observer";
import { ButtonNext, ButtonPrev } from "@components/ui/CustomButtonsSwiper";
import { useLang } from "@context/LangContext";
import { chooseTextByLang } from "@/utils/helpers/locale";

export default function SliderOfReviews() {
  const [sliderN, setSliderN] = useState(1);
  const { lang } = useLang();
  const [displayText, setDisplayText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [direction, setDirection] = useState("forward");
  const [canBeNext, setCanBeNext] = useState(true);
  const [canBePrev, setCanBePrev] = useState(false);
  const animationRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const slides = [
    {
      id: 1,
      text: chooseTextByLang(
        "Начал использовать теги для заметок — и это невероятно упростило поиск! Казалось бы, мелочь, но экономит кучу времени.",
        "I started using the tags feature to organize my notes, and wow — it makes everything so much easier to find. It’s such a small thing, but it saves me so much time",
        lang
      ),
      colorBG: "white-review",
      color: "black",
      secondColor: "white",
      authorNick: chooseTextByLang("Иван Смирнов", "Ben Smith", lang),
      AreQuotesTop: true,
    },
    {
      id: 2,
      text: chooseTextByLang(
        "Раньше не думал, что буду так часто использовать поиск, но теперь сайт без него — как без рук! Просто ввожу слово — и бац! Нужная задача сразу перед глазами. Незаменимо, когда заметок много!",
        "I didn’t think I’d use the search that much, but now I can’t imagine the site without it. I just type a word and boom — the task I was looking for pops up. Super handy when you have lots of notes.",
        lang
      ),
      colorBG: "black-review",
      color: "white",
      secondColor: "black",
      authorNick: chooseTextByLang("Степан Лунёв", "Justin Mathew", lang),
      AreQuotesTop: false,
    },
    {
      id: 3,
      text: chooseTextByLang(
        "Сайт невероятно интуитивный! Никаких инструкций не понадобилось — всё понятно с первого взгляда. Минималистичный дизайн без лишних деталей!",
        "I’ve tried a bunch of planners before, but the calendar here feels different. It’s not overwhelming, and it actually helps me plan without overthinking. I like that it looks clean but still shows everything I need",
        lang
      ),
      colorBG: "white-review",
      color: "black",
      secondColor: "white",
      authorNick: chooseTextByLang("Роман Степаненко", "Vin Donaldson", lang),
      AreQuotesTop: true,
    },
    {
      id: 4,
      text: chooseTextByLang(
        "Перепробовал кучу планировщиков, но ваш календарь — другое дело. Ничего лишнего, но всё необходимое под рукой. Просто и эффективно!",
        "The whole site just feels easy to use. I didn’t need a tutorial or anything — everything made sense from the start. It’s clean, not distracting, and somehow it makes me want to come back and keep using it",
        lang
      ),
      colorBG: "black-review",
      color: "white",
      secondColor: "black",
      authorNick: chooseTextByLang("Альберт Эйнштейн", "Mike Brown", lang),
      AreQuotesTop: false,
    },
  ];

  useEffect(() => {
    setCanBeNext(sliderN < slides.length);
    setCanBePrev(sliderN > 1);
  }, [sliderN]);

  useEffect(() => {
    if (!inView) return;

    if (displayText === "" && targetText === "") {
      const initialText = slides[sliderN - 1].text;
      setTargetText(initialText);

      let currentText = "";
      const duration = 500;
      const stepTime = Math.max(duration / initialText.length, 20);
      let stepCount = 0;

      const animateInitial = () => {
        if (stepCount < initialText.length) {
          currentText = initialText.substring(0, stepCount + 1);
          setDisplayText(currentText);
          stepCount++;
          animationRef.current = setTimeout(animateInitial, stepTime);
        } else {
        }
      };

      animateInitial();
      return;
    }

    clearTimeout(animationRef.current);

    const newText = slides[sliderN - 1].text;
    const oldLength = displayText.length;
    const newLength = newText.length;

    const isForward = newLength >= oldLength;
    setDirection(isForward ? "forward" : "backward");

    setTargetText(newText);
  }, [sliderN, inView]);

  useEffect(() => {
    if (!inView) return;

    clearTimeout(animationRef.current);

    let currentText = displayText;
    const targetLength = targetText.length;
    const currentLength = currentText.length;

    const duration = 500;
    const lengthDiff = Math.abs(targetLength - currentLength);
    const stepTime = Math.max(duration / lengthDiff, 20);

    const animate = () => {
      if (direction === "forward") {
        if (currentText.length < targetLength) {
          currentText = targetText.substring(0, currentText.length + 1);
          setDisplayText(currentText);
          animationRef.current = setTimeout(animate, stepTime);
        } else {
        }
      } else {
        if (currentText.length > targetLength) {
          currentText = currentText.substring(0, currentText.length - 1);
          setDisplayText(currentText);
          animationRef.current = setTimeout(animate, stepTime);
        } else {
          setDisplayText(targetText);
        }
      }
    };

    if (currentLength === targetLength) {
      setDisplayText(targetText);

      return;
    }

    animate();

    return () => clearTimeout(animationRef.current);
  }, [targetText, direction, inView]);

  return (
    <div ref={ref} className="w-full h-[900px] flex">
      <div className="w-[35%]">
        <img
          src={`/images/home-not-registered/review-${sliderN}.png`}
          alt="review image"
          className="w-full h-full"
        />
      </div>
      <div
        className={`w-[65%] px-[174px] py-[142px] flex flex-col justify-between transition-all duration-500 bg-${
          slides[sliderN - 1].colorBG
        }`}
      >
        <div>
          <div className="flex">
            <QuotesIcon
              className={`mr-[28px] ${
                slides[sliderN - 1].AreQuotesTop && "rotate-180"
              } transition-all duration-500 text-${slides[sliderN - 1].color}`}
            />
            <div
              className={`text-${
                slides[sliderN - 1].color
              } text-5xl font-semibold font-['Inter'] inline-block transition-all duration-500 relative`}
            >
              {displayText}
              <QuotesIcon
                className={`${
                  slides[sliderN - 1].AreQuotesTop && "rotate-180"
                } inline align-text-bottom absolute transition-all text-${
                  slides[sliderN - 1].color
                } duration-500 ml-[50px] -mb-[30px]`}
              />
            </div>
          </div>
          <div className="ml-[104px] flex gap-2 mt-[65px] items-center">
            <img
              src={`/images/home-not-registered/author-${sliderN}.png`}
              alt=""
            />
            <h3 className="text-zinc-600 text-5xl font-medium font-['Inter']">
              {slides[sliderN - 1].authorNick}
            </h3>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-[20px] items-center">
            <ButtonPrev
              onClick={() => setSliderN(sliderN - 1)}
              isAbsolute={false}
              color={slides[sliderN - 1].color}
              disabled={!canBePrev}
              secondColor={slides[sliderN - 1].secondColor}
            />
            {slides.map((el) => (
              <div
                key={el.id}
                className={`w-6 h-6 rounded-full outline outline-${
                  slides[sliderN - 1].color
                } outline-1 transition-all duration-300 cursor-pointer hover:bg-${
                  slides[sliderN - 1].color
                } ${
                  el.id === sliderN
                    ? `bg-${slides[sliderN - 1].color}`
                    : "bg-transparent"
                } `}
                onClick={() => setSliderN(el.id)}
              />
            ))}
            <ButtonNext
              onClick={() => setSliderN(sliderN + 1)}
              isAbsolute={false}
              color={slides[sliderN - 1].color}
              disabled={!canBeNext}
              secondColor={slides[sliderN - 1].secondColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
