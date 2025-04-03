
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Puslapis nerastas</p>
        <p className="mb-8 max-w-lg mx-auto">
          Atsiprašome, bet jūsų ieškomas puslapis neegzistuoja. Jis galėjo būti perkeltas arba ištrintas.
        </p>
        <Link to="/">
          <Button className="button-primary">Grįžti į pagrindinį puslapį</Button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
