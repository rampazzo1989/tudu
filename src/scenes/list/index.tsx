import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {DraxProvider} from 'react-native-drax';
import {Page} from '../../components/page';
import {DraggablePageContent} from '../../components/draggable-page-content';
import {
  LinkedListViewModel,
  LinkedTuduViewModel,
  TuduItem,
} from '../home/types';
import {ListHeader} from './components/list-header';
import {ListPageProps} from './types';
import {TudusList} from './components/tudus-list';
import {DraggableContextProvider} from '../../modules/draggable/draggable-context';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {styles} from './styles';
import {CheersAnimation} from '../../components/animated-components/cheers';
import {
  AnimatedIconRef,
  ForwardedRefAnimatedIcon,
} from '../../components/animated-icons/animated-icon/types';
import {Dimensions, View} from 'react-native';
import {ListActionButton} from './components/list-action-button';
import {FloatingActionButtonRef} from '../../components/floating-action-button/types';
import {CheckMarkIconActionAnimation} from '../../components/animated-icons/check-mark';
import {NewTuduModal} from './components/new-tudu-modal';
import {useCloseCurrentlyOpenSwipeable} from '../../hooks/useCloseAllSwipeables';
import {useListService} from '../../service/list-service-hook';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId} = route.params;
  const actionButtonRef = useRef<FloatingActionButtonRef>(null);
  const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
  const [editingTudu, setEditingTudu] = useState<TuduItem>();

  const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

  const {getListById, saveList, saveTudu} = useListService();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list = useMemo(() => {
    return getListById(listId);
  }, [getListById, listId]);

  const draggableTudus = useMemo(() => {
    if (!list?.tudus) {
      return [];
    }
    return [...list.tudus].map(tudu => new DraggableItem([tudu])) ?? [];
  }, [list]);

  const setTudus = useCallback(
    (draggable: DraggableItem<LinkedTuduViewModel>[]) => {
      if (!list) {
        return;
      }

      const newTuduList = draggable.flatMap(x => x.data);
      const newList = new LinkedListViewModel(list.mapBack(), list.origin);
      newList.tudus = newTuduList;
      saveList(newList);
    },
    [list, saveList],
  );

  const handleListDragStart = useCallback(() => {
    RNReactNativeHapticFeedback.trigger('soft');
  }, []);

  const handleListCompleted = useCallback(() => {
    cheersRef.current?.play();
    RNReactNativeHapticFeedback.trigger('notificationSuccess');
    actionButtonRef.current?.animateThisIcon(CheckMarkIconActionAnimation);
  }, []);

  const handleTuduPress = useCallback(
    (tudu: LinkedTuduViewModel) => {
      if (!list) {
        return;
      }

      tudu.done = !tudu.done;

      saveTudu(tudu);

      const allDone = !!list.tudus
        ?.filter(x => x.id !== tudu.id)
        .every(x => x.done);
      if (allDone) {
        handleListCompleted();
      }
    },
    [handleListCompleted, list, saveTudu],
  );

  const animateThisIcon = useCallback((Icon: ForwardedRefAnimatedIcon) => {
    actionButtonRef.current?.animateThisIcon(Icon);
  }, []);

  const cheersRef = useRef<AnimatedIconRef>(null);

  return (
    <Page>
      <ListHeader listData={list} onBackButtonPress={handleBackButtonPress} />
      <DraxProvider>
        <DraggableContextProvider<TuduItem>
          data={draggableTudus}
          onSetData={setTudus}
          onDragStart={handleListDragStart}>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height,
              zIndex: 9999,
            }}>
            <CheersAnimation
              ref={cheersRef}
              speed={2}
              style={{
                width: Dimensions.get('screen').width,
                height: Dimensions.get('screen').height,
              }}
            />
          </View>

          <DraggablePageContent
            contentContainerStyle={styles.scrollContentContainer}>
            {!!list?.tudus && (
              <TudusList
                onTuduPress={handleTuduPress}
                animateIcon={animateThisIcon}
                onEditPress={tudu => {
                  setEditingTudu(tudu);
                  setNewTuduPopupVisible(true);
                }}
              />
            )}
          </DraggablePageContent>
          {/* <NewListModal
            visible={editModalVisible}
            editingList={editingList}
            onRequestClose={() => {
              setEditModalVisible(false);
              setEditingList(undefined);
              closeCurrentlyOpenSwipeable();
            }}
          /> */}
          <NewTuduModal
            visible={newTuduPopupVisible}
            onRequestClose={() => {
              setNewTuduPopupVisible(false);
              setEditingTudu(undefined);
              closeCurrentlyOpenSwipeable();
            }}
            editingTudu={editingTudu}
          />
          <ListActionButton
            ref={actionButtonRef}
            onInsertTuduPress={() => setNewTuduPopupVisible(true)}
          />
        </DraggableContextProvider>
      </DraxProvider>
    </Page>
  );
});

export {ListPage};
