"use client";

import {useEffect, useState} from "react";

export default function Page() {
  const [size, setSize] = useState({width: 0, height: 0});

  useEffect(() => {
    // Ustaw początkowy rozmiar
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Obsługa zmiany rozmiaru
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col mt-5 gap-3">
      <p>Screen width: {size.width}</p>
      <p>Screen height: {size.height}</p>
    </div>
  );
}
