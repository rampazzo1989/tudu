import React, {memo, useCallback, useMemo} from 'react';
import {DraxProvider} from 'react-native-drax';
import {Page} from '../../components/page';
import {DraggablePageContent} from '../../components/draggable-page-content';
import {TuduItem} from '../home/types';
import {ListHeader} from './components/list-header';
import {ListPageProps} from './types';
import {TudusList} from './components/tudus-list';
import {DraggableContextProvider} from '../../modules/draggable/draggable-context';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListStateHelper} from '../../hooks/useListStateHelper';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {styles} from './styles';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId} = route.params;

  const {updateList, getListById} = useListStateHelper();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list = useMemo(() => {
    return getListById(listId);
  }, [getListById, listId]);

  const draggableTudus = useMemo(() => {
    return list?.tudus?.map(tudu => new DraggableItem([tudu])) ?? [];
  }, [list?.tudus]);

  const setTudus = useCallback(
    (draggable: DraggableItem<TuduItem>[]) => {
      if (!list) {
        return;
      }

      list.tudus = draggable.flatMap(x => x.data);

      updateList(list);
    },
    [list, updateList],
  );

  const handleListDragStart = useCallback(() => {
    RNReactNativeHapticFeedback.trigger('soft');
  }, []);

  const handleTuduPress = useCallback(
    (tudu: TuduItem) => {
      if (!list) {
        return;
      }
      tudu.done = !tudu.done;
      console.log(tudu.done);
      updateList(list);
    },
    [list, updateList],
  );

  return (
    <Page>
      <ListHeader listData={list} onBackButtonPress={handleBackButtonPress} />
      <DraxProvider>
        <DraggableContextProvider<TuduItem>
          data={draggableTudus}
          onSetData={setTudus}
          onDragStart={handleListDragStart}>
          <DraggablePageContent
            contentContainerStyle={styles.scrollContentContainer}>
            {!!list?.tudus && <TudusList onTuduPress={handleTuduPress} />}
          </DraggablePageContent>
        </DraggableContextProvider>
      </DraxProvider>
    </Page>
  );
});

export {ListPage};
