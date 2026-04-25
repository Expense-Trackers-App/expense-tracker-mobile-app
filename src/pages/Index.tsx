import { Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Splash from "./Splash";

const Index = () => {
  const { user } = useApp();
  if (user) return <Navigate to="/home" replace />;
  return <Splash />;
};

export default Index;
