import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {DraxProvider} from 'react-native-drax';
import {Page} from '../../components/page';
import {DraggablePageContent} from '../../components/draggable-page-content';
import {DraggableContextProvider} from '../../modules/draggable/draggable-context';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {CheersAnimation} from '../../components/animated-components/cheers';
import {
  AnimatedIconRef,
  ForwardedRefAnimatedIcon,
} from '../../components/animated-icons/animated-icon/types';
import {Dimensions} from 'react-native';
import {FloatingActionButtonRef} from '../../components/floating-action-button/types';
import {CheckMarkIconActionAnimation} from '../../components/animated-icons/check-mark';
import {useCloseCurrentlyOpenSwipeable} from '../../hooks/useCloseAllSwipeables';
import {useListService} from '../../service/list-service-hook/useListService';
import {CheersAnimationContainer, styles} from './styles';
import {NewTuduModal} from '../new-tudu-modal';
import {ListActionButton} from '../list-action-button';
import {TudusList} from '../tudus-list';
import {ListPageCoreProps} from './types';
import {TuduViewModel} from '../../scenes/home/types';
import {ListHeader} from '../list-header';

const ListPageCore: React.FC<ListPageCoreProps> = memo(
  ({setTudus, handleBackButtonPress, list}) => {
    const actionButtonRef = useRef<FloatingActionButtonRef>(null);
    const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
    const [editingTudu, setEditingTudu] = useState<TuduViewModel>();

    const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

    const {saveTudu} = useListService();

    const draggableTudus = useMemo(() => {
      if (!list?.tudus) {
        return [];
      }
      return [...list.tudus].map(tudu => new DraggableItem([tudu])) ?? [];
    }, [list]);

    const handleListDragStart = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('soft');
    }, []);

    const handleListCompleted = useCallback(() => {
      cheersRef.current?.play();
      RNReactNativeHapticFeedback.trigger('notificationSuccess');
      actionButtonRef.current?.animateThisIcon(CheckMarkIconActionAnimation);
    }, []);

    const handleTuduPress = useCallback(
      (tudu: TuduViewModel) => {
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
          <DraggableContextProvider<TuduViewModel>
            data={draggableTudus}
            onSetData={setTudus}
            onDragStart={handleListDragStart}>
            <CheersAnimationContainer pointerEvents="none">
              <CheersAnimation
                ref={cheersRef}
                speed={2}
                style={{
                  width: Dimensions.get('screen').width,
                  height: Dimensions.get('screen').height,
                }}
              />
            </CheersAnimationContainer>

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
  },
);

export {ListPageCore};
