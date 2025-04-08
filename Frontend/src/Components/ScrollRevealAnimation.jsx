import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ScrollAnimation = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("animated-element");
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setShow(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      id="animated-element"
      initial={{ opacity: 0, y: 50 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
