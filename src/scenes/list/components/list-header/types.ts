import {DefaultHeaderProps} from '../../../../components/default-header/types';
import {BuiltInList, List} from '../../../home/types';

export type ListHeaderProps = Pick<DefaultHeaderProps, 'onBackButtonPress'> & {
  listData?: BuiltInList | List;
};
