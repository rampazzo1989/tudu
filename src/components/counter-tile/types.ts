import {Counter} from '../../scenes/home/types';

export type CounterTileProps = {
  counterData: Counter;
};

export type TileTitleProps = Pick<Counter, 'title'>;

export type CounterValueProps = Pick<Counter, 'value'>;

export type AdjustButtonProps = {
  onChangeButtonPress: () => void;
};

export type OptionsButtonProps = {
  counterData: Counter;
  onEditOption: () => void;
  onDeleteOption: () => void;
};

export type ActionButtonProps = {
  onAction: () => void;
};
