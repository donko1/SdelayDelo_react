import { Animated } from "../core/Animated";

export const BounceIn = (props) => (
  <Animated
    variant="bounce"
    transition={{ type: "spring", bounce: 0.4 }}
    {...props}
  />
);

export const RotateIn = (props) => <Animated variant="spin-in" {...props} />;
