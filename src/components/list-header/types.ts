import {DefaultHeaderProps} from '../../../../components/default-header/types';
import {ListViewModel} from '../../../home/types';

export type ListHeaderProps = Pick<DefaultHeaderProps, 'onBackButtonPress'> & {
  listData?: ListViewModel;
};
