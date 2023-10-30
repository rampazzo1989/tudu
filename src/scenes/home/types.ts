import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';
import {ListIconType} from '../list/constants';

type HomePageProps = NativeStackScreenProps<StackNavigatorParamList, 'Home'>;

export type {HomePageProps};

export type TuduItem = {
  label: string;
  done: boolean;
  id: string;
};

export class TuduViewModel {
  listId: string;
  origin: ListOrigin;
  id: string;
  label: string;
  done: boolean;

  public mapBack() {
    const listModel: TuduItem = {
      id: this.id,
      done: this.done,
      label: this.label,
    };

    return listModel;
  }

  constructor(data: TuduItem, listId: string, origin: ListOrigin = 'default') {
    this.id = data.id;
    this.label = data.label;
    this.done = data.done;
    this.listId = listId;
    this.origin = origin;
  }
}

export type List = {
  label: string;
  numberOfActiveItems: number;
  id: string;
  tudus: Map<string, TuduItem>;
  color?: string;
  groupName?: string;
};

export type ListOrigin = 'archived' | 'default';

export class ListViewModel {
  origin: ListOrigin;
  id: string;
  label: string;
  numberOfActiveItems: number;
  tudus: TuduViewModel[];
  color?: string;
  groupName?: string;

  private getTuduViewModelsFromList = (list: List, origin: ListOrigin) => {
    const mappedTudus = [...list.tudus].map(
      ([_, tudu]) => new TuduViewModel(tudu, list.id, origin),
    );
    return mappedTudus;
  };

  mapBack() {
    const listModel: List = {
      id: this.id,
      label: this.label,
      numberOfActiveItems: this.numberOfActiveItems,
      color: this.color,
      groupName: this.groupName,
      tudus: new Map(this.tudus.map(x => [x.id, x.mapBack()])),
    };

    return listModel;
  }

  constructor(data: List, origin: ListOrigin = 'default') {
    this.id = data.id;
    this.label = data.label;
    this.numberOfActiveItems = data.numberOfActiveItems;
    this.color = data.color;
    this.groupName = data.groupName;
    this.tudus = this.getTuduViewModelsFromList(data, origin);
    this.origin = origin;
  }
}

type BuiltInListType = 'today' | 'all lists' | 'starred' | 'archived';

export type SmartList = {
  id: BuiltInListType;
  icon: ListIconType;
  isHighlighted: boolean;
  navigateToPage?: keyof StackNavigatorParamList;
  label: string;
};

export type ListGroup = {
  title: string;
  lists: List[];
};

export type Counter = {
  id: string;
  title: string;
  value: number;
  pace: number;
};

export class CounterViewModel {
  id: string;
  title: string;
  value: number;
  pace: number;

  mapBack() {
    const listModel: Counter = {
      id: this.id,
      title: this.title,
      value: this.value,
      pace: this.pace,
    };

    return listModel;
  }

  constructor(data: Counter) {
    this.id = data.id;
    this.title = data.title;
    this.value = data.value;
    this.pace = data.pace;
  }
}
