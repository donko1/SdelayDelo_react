export default function TitleForBlock({text}) {
    return (
        <div className="rounded-r-[3px] bg-black inline-block relative">
            <div className="absolute slice w-[10px] rounded-tl-[3px] h-full"/>
            <div className="py-[9px] pr-[38px] pl-[40px] justify-start text-white text-4xl font-semibold font-['Inter']">{text}</div>
        </div>
    )
}