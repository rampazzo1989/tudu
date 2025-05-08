import { AnimatedIconProps } from "../animated-icons/animated-icon/types";

export type OptionTileProps = {
    Icon: React.FC<AnimatedIconProps>;
    label: string;
    onPress: () => void;
    iconAnimationDelay?: number;
}