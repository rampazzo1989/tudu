import React, {useCallback, useRef, useState} from 'react';
import {DeleteIcon} from '../../../components/animated-icons/delete-icon';
import {FolderIcon} from '../../../components/animated-icons/folder-icon';
import {PopupModal} from '../../../components/popup-modal';
import {deleteItem, refreshListState} from '../draggable-utils';
import {
  DraggableContextProviderProps,
  DraggableContextType,
  DraggableItem,
} from './types';
import {useTranslation} from 'react-i18next';

const DraggableContext = React.createContext({} as DraggableContextType<T>);

type EmptyFnType = () => void;

const DraggableContextProvider = <T,>({
  children,
  data,
  onSetData,
  onDragStart,
  onDragEnd,
}: DraggableContextProviderProps<T>) => {
  const [modal, setModal] = useState<{
    visible: true;
    action: 'delete' | 'archive';
  }>();
  const [dealingItem, setDealingItem] = useState<DraggableItem<T> | T>();
  const [_, setOnModalCancel] = useState<EmptyFnType>();
  const [onCustomAction, setOnCustomAction] = useState<EmptyFnType>();
  const [confirmationPopupTitleBuilder, setConfirmationPopupTitleBuilder] =
    useState<(item?: DraggableItem<T> | T) => string>();
  const previousStateRef = useRef<DraggableItem<T>[]>();
  const {t} = useTranslation();

  const handleSetData = useCallback(
    (newData: DraggableItem<T>[], allowUndoThisSave?: boolean) => {
      previousStateRef.current = allowUndoThisSave ? [...data] : undefined;
      onSetData(newData);
    },
    [data, onSetData],
  );

  const handleConfirmAction = useCallback(() => {
    setModal(x => {
      if (x?.action === 'delete') {
        // deleteItem(data, newData => handleSetData(newData, true), dealingItem);
        previousStateRef.current = [...data];
        onCustomAction?.();
      } else {
        onCustomAction?.();
      }
      return undefined;
    });
  }, [data, onCustomAction]);

  const handleCancelAction = useCallback(() => {
    setDealingItem(undefined);
    setModal(undefined);
    setOnModalCancel(x => {
      x?.();
      return undefined;
    });
  }, []);

  const undoLastDeletion = useCallback(() => {
    if (!previousStateRef.current) {
      return;
    }
    refreshListState(previousStateRef.current, onSetData);
    previousStateRef.current = undefined;
  }, [onSetData]);

  const showConfirmationModal = useCallback(
    (
      itemToDealWith: DraggableItem<T> | T,
      titleBuilderFn: (item?: DraggableItem<T> | T) => string,
      action: 'delete' | 'archive',
      onCancel?: () => void,
      onAction?: () => void,
    ) => {
      setDealingItem(itemToDealWith);
      setConfirmationPopupTitleBuilder(() => titleBuilderFn);
      setModal({action, visible: true});
      setOnModalCancel(() => onCancel);
      setOnCustomAction(() => onAction);
    },
    [],
  );

  return (
    <DraggableContext.Provider
      value={{
        data,
        setData: handleSetData,
        onDragStart,
        onDragEnd,
        showConfirmationModal,
        undoLastDeletion,
      }}>
      {children}
      <PopupModal
        visible={!!modal?.visible}
        onRequestClose={handleCancelAction}
        title={confirmationPopupTitleBuilder?.(dealingItem)}
        buttons={[
          {label: t('buttons.yes'), onPress: handleConfirmAction},
          {label: t('buttons.no'), onPress: handleCancelAction},
        ]}
        Icon={modal?.action === 'delete' ? DeleteIcon : FolderIcon}
        shakeOnShow
        haptics
      />
    </DraggableContext.Provider>
  );
};

export {DraggableContext, DraggableContextProvider};
