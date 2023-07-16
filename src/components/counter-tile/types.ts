export type CounterTileProps = {
  title: string;
  value: number;
  format: 'general' | 'currency';
};

export type TileTitleProps = Pick<CounterTileProps, 'title'>;

export type CounterValueProps = Pick<CounterTileProps, 'value' | 'format'>;

export type AdjustButtonProps = {
  onChangeButtonPress: () => void;
};

export type OptionsButtonProps = {
  onOptionsButtonPress: () => void;
};

export type ActionButtonProps = {
  onAction: () => void;
};
