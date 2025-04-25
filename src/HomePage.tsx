import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import poster1 from "./assets/poster1.jpeg";
import poster2 from "./assets/poster2.jpeg";
import poster3 from "./assets/poster3.jpeg";
import poster4 from "./assets/poster4.jpeg";

interface Position {
  x: number;
  y: number;
}

const posters: string[] = [poster1, poster2, poster3, poster4];

const HomePage: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const moveCursor = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setPos({ x: clientX, y: clientY });

      if (cursorRef.current) {
        cursorRef.current.style.left = `${clientX}px`;
        cursorRef.current.style.top = `${clientY}px`;
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed w-5 h-5 rounded-full bg-white z-50 mix-blend-difference transition-all duration-100"
        style={{ transform: "translate(-50%, -50%)" }}
      ></div>

      <div className="absolute inset-0 bg-black bg-opacity-70 z-0 backdrop-blur-sm"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {posters.map((poster, index) => (
          <img
            key={index}
            src={poster}
            alt={`Poster ${index + 1}`}
            className="absolute w-60 h-80 object-cover rounded-xl opacity-40 hover:opacity-80 transition-all duration-500 shadow-lg"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-lg"
        >
          Login
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 z-10 text-center transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 drop-shadow-lg">
          Movie Explorer+
        </h1>
        <p className="mt-4 text-xl text-gray-300 tracking-wide font-medium">
          Dive into a world of cinema like never before.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
