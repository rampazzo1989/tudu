import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';
import {ListIconType} from '../list/constants';

type HomePageProps = NativeStackScreenProps<StackNavigatorParamList, 'Home'>;

export type {HomePageProps};

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type Section = {
  id: string;
  title: string;
  order: number;
};

export type TuduItem = {
  id: string;
  label: string;
  done: boolean;
  dueDate?: Date;
  hasTime?: boolean;
  scheduledOrder?: number;
  starred?: boolean;
  recurrence?: RecurrenceType;
  sectionId?: string;
};

interface Clonable<T> {
  clone(): T;
}

export class TuduViewModel implements Clonable<TuduViewModel> {
  listId: string;
  origin: ListOrigin;
  id: string;
  label: string;
  done: boolean;
  dueDate?: Date;
  hasTime?: boolean;
  scheduledOrder?: number;
  listName?: string;
  starred?: boolean;
  recurrence?: RecurrenceType;
  sectionId?: string;

  public mapBack() {
    const listModel: TuduItem = {
      id: this.id,
      done: this.done,
      label: this.label,
      dueDate: this.dueDate,
      hasTime: this.hasTime,
      scheduledOrder: this.scheduledOrder,
      starred: this.starred,
      recurrence: this.recurrence,
      sectionId: this.sectionId,
    };

    return listModel;
  }

  public clone() {
    const newTudu = new TuduViewModel(
      this.mapBack(),
      this.listId,
      this.origin,
      this.listName,
    );

    return newTudu;
  }

  constructor(
    data: TuduItem,
    listId: string,
    origin: ListOrigin = 'default',
    listName?: string,
  ) {
    this.id = data.id;
    this.label = data.label;
    this.done = data.done;
    this.listId = listId;
    this.dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
    this.hasTime = data.hasTime;
    this.scheduledOrder = data.scheduledOrder;
    this.origin = origin;
    this.listName = listName;
    this.starred = data.starred;
    this.recurrence = data.recurrence;
    this.sectionId = data.sectionId;
  }
}

export type List = {
  label: string;
  id: string;
  color?: string;
  groupName?: string;
  sections?: Section[];
  orderingPrompt?: string;
};

export type ListOrigin = 'archived' | 'default' | 'unlisted';

export class ListViewModel implements Clonable<ListViewModel> {
  origin: ListOrigin;
  id: string;
  label: string;
  tudus: TuduViewModel[];
  color?: string;
  groupName?: string;
  sections?: Section[];
  orderingPrompt?: string;

  public getNumberOfActiveItems() {
    return this.tudus.filter(x => !x.done).length;
  }

  private getTuduViewModelsFromList = (
    list: List,
    origin: ListOrigin,
    tuduList?: Map<string, TuduItem>,
  ) => {
    if (!tuduList) {
      return [];
    }
    const mappedTudus = [...tuduList].map(
      ([_, tudu]) => new TuduViewModel(tudu, list.id, origin, list.label),
    );
    return mappedTudus;
  };

  public mapBackList() {
    const listModel: List = {
      id: this.id,
      label: this.label,
      color: this.color,
      groupName: this.groupName,
      sections: this.sections,
      orderingPrompt: this.orderingPrompt,
    };

    return listModel;
  }

  public mapBackTudus() {
    const tuduModelMap = new Map(this.tudus.map(x => [x.id, x.mapBack()]));

    return tuduModelMap;
  }

  public clone() {
    const newList = new ListViewModel(
      this.mapBackList(),
      undefined,
      this.origin,
    );
    newList.tudus = this.tudus
      ? this.tudus.map(t =>
          typeof t?.clone === 'function'
            ? t.clone()
            : new TuduViewModel(t, t.listId, t.origin, t.listName),
        )
      : [];
    return newList;
  }

  public static clone(list: ListViewModel): ListViewModel {
    if (!list) {
      return list;
    }
    if (typeof list.clone === 'function') {
      return list.clone();
    }
    const newList = new ListViewModel(
      {
        id: list.id || '',
        label: list.label || '',
        color: list.color,
        groupName: list.groupName,
        sections: list.sections ? [...list.sections] : undefined,
        orderingPrompt: list.orderingPrompt,
      },
      undefined,
      list.origin || 'default',
    );
    newList.tudus = list.tudus
      ? list.tudus.map(t =>
          typeof t?.clone === 'function'
            ? t.clone()
            : new TuduViewModel(t, t.listId, t.origin, t.listName),
        )
      : [];
    return newList;
  }

  constructor(
    data: List,
    tudus?: Map<string, TuduItem>,
    origin: ListOrigin = 'default',
  ) {
    this.id = data.id;
    this.label = data.label;
    this.color = data.color;
    this.groupName = data.groupName;
    this.sections = data.sections;
    this.orderingPrompt = data.orderingPrompt;
    this.tudus = this.getTuduViewModelsFromList(data, origin, tudus);
    this.origin = origin;
  }
}

export type ListDataViewModel = List & {
  numberOfActiveItems: number;
  origin: ListOrigin;
};

type BuiltInListType = 'today' | 'upcoming' | 'all' | 'starred' | 'archived';

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

export type TuduItemMap = Map<string, TuduItem>;

export type StateBackup = {
  origin: ListOrigin;
  tudusBkp: Map<string, TuduItemMap>;
  listBkp?: Map<string, List>;
};

export const cloneList = (list: ListViewModel): ListViewModel => {
  return ListViewModel.clone(list);
};

