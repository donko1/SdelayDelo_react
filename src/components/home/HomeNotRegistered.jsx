import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@context/UserContext";
import { useAuth } from "@context/AuthContext";
import { chooseTextByLang } from "@utils/helpers/locale";
import { FadeInLeft, FadeInRight, FadeInUp, SlideRight } from "@/animations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel, FreeMode } from "swiper/modules";
import { useLang } from "@context/LangContext";
import { create_demo } from "@utils/api/auth";
import VideoIcon from "@assets/video.svg?react";
import { ButtonNext, ButtonPrev } from "@components/ui/CustomButtonsSwiper";
import SliderOfReviews from "@components/ui/CustomSliderOfReviews";

export default function HomeNotRegistered() {
  const { userToken, logout, login } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(userToken != null);
  const { refreshUser } = useUser();
  const { lang } = useLang();

  const slides = [
    { id: 1, text: "Organize your\nstudy", img_style: "mx-[50px] my-[6px]" },
    {
      id: 2,
      text: "Take control of\nyour day",
      img_style: "my-[7px] ml-[83px] mr-[54px]",
      text_style: "top-[5px]",
    },
    {
      id: 3,
      text: "Plan join\nevents",
      img_style: "my-[8px] mx-[50px]",
      text_style: "top-[0px]",
    },
    {
      id: 4,
      text: "Boost your\nProductivity",
      img_style: "mx-[75px] my-[18px]",
      text_style: "ml-[40px]",
    },
    {
      id: 5,
      text: "Accelerate your\ngrowth",
      img_style: "mx-[60px] my-[9px]",
      text_style: "top-[10px]",
    },
    {
      id: 6,
      text: "Plan smarter, achieve\nfaster",
      img_style: "mx-[30px] my-[0px]",
      text_style: "top-[35px]",
    },
  ];
  const offers = [
    {
      id: 1,
      title: "Plan your week with calendar",
      text: "See your tasks organized by day and drag them around to fit your schedule.",
    },
    {
      id: 2,
      title: "Find anything instantly with Smart Search",
      text: "Just type a word, tag, or feeling — and boom, it’s there",
    },
    {
      id: 3,
      title: "Add structure with custom tags",
      text: "Color-coded and totally personal — keep your chaos in check",
    },
  ];

  return (
    <div className="p-0 m-0 w-full h-full relative overflow-x-hidden overflow-y-hidden bg-[#fcfcfc]">
      <div className="mt-[34px] flex mx-[50px] justify-between">
        <span className="text-black text-4xl font-normal font-['Jockey_One']">
          Sdelay delo
        </span>
        <Link
          to="/login"
          data-property-1="Default"
          className="h-10 px-10 py-3.5 group/navbar-login hover:bg-black transition-all duration-300 rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2.5"
        >
          <div className="justify-start group-hover/navbar-login:text-white duration-300 transition-all text-black text-xl font-normal font-['Inter']">
            Log in
          </div>
        </Link>
      </div>
      <div className="relative">
        <div className="flex items-center justify-between mt-[48px] mx-[50px]">
          <FadeInRight className="max-w-[30%] h-auto">
            <img
              src="/images/home-not-registered/background-1.png"
              alt="background-1"
              className=""
            />
          </FadeInRight>
          <FadeInUp className="h-full mx-4 flex-1">
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
                className="px-12 py-3.5 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black duration-300 transition-all group/get-started justify-center hover:bg-black hover:shadow-[0px_2px_10px_0px_rgba(151,71,255,1.00)] inline-flex items-center gap-2.5"
              >
                <div className="justify-start text-black text-3xl group-hover/get-started:text-white duration-300 transition-all font-medium font-['Inter'] ">
                  Get started
                </div>
              </Link>
              <button
                onClick={async () => {
                  let token = await create_demo();
                  login(token);
                }}
                className="px-12 py-3.5 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black  duration-300 transition-all group/login  hover:bg-black hover:shadow-[0px_2px_10px_0px_rgba(151,71,255,1.00)] inline-flex justify-center items-center gap-2.5"
              >
                <div className="justify-start text-black text-3xl group-hover/login:text-white duration-300 transition-all font-medium font-['Inter']">
                  View demo
                </div>
              </button>
            </div>
          </FadeInUp>
          <FadeInLeft className="max-w-[30%] h-auto">
            <img
              src="/images/home-not-registered/background-2.png"
              alt="background-2"
              className=""
            />
          </FadeInLeft>

          <img
            src="/svg/home-not-registered/wave.svg"
            alt="wave"
            className="absolute w-full left-0 bottom-[-192px]"
          />
        </div>
      </div>
      <div className="mt-[475px] relative">
        <div className="mx-[50px]">
          <SlideRight>
            <h1 className="text-black ml-[90px] text-5xl font-bold font-['Inter']">
              Where we fit
            </h1>
          </SlideRight>
          <Swiper
            modules={[Navigation, Autoplay, Mousewheel, FreeMode]}
            spaceBetween={70}
            slidesPerView={3}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            autoplay={{ delay: 10000 }}
            freeMode={{
              enabled: true,
              momentum: true,
              momentumBounce: false,
              momentumRatio: 0.5,
            }}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true,
            }}
            className="mt-[112px] relative !px-[90px] cursor-grab active:cursor-grabbing"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <FadeInUp
                  slideIndex={index}
                  className="bg-white flex justify-center items-center rounded-[57px] w-[500px] h-[500px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black"
                >
                  <h2
                    className={`justify-start text-center text-black text-4xl font-semibold font-['Inter'] mt-[25px] mx-[71px] absolute top-[20px] translate-0 ${slide.text_style}`}
                  >
                    {slide.text.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </h2>
                  <img
                    src={`/images/home-not-registered/swiper-${slide.id}.png`}
                    alt={`swiper-${slide.id}`}
                    className={slide.img_style}
                  />
                </FadeInUp>
              </SwiperSlide>
            ))}
            <ButtonNext isAbsolute={true} color="black" secondColor="white" />
            <ButtonPrev isAbsolute={true} color="black" secondColor="white" />
          </Swiper>
        </div>

        <img
          src="/svg/home-not-registered/wave.svg"
          alt="wave"
          className="absolute w-full left-0 bottom-[-300px]"
        />
      </div>
      <div className="mt-[475px] relative">
        <div className="mx-[50px]">
          <FadeInRight>
            <h1 className="text-black text-5xl ml-[90px] font-bold font-['Inter']">
              What we offer
            </h1>
          </FadeInRight>
          <div className="mt-[200px] flex justify-between items-center ml-[85px] gap-[284px]">
            <div>
              {offers.map((offer, index) => (
                <SlideRight
                  key={offer.id}
                  slideIndex={index}
                  stepDelay={0.1}
                  className={`group/offer pr-[35%] overflow-hidden bg-white relative rounded-[10px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] ${
                    index !== offers.length - 1 ? "mb-[55px]" : ""
                  }`}
                >
                  <div className="w-3 h-full transition-all duration-300 absolute left-[-100px] group-hover/offer:left-0  bg-blue-600"></div>
                  <div className="p-[40px] transition-all duration-300 group-hover/offer:pl-[52px]  group-hover/offer:pr-[28px]">
                    <h2 className="text-black text-3xl font-medium font-['Inter']">
                      {offer.title}
                    </h2>
                    <h3 className="justify-start mt-[10px] text-neutral-500 text-xl font-normal font-['Inter']">
                      {offer.text}
                    </h3>
                  </div>
                </SlideRight>
              ))}
            </div>
            <div className="w-[70%] outline outline-1 self-stretch rounded-xl flex justify-center items-center">
              <VideoIcon className="[&>*]:!fill-none" />
              {/* TODO: make a real video */}
            </div>
          </div>
        </div>
        <img
          src="/svg/home-not-registered/wave.svg"
          alt="wave"
          className="absolute w-full left-0 bottom-[-300px]"
        />
      </div>
      <div className="mt-[475px] relative">
        <FadeInRight>
          <h1 className="ml-[140px] text-black text-5xl font-bold font-['Inter'] mb-[100px]">
            Voices from our users
          </h1>
        </FadeInRight>
        <SliderOfReviews />
      </div>
    </div>
  );
}
