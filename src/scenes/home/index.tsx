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
import {DraggableItem} from '../../contexts/draggable-context/types';
import {generateRandomHash} from '../../hooks/useHashGenerator';

const mapListToDraggableItems = <T,>(list: T[], groupProperty: keyof T) => {
  const draggableList: DraggableItem<T>[] = [];

  for (const item of list) {
    if (!item) {
      console.log('UNDEFINED');
    }
    const groupId =
      item[groupProperty] === undefined
        ? undefined
        : String(item[groupProperty]);
    if (groupId) {
      const alreadyAdded = draggableList.find(x => x.groupId === groupId);
      if (alreadyAdded) {
        alreadyAdded.data = [...alreadyAdded.data, item];
      } else {
        draggableList.push(new DraggableItem<T>([item], groupId));
      }
    } else {
      draggableList.push(new DraggableItem<T>([item]));
    }
  }

  return draggableList;
};

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const counterList = useRecoilValue(counters);
  const {t} = useTranslation();

  const handleSetCustomLists = useCallback(
    (newOrderList: DraggableItem<List>[]) => {
      console.log({newOrderList});

      for (let itemIndex in newOrderList) {
        const item = newOrderList[itemIndex];
        if (item.groupId) {
          for (let subItemIndex in item.data) {
            item.data[subItemIndex] = {
              ...item.data[subItemIndex],
              groupName: item.groupId,
            };
          }
        } else {
          item.groupId = undefined;
          item.data[0].groupName = undefined;
        }
      }

      const flatList = newOrderList.flatMap(item => item.data);

      setCustomLists(flatList);
    },
    [setCustomLists],
  );

  const groupedCustomLists = useMemo(() => {
    return mapListToDraggableItems(
      customLists,
      'groupName',
    ) as DraggableItem<List>[];
  }, [customLists]);

  return (
    <Page>
      <HomeHeader />
      <PageContent>
        <DefaultLists lists={lists} />
        <SectionTitle title={t('sectionTitles.counters')} />
        <CountersList list={counterList} />
        <SectionTitle title={t('sectionTitles.myLists')} />
        <DraggableContextProvider<List>
          data={groupedCustomLists}
          onSetData={handleSetCustomLists}>
          {groupedCustomLists.map((item, index) => {
            if (item.groupId) {
              return (
                <DraggableView
                  key={`${item.groupId}${index}${item.data.length}`}
                  payload={item}
                  isReceiver>
                  <ListGroupCard groupTitle={item.groupId} items={item.data} />
                </DraggableView>
              );
            } else {
              const onlyItem = item.data[0];
              return (
                <DraggableView
                  key={generateRandomHash(`${onlyItem.label}${index}`)}
                  payload={item}>
                  <ListCard
                    Icon={ListDefaultIcon}
                    label={onlyItem.label}
                    numberOfActiveItems={onlyItem.numberOfActiveItems}
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
