import { getUser } from "../utils/auth";
import { generateGreetingByTime } from "../utils/interface";

function Header() {
    return (
        <div>
            <h1>{generateGreetingByTime()}</h1>
        </div>
    )
}

function Home() {
    const isRegistered = getUser()
    return (
        <div>
            {isRegistered ? (
                <Header/>
            ):(
                <h1>Вы не зарегистрированы</h1>
            )}
        </div>
    )
}

export default function HomePage() {
    return <Home/>;
}
