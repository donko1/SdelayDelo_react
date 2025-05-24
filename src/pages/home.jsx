import { getUser } from "../utils/auth";
import { generateGreetingByTime } from "../utils/interface";

function Header() {
    return (
        <div>
        </div>
    )
}

function ContentNotes() {
    return (
        <div>
            <h1>{generateGreetingByTime()}</h1>
            <h1></h1>
        </div>
    )
}

function Home() {
    const isRegistered = getUser()
    return (
        <div>
            {isRegistered ? (
                <>
                    <Header/>
                    <ContentNotes/>
                </>
            ):(
                <h1>Вы не зарегистрированы</h1>
            )}
        </div>
    )
}

export default function HomePage() {
    return <Home/>;
}
