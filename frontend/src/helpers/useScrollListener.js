import { useState, useEffect, useRef } from "react";

const useScrollListener = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollElement = useRef(null);

  const listenToScroll = () => {
    const element = scrollElement.current;
    if (element) {
      if (window.scrollY > element.offsetTop) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, [isScrolling]);

  return { isScrolling, scrollElement };
};

export default useScrollListener;
