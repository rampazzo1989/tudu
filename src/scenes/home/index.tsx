import React, {useCallback, useMemo, useRef, useState} from 'react';
import {HomePageProps, List, ListGroup} from './types';
import {PageContent} from '../../components/page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilState, useRecoilValue} from 'recoil';
import {counters, homeDefaultLists, myLists} from './state';
import {HomeHeader} from './components/home-header';
import {useTranslation} from 'react-i18next';
import {SectionTitle} from './styles';
import {CountersList} from './components/counters-list';
import {ListCard} from '../../components/list-card';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {DraggableView} from '../../components/draggable-view';
import {DraggableContextProvider} from '../../contexts/draggable-context';
import {ListGroupCard} from './components/list-group-card';

export function getColor(i: number, numItems: number) {
  const multiplier = 255 / (numItems - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

export const getRandColorVal = () => Math.floor(Math.random() * 255);

export const mapIndexToData = (d: any, index: number, arr: any[]) => {
  const backgroundColor = getColor(index, arr.length);
  return {
    text: `${index}`,
    key: `key-${backgroundColor}`,
    backgroundColor,
  };
};

type Item = ReturnType<typeof mapIndexToData>;

// type DraxItemType<T> = {

// };

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const counterList = useRecoilValue(counters);
  const {t} = useTranslation();

  const [customListsAndGroups, setCustomListsAndGroups] = useState([
    ...customLists.groups,
    ...customLists.ungroupedLists,
  ]);

  const isGroup = (item: List | ListGroup): item is ListGroup => {
    return (item as ListGroup).title !== undefined;
  };

  const handleSetCustomLists = useCallback(
    (newOrderList: (List | ListGroup)[]) => {
      console.log({newOrderList});

      const allGroups = newOrderList.filter(item =>
        isGroup(item),
      ) as ListGroup[];

      newOrderList.forEach(item => {
        if (!isGroup(item)) {
          const list = item as List;
          allGroups.forEach(group => {
            const removedIndex = group.lists.indexOf(list);
            if (removedIndex === -1) {
              return;
            }
            const newGroupLists = group.lists.slice();
            newGroupLists.splice(removedIndex, 1);
            console.log({
              removedIndex,
              newGroupLists,
              thisItem: list.label,
              groupsCount: allGroups.length,
            });
            group.lists = newGroupLists;
          });
        }
      });

      const emptyGroups = newOrderList.filter(
        item => isGroup(item) && !item.lists.length,
      ) as ListGroup[];

      for (let i = 0; i < emptyGroups.length; i++) {
        const emptyGroupIndex = newOrderList.indexOf(emptyGroups[i]);
        newOrderList.splice(emptyGroupIndex, 1);
      }

      setCustomListsAndGroups(newOrderList);
    },
    [],
  );

  const handleAddToGroup = useCallback((group: ListGroup, item: List) => {
    const newLists = group?.lists.slice();
    newLists.push(item);
    group.lists = newLists;

    setCustomListsAndGroups(current => {
      const groupIndex = current.findIndex(
        x => isGroup(x) && x.title === group.title,
      );

      const newOrderList = current.slice();
      newOrderList.splice(groupIndex, 1, group);

      const itemIndexToRemove = newOrderList.indexOf(item);

      newOrderList.splice(itemIndexToRemove, 1);

      console.log('handleAddToGroup', {newOrderList});
      return newOrderList;
    });
  }, []);

  return (
    <Page>
      <HomeHeader />
      <PageContent>
        <DefaultLists lists={lists} />
        <SectionTitle title={t('sectionTitles.counters')} />
        <CountersList list={counterList} />
        <SectionTitle title={t('sectionTitles.myLists')} />
        <DraggableContextProvider
          data={customListsAndGroups}
          onSetData={handleSetCustomLists}
          onItemReceiving={handleAddToGroup}>
          {customListsAndGroups.map((item, index) => {
            if (isGroup(item)) {
              return (
                <DraggableView
                  key={`${item.title}${index}${item.lists.length}`}
                  payload={item}
                  isReceiver>
                  <ListGroupCard group={item} />
                </DraggableView>
              );
            } else {
              return (
                <DraggableView key={`${item.label}${index}`} payload={item}>
                  <ListCard
                    Icon={ListDefaultIcon}
                    label={item.label}
                    numberOfActiveItems={item.numberOfActiveItems}
                    key={item.label}
                  />
                </DraggableView>
              );
            }
          })}
        </DraggableContextProvider>
      </PageContent>
    </Page>
  );
};

export {HomePage};
