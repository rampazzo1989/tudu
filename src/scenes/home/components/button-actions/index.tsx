import React, {
  forwardRef,
  memo,
  useCallback,
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

const HomeActionMenuOptions = memo(
  forwardRef<FloatingActionButtonRef, HomeActionMenuOptionsProps>(
    (props, ref) => {
      const [newListPopupVisible, setNewListPopupVisible] = useState(false);
      const [visible, setVisible] = useState(false);
      const [newCounterPopupVisible, setNewCounterPopupVisible] =
        useState(false);
      const parentRef = useRef<FloatingActionButtonRef>(null);
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
        setNewCounterPopupVisible(true);
        parentRef.current?.closeMenu();
      }, []);

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
        </>
      ) : undefined;
    },
  ),
);

export {HomeActionMenuOptions};
