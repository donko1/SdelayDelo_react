import HomeRegistered from "@components/home/HomeRegistered";
import HomeNotRegistered from "@components/home/HomeNotRegistered";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <HomeNotRegistered />;
  }

  return <HomeRegistered />;
}
