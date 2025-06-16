import HomeNotRegistered from "../components/HomeNotRegistered";
import HomeRegistered from "../components/HomeRegistered";
import { useUser } from "../context/UserContext";

export default function HomePage() {
  const { isRegistered } = useUser();

  if (!isRegistered) {
    return <HomeNotRegistered />;
  }

  return <HomeRegistered />;
}
