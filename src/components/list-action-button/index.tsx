import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {FloatingActionButtonRef} from '../floating-action-button/types';
import {PlusIcon} from '../animated-icons/plus-icon';
import {FloatingActionButton} from '../floating-action-button';
import {ListActionButtonProps} from './types';

const ListActionButton = memo(
  forwardRef<FloatingActionButtonRef, ListActionButtonProps>(
    ({onInsertTuduPress}, ref) => {
      const [visible, setVisible] = useState(false);
      const parentRef = useRef<FloatingActionButtonRef>(null);

      useImperativeHandle(ref, () => ({
        animateThisIcon(Icon) {
          parentRef.current?.animateThisIcon(Icon);
        },
        closeMenu() {},
      }));

      useEffect(() => {
        setTimeout(() => setVisible(true), 100);
      }, []);

      return visible ? (
        <>
          <FloatingActionButton
            DefaultIcon={PlusIcon}
            ref={parentRef}
            animationMode="play"
            onPress={onInsertTuduPress}
          />
        </>
      ) : (
        <></>
      );
    },
  ),
);

export {ListActionButton};
