import {DefaultHeaderProps} from '../../../../components/default-header/types';
import {ListViewModel} from '../../../home/types';

export type SearchHeaderProps = Pick<
  DefaultHeaderProps,
  'onBackButtonPress'
> & {
  onTextChange: (value: string) => void;
  listData?: ListViewModel;
};
