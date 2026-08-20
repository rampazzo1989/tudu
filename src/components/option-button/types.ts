import { ViewStyle } from "react-native";
import { AnimatedIconProps } from "../animated-icons/animated-icon/types";

export type OptionButtonProps = {
    Icon: React.FC<AnimatedIconProps>;
    label: string;
    onPress: () => void;
    autoAnimateIcon?: boolean;
    iconAnimationDelay?: number;
} & ViewStyle;