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

  const customListsAndGroups = useMemo(() => {
    return [...customLists.groups, ...customLists.ungroupedLists];
  }, [customLists.groups, customLists.ungroupedLists]);

  const handleSetCustomLists = useCallback(
    (newOrderList: List[]) => {
      setCustomLists(x => ({...x, ungroupedLists: newOrderList}));
    },
    [setCustomLists],
  );

  const isGroup = (item: List | ListGroup): item is ListGroup => {
    return (item as ListGroup).title !== undefined;
  };

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
          onSetData={handleSetCustomLists}>
          {customListsAndGroups.map((item, index) => {
            if (isGroup(item)) {
              return (
                <DraggableView key={`${index}`} payload={item} isReceiver>
                  <ListGroupCard group={item} />
                </DraggableView>
              );
            } else {
              return (
                <DraggableView key={`${index}`} payload={item}>
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
