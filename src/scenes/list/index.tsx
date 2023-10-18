import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
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

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId} = route.params;
  const actionButtonRef = useRef<FloatingActionButtonRef>(null);
  const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);

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

      // list.tudus = draggable.flatMap(x => x.data);
      const newList = {...list, tudus: draggable.flatMap(x => x.data)};
      console.log('setTudus called', newList);

      updateList(newList);
    },
    [list, updateList],
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
      console.log('holla before', tudu.done);

      const newTudu = {...tudu, done: !tudu.done};
      console.log('holla after', newTudu.done);
      const tuduIndex = list.tudus?.findIndex(x => x.id === newTudu.id);
      const newTuduList = list.tudus?.slice();

      if (tuduIndex === undefined || tuduIndex < 0 || !newTuduList) {
        return;
      }

      newTuduList.splice(tuduIndex, 1, newTudu);
      console.log('holla', newTudu.done, {tuduIndex, newTuduList});

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
              />
            )}
          </DraggablePageContent>
          <NewTuduModal
            visible={newTuduPopupVisible}
            onRequestClose={() => setNewTuduPopupVisible(false)}
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
