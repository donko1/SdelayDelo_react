import HomeRegistered from "@/components/home/HomeRegistered";
import HomeNotRegistered from "@components/home/HomeNotRegistered";
import { useUser } from "@context/UserContext";

export default function HomePage() {
  const { isRegistered } = useUser();

  if (!isRegistered) {
    return <HomeNotRegistered />;
  }

  return <HomeRegistered />;
}
