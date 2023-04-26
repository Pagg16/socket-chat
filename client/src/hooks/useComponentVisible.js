import { useState, useEffect, useRef } from "react";

export default function useComponentVisible(initialIsVisible) {
  const [isClickOut, setIsClickOut] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      return setIsClickOut(true);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isClickOut, setIsClickOut };
}
