import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ANIMATION_VARIANTS = {
  // Fade
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  "fade-up": {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
  },
  // Slide
  "slide-up": {
    initial: { opacity: 0, y: 400 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -400 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 400 },
    animate: { opacity: 1, x: 0 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -400 },
    animate: { opacity: 1, x: 0 },
  },
  // Zoom
  "zoom-in": {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
  },
  "zoom-out": {
    initial: { opacity: 0, scale: 1.5 },
    animate: { opacity: 1, scale: 1 },
  },
  // Flip
  "flip-x": {
    initial: { opacity: 0, rotateX: 180 },
    animate: { opacity: 1, rotateX: 0 },
  },
  "flip-y": {
    initial: { opacity: 0, rotateY: 180 },
    animate: { opacity: 1, rotateY: 0 },
  },
  // Special
  bounce: {
    initial: { opacity: 0, y: 400 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 1.5,
      },
    },
  },
  "spin-in": {
    initial: { opacity: 0, rotate: -360, scale: 0 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
  },
};

export const Animated = ({
  children,
  variant = "fade",
  delay = 0.2,
  duration = 0.8,
  once = true,
  threshold = 0.8,
  className = "",
  slideIndex = 0,
  stepDelay = 0.3,
  ...rest
}) => {
  const animation = ANIMATION_VARIANTS[variant] || ANIMATION_VARIANTS.fade;
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const totalDelay = delay + slideIndex * stepDelay;

  return (
    <motion.div
      initial={animation.initial}
      ref={ref}
      animate={inView ? animation.animate : animation.initial}
      whileInView={animation.animate}
      viewport={{ once, margin: "0px 0px -100px 0px" }}
      transition={{
        delay: totalDelay,
        duration,
        ease: [0.16, 0.77, 0.47, 0.97],
        ...animation.animate?.transition,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
