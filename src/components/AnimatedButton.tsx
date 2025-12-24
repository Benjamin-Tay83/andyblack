import React, { useRef } from "react";
import "./ButtonEffect.css";

interface AnimatedButtonProps {
  children?: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function createPolygon() {
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;
    const polygon = document.createElement("div");
    polygon.className = "polygon";
    polygon.style.left = `${Math.floor(xPos)}%`;
    polygon.style.top = `${Math.floor(yPos)}%`;
    polygon.style.position = "absolute";

    // Add visual styles
    polygon.style.width = "20px";
    polygon.style.height = "20px";
    polygon.style.background =
      "radial-gradient(circle, #FFD700 0%, #FFA500 100%)";
    polygon.style.borderRadius = "50%";
    polygon.style.transform = "translate(-50%, -50%)";
    polygon.style.opacity = "0";

    const bound = document.getElementById("animated-bound");
    if (bound) {
      bound.appendChild(polygon);
      console.log("inserted");

      // Start animation
      setTimeout(() => {
        polygon.style.opacity = "0.9";
        polygon.style.transform = "translate(-50%, -50%) scale(1.2)";
      }, 10);

      // Auto-remove after animation
      setTimeout(() => {
        if (polygon.parentNode) {
          polygon.remove();
          console.log("auto-deleted");
        }
      }, 1500);
    }
  }

  const handleMouseEnter = () => {
    console.log("enter");

    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Clear existing polygons
    const bound = document.getElementById("animated-bound");
    if (bound) {
      bound.innerHTML = "";
    }

    // Start new interval
    intervalRef.current = setInterval(createPolygon, 100);
  };

  const handleMouseLeave = () => {
    console.log("leave");

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("Interval cleared");
    }

    // Clear all polygons
    const bound = document.getElementById("animated-bound");
    if (bound) {
      bound.innerHTML = "";
    }
  };

  return (
    <div
      className="button-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Render children passed to the component */}
      {children}

      {/* Polygon container */}
      <div
        id="animated-bound"
        style={{
          position: "absolute",
          inset: "0",
          pointerEvents: "none",
          overflow: "hidden",
          borderRadius: "inherit",
          zIndex: 1,
        }}
      ></div>
    </div>
  );
};

export default AnimatedButton;
