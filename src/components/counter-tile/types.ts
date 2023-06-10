export type CounterTileProps = {
  title: string;
  value: number;
  format: 'general' | 'currency';
};

export type TileTitleProps = Pick<CounterTileProps, 'title'>;
