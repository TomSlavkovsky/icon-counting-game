import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-game-yellow animate-bounce-in">404</h1>
        <p className="text-2xl text-foreground/80">Oops! Page not found</p>
        <Link to="/">
          <Button size="lg" className="mt-4">
            Return to Game
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
