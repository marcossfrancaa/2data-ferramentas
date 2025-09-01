import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center container-responsive spacing-lg">
        <h1 className="title-h1 text-primary">404</h1>
        <p className="text-responsive-xl text-muted-foreground mb-6 px-4">Oops! Página não encontrada</p>
        <a href="/" className="text-primary hover:text-primary/80 underline text-responsive-base">
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
