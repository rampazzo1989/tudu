import {ListViewModel} from '../../scenes/home/types';
import {DefaultHeaderProps} from '../default-header/types';

export type ListHeaderProps = Pick<
  DefaultHeaderProps,
  'onBackButtonPress' | 'Icon'
> & {
  listData?: ListViewModel;
  loading?: boolean;
};
