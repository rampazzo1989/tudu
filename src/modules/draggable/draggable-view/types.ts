import {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  Keyframe,
} from 'react-native-reanimated';
import {DraggableItem} from '../draggable-context/types';

export type EntryExitAnimationType =
  | typeof BaseAnimationBuilder
  | BaseAnimationBuilder
  | EntryExitAnimationFunction
  | Keyframe
  | undefined;

export type DraggableViewProps<TItem> = {
  payload: DraggableItem<TItem>;
  children: React.ReactNode;
  isReceiver?: boolean;
  draggableEnabled?: boolean;
  draggableViewKey?: string;
};

export type UseDraggableViewHooksProps<T> = {
  payload: DraggableItem<T>;
  isReceiver?: boolean;
};
