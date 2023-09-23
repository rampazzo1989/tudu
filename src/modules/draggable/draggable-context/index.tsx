import React, {useCallback, useState} from 'react';
import {DeleteIcon} from '../../../components/animated-icons/delete-icon';
import {FolderIcon} from '../../../components/animated-icons/folder-icon';
import {PopupModal} from '../../../components/popup-modal';
import {deleteItem} from '../draggable-utils';
import {
  DraggableContextProviderProps,
  DraggableContextType,
  DraggableItem,
} from './types';

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

  const handleConfirmAction = useCallback(() => {
    setModal(x => {
      if (x?.action === 'delete') {
        deleteItem(data, onSetData, dealingItem);
      } else {
        onCustomAction?.();
      }
      return undefined;
    });
  }, [data, onSetData, dealingItem, onCustomAction]);

  const handleCancelAction = useCallback(() => {
    setDealingItem(undefined);
    setModal(undefined);
    setOnModalCancel(x => {
      x?.();
      return undefined;
    });
  }, []);

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
        setData: onSetData,
        onDragStart,
        onDragEnd,
        showConfirmationModal,
      }}>
      {children}
      <PopupModal
        visible={!!modal?.visible}
        onRequestClose={() => setModal(undefined)}
        title={confirmationPopupTitleBuilder?.(dealingItem)}
        buttons={[
          {label: 'Yes', onPress: handleConfirmAction},
          {label: 'No', onPress: handleCancelAction},
        ]}
        Icon={modal?.action === 'delete' ? DeleteIcon : FolderIcon}
        shakeOnShow
        haptics
      />
    </DraggableContext.Provider>
  );
};

export {DraggableContext, DraggableContextProvider};
