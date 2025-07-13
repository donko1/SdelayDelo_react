import { Animated } from "../core/Animated";

export const FadeIn = (props) => <Animated variant="fade" {...props} />;
export const FadeInUp = (props) => <Animated variant="fade-up" {...props} />;
export const FadeInDown = (props) => (
  <Animated variant="fade-down" {...props} />
);
export const FadeInLeft = (props) => (
  <Animated variant="fade-left" {...props} />
);
export const FadeInRight = (props) => (
  <Animated variant="fade-right" {...props} />
);
