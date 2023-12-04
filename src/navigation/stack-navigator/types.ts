import {ListOrigin} from '../../scenes/home/types';

type StackNavigatorParamList = {
  Home: undefined;
  List: {
    listId: string;
    title: string;
    listOrigin?: ListOrigin;
  };
  ScheduledList: {
    date: Date;
  };
  SplashScreen: undefined;
  Archived: undefined;
  AllTudus: undefined;
};

export type {StackNavigatorParamList};
