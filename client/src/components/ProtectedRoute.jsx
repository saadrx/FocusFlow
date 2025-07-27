
import { useEffect } from "react";
import { useLocation } from "wouter";
import { authService } from "@/lib/auth";

export default function ProtectedRoute({ children }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  if (!authService.isAuthenticated()) {
    return null;
  }

  return children;
}
