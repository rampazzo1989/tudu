import { AnimatedIconProps } from "../animated-icons/animated-icon/types";

export type OptionTileProps = {
    Icon: React.FC<AnimatedIconProps>;
    label: string;
    onPress: () => void;
    autoAnimateIcon?: boolean;
    iconAnimationDelay?: number;
}