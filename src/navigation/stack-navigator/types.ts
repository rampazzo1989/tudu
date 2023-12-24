import {ListOrigin} from '../../scenes/home/types';

type ListCommonProps = {
  numberOfUndoneTudus?: number;
};

type StackNavigatorParamList = {
  Home: undefined;
  List: {
    listId: string;
    title: string;
    listOrigin?: ListOrigin;
  } & ListCommonProps;
  ScheduledList: {
    date: Date;
  } & ListCommonProps;
  SplashScreen: undefined;
  Archived: undefined;
  AllTudus: ListCommonProps;
  StarredTudus: ListCommonProps;
};

export type {StackNavigatorParamList};
