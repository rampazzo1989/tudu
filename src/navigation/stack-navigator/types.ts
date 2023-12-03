import {ListOrigin, ListViewModel} from '../../scenes/home/types';

type StackNavigatorParamList = {
  Home: undefined;
  List: {listData: ListViewModel; listOrigin?: ListOrigin};
  ScheduledList: {
    date: Date;
  };
  SplashScreen: undefined;
  Archived: undefined;
  AllTudus: undefined;
};

export type {StackNavigatorParamList};
