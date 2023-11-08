import {ListOrigin} from '../../scenes/home/types';

type StackNavigatorParamList = {
  Home: undefined;
  List: {listId: string; listOrigin?: ListOrigin};
  ScheduledList: {
    date: Date;
  };
  SplashScreen: undefined;
  Archived: undefined;
};

export type {StackNavigatorParamList};
