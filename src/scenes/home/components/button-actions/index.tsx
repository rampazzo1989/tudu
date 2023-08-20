import React, {
  forwardRef,
  memo,
  useCallback,
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

const handleNewListPress = () => {
  console.log('Menu pressed');
};

const HomeActionMenuOptions = memo(
  forwardRef<FloatingActionButtonRef, HomeActionMenuOptionsProps>(
    ({onCreateNewList}, ref) => {
      const [newListPopupVisible, setNewListPopupVisible] = useState(false);
      const parentRef = useRef<FloatingActionButtonRef>(null);

      const handleCreateNewList = useCallback(() => {
        setNewListPopupVisible(true);
        parentRef.current?.closeMenu();
      }, []);

      const options: MenuOption[] = [
        {
          Icon: ListDefaultIcon,
          label: 'New list',
          onPress: handleCreateNewList,
        },
        {
          Icon: ListDefaultIcon,
          label: 'New group',
          onPress: handleNewListPress,
        },
        {
          Icon: HashIcon,
          label: 'New counter',
          onPress: handleNewListPress,
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

      return (
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
        </>
      );
    },
  ),
);

export {HomeActionMenuOptions};
