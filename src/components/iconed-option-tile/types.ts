import { AnimatedIconProps } from "../animated-icons/animated-icon/types";
import { BaseOptionTileProps } from "../option-tile/types";

export type IconedOptionTileProps = BaseOptionTileProps & {
    Icon: React.FC<AnimatedIconProps>;
    autoAnimateIcon?: boolean;
    iconAnimationDelay?: number;
}