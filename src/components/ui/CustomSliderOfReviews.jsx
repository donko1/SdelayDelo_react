import { useState, useEffect, useRef } from "react";
import QuotesIcon from "@assets/quotes.svg?react";
import { useInView } from "react-intersection-observer";
import { ButtonNext, ButtonPrev } from "@components/ui/CustomButtonsSwiper";

export default function SliderOfReviews() {
  const [sliderN, setSliderN] = useState(1);
  const [displayText, setDisplayText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("forward");
  const animationRef = useRef(null);
  const currentSlideRef = useRef(sliderN);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const slides = [
    {
      id: 1,
      text: "I started using the tags feature to organize my notes, and wow — it makes everything so much easier to find. It’s such a small thing, but it saves me so much time",
      colorBG: "white-review",
      color: "black",
      authorNick: "Ben Smith",
      AreQuotesTop: true,
    },
    {
      id: 2,
      text: "I didn’t think I’d use the search that much, but now I can’t imagine the site without it. I just type a word and boom — the task I was looking for pops up. Super handy when you have lots of notes.",
      colorBG: "black-review",
      color: "white",
      authorNick: "Justin Mathew",
      AreQuotesTop: false,
    },
    {
      id: 3,
      text: "I’ve tried a bunch of planners before, but the calendar here feels different. It’s not overwhelming, and it actually helps me plan without overthinking. I like that it looks clean but still shows everything I need",
      colorBG: "white-review",
      color: "black",
      authorNick: "Vin Donaldson",
      AreQuotesTop: true,
    },
    {
      id: 4,
      text: "The whole site just feels easy to use. I didn’t need a tutorial or anything — everything made sense from the start. It’s clean, not distracting, and somehow it makes me want to come back and keep using it",
      colorBG: "black-review",
      color: "white",
      authorNick: "Mike Brown",
      AreQuotesTop: false,
    },
  ];

  const handlePrev = () => {
    if (sliderN > 1) {
      setSliderN(sliderN - 1);
    }
    return 0;
  };
  const handleNext = () => {
    if (sliderN < slides.length) {
      setSliderN(sliderN + 1);
    }
    return 0;
  };

  useEffect(() => {
    if (!inView) return;

    if (displayText === "" && targetText === "") {
      const initialText = slides[sliderN - 1].text;
      setTargetText(initialText);
      setIsAnimating(true);

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
          setIsAnimating(false);
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
    setIsAnimating(true);
  }, [sliderN, inView]);

  useEffect(() => {
    if (!isAnimating || !inView) return;

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
          setIsAnimating(false);
        }
      } else {
        if (currentText.length > targetLength) {
          currentText = currentText.substring(0, currentText.length - 1);
          setDisplayText(currentText);
          animationRef.current = setTimeout(animate, stepTime);
        } else {
          setDisplayText(targetText);
          setIsAnimating(false);
        }
      }
    };

    if (currentLength === targetLength) {
      setDisplayText(targetText);
      setIsAnimating(false);
      return;
    }

    animate();

    return () => clearTimeout(animationRef.current);
  }, [targetText, isAnimating, direction, inView]);
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
              onClick={handlePrev}
              isAbsolute={false}
              color={slides[sliderN - 1].color}
              disabled={isAnimating}
            />
            {slides.map((el) => (
              <div
                key={el.id}
                className={`w-6 h-6 rounded-full outline outline-${
                  slides[sliderN - 1].color
                } outline-1 cursor-pointer ${
                  el.id === sliderN
                    ? `bg-${slides[sliderN - 1].color}`
                    : "bg-transparent"
                } ${isAnimating ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isAnimating && setSliderN(el.id)}
              />
            ))}
            <ButtonNext
              onClick={handleNext}
              isAbsolute={false}
              color={slides[sliderN - 1].color}
              disabled={isAnimating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
