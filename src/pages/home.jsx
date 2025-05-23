import { getUser } from "../utils/auth";

function Home() {
    const isRegistered = getUser()
    return (
        <div>
            {isRegistered ? (
                <h1>Вы зарегистрированы</h1>
            ):(
                <h1>Вы не зарегистрированы</h1>
            )}
        </div>
    )
}

export default function HomePage() {
    return <Home/>;
}
