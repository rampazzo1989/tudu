import { MemoExoticComponent } from "react";
import { AnimatedIconProps, AnimatedIconRef } from "../animated-icon/types";

export type AnimatedEmojiIconProps = {
    emoji: string;
}

export type ForwardedRefAnimatedEmojiIcon = MemoExoticComponent<
  React.ForwardRefExoticComponent<
  AnimatedEmojiIconProps & React.RefAttributes<AnimatedIconRef>
  >
>;