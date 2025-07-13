import { Animated } from "../core/Animated";

export const SlideUp = (props) => <Animated variant="slide-up" {...props} />;

export const SlideDown = (props) => (
  <Animated variant="slide-down" {...props} />
);

export const SlideLeft = (props) => (
  <Animated variant="slide-left" {...props} />
);

export const SlideRight = (props) => (
  <Animated variant="slide-right" {...props} />
);
