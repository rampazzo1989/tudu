import React, {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {MenuOption} from '../../../../components/menu-options/types';
import {HomeActionMenuOptionsProps} from './types';
import {FloatingActionButtonRef} from '../../../../components/floating-action-button/types';
import {PlusIcon} from '../../../../components/animated-icons/plus-icon';
import {FloatingActionButton} from '../../../../components/floating-action-button';
import {HashIcon} from '../../../../components/animated-icons/hash-icon';
import {NewListModal} from '../../../group/components/new-list-modal';
import {NewCounterModal} from '../../../counter/components/new-counter-modal';
import {useTranslation} from 'react-i18next';
import {NewGroupIcon} from '../../../../components/animated-icons/new-group-icon';
import {NewGroupModal} from '../../../group/components/new-group-modal';
import {DraggableContextType} from '../../../../modules/draggable/draggable-context/types';
import Toast from 'react-native-toast-message';
import {getUngroupedItems} from '../../../../modules/draggable/draggable-utils';
import {List} from '../../types';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';

const HomeActionMenuOptions = memo(
  forwardRef<FloatingActionButtonRef, HomeActionMenuOptionsProps>(
    (props, ref) => {
      const [newListPopupVisible, setNewListPopupVisible] = useState(false);
      const [visible, setVisible] = useState(false);
      const [newCounterPopupVisible, setNewCounterPopupVisible] =
        useState(false);
      const [newGroupPopupVisible, setNewGroupPopupVisible] = useState(false);
      const parentRef = useRef<FloatingActionButtonRef>(null);
      const draggableContext =
        useContext<DraggableContextType<List>>(DraggableContext);
      const {t} = useTranslation();

      const handleCreateNewList = useCallback(() => {
        setNewListPopupVisible(true);
        parentRef.current?.closeMenu();
      }, []);

      const handleCreateNewCounter = useCallback(() => {
        setNewCounterPopupVisible(true);
        parentRef.current?.closeMenu();
      }, []);

      const handleCreateNewGroup = useCallback(() => {
        const ungroupedLists = getUngroupedItems(draggableContext.data);
        const thereAreLists = !!draggableContext.data.length;
        if (!ungroupedLists.length) {
          parentRef.current?.closeMenu();
          return Toast.show({
            type: 'tuduWarning',
            text1: 'No ungrouped lists',
            text2: thereAreLists
              ? 'All your lists are grouped already'
              : '👉 Start creating some lists',
            position: 'bottom',
            bottomOffset: 60,
          });
        }
        setNewGroupPopupVisible(true);
        parentRef.current?.closeMenu();
      }, [draggableContext.data]);

      const options: MenuOption[] = [
        {
          Icon: ListDefaultIcon,
          label: t('actions.newList'),
          onPress: handleCreateNewList,
        },
        {
          Icon: NewGroupIcon,
          label: t('actions.newGroup'),
          onPress: handleCreateNewGroup,
        },
        {
          Icon: HashIcon,
          label: t('actions.newCounter'),
          onPress: handleCreateNewCounter,
        },
      ];

      useImperativeHandle(ref, () => ({
        animateThisIcon(Icon) {
          parentRef.current?.animateThisIcon(Icon);
        },
        closeMenu() {
          parentRef.current?.closeMenu();
        },
      }));

      useEffect(() => {
        setTimeout(() => setVisible(true), 700);
      }, []);

      return visible ? (
        <>
          <FloatingActionButton
            DefaultIcon={PlusIcon}
            ref={parentRef}
            animationMode="play"
            menuOptions={options}
          />
          <NewListModal
            visible={newListPopupVisible}
            onRequestClose={() => setNewListPopupVisible(false)}
          />
          <NewCounterModal
            visible={newCounterPopupVisible}
            onRequestClose={() => setNewCounterPopupVisible(false)}
          />
          <NewGroupModal
            visible={newGroupPopupVisible}
            onRequestClose={() => setNewGroupPopupVisible(false)}
          />
        </>
      ) : undefined;
    },
  ),
);

export {HomeActionMenuOptions};
