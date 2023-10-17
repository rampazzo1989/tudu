import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {FloatingActionButtonRef} from '../../../../components/floating-action-button/types';
import {PlusIcon} from '../../../../components/animated-icons/plus-icon';
import {FloatingActionButton} from '../../../../components/floating-action-button';
import {ListActionButtonProps} from './types';

const ListActionButton = memo(
  forwardRef<FloatingActionButtonRef, ListActionButtonProps>((_, ref) => {
    const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const parentRef = useRef<FloatingActionButtonRef>(null);

    const handleCreateNewtudu = useCallback(() => {
      setNewTuduPopupVisible(true);
    }, []);

    useImperativeHandle(ref, () => ({
      animateThisIcon(Icon) {
        parentRef.current?.animateThisIcon(Icon);
      },
      closeMenu() {},
    }));

    useEffect(() => {
      setTimeout(() => setVisible(true), 500);
    }, []);

    return visible ? (
      <>
        <FloatingActionButton
          DefaultIcon={PlusIcon}
          ref={parentRef}
          animationMode="play"
          onPress={handleCreateNewtudu}
        />
        {/* <NewTuduModal
          visible={newTuduPopupVisible}
          onRequestClose={() => setNewTuduPopupVisible(false)}
        /> */}
      </>
    ) : undefined;
  }),
);

export {ListActionButton};
