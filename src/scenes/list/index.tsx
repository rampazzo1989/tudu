import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {DraxProvider} from 'react-native-drax';
import {Page} from '../../components/page';
import {DraggablePageContent} from '../../components/draggable-page-content';
import {LinkedListItem, LinkedTuduItem, TuduItem} from '../home/types';
import {ListHeader} from './components/list-header';
import {ListPageProps} from './types';
import {TudusList} from './components/tudus-list';
import {DraggableContextProvider} from '../../modules/draggable/draggable-context';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListStateHelper} from '../../hooks/useListStateHelper';
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

  const {getListById, saveList} = useListService();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list = useMemo(() => {
    return getListById(listId);
  }, [getListById, listId]);

  const draggableTudus = useMemo(() => {
    const tuduList = list?.data.tudus;
    if (!tuduList) {
      return [];
    }
    return [...tuduList].map(tudu => new DraggableItem([tudu])) ?? [];
  }, [list?.data.tudus]);

  const setTudus = useCallback(
    (draggable: DraggableItem<LinkedTuduItem>[]) => {
      if (!list) {
        return;
      }
      const newTuduMap = new Map<string, TuduItem>(
        draggable
          .flatMap(x => x.data)
          .map<[string, TuduItem]>(x => [x.data.id, x.data]),
      );
      const newList: LinkedListItem = {
        ...list,
        data: {
          ...list.data,
          tudus: newTuduMap,
        },
      };
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
    (tudu: TuduItem) => {
      if (!list) {
        return;
      }

      const newTudu = {...tudu, done: !tudu.done};
      const tuduIndex = list.tudus?.findIndex(x => x.id === newTudu.id);
      const newTuduList = list.tudus?.slice();

      if (tuduIndex === undefined || tuduIndex < 0 || !newTuduList) {
        return;
      }

      newTuduList.splice(tuduIndex, 1, newTudu);

      const newList = {...list, tudus: newTuduList};

      updateList(newList);

      const allDone = !!newList.tudus?.every(x => x.done);
      if (allDone) {
        handleListCompleted();
      }
    },
    [handleListCompleted, list, updateList],
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
