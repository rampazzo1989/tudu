import React, {useCallback, useState} from 'react';
import {DeleteIcon} from '../../../components/animated-icons/delete-icon';
import {PopupModal} from '../../../components/popup-modal';
import {deleteItem} from '../draggable-utils';
import {
  DraggableContextProviderProps,
  DraggableContextType,
  DraggableItem,
} from './types';

const DraggableContext = React.createContext({} as DraggableContextType<T>);

const DraggableContextProvider = <T,>({
  children,
  data,
  onSetData,
  onDragStart,
  onDragEnd,
}: DraggableContextProviderProps<T>) => {
  const [modal, setModal] = useState<{visible: boolean, action: 'delete' | 'archive'}>();
  const [dealingItem, setDealingItem] = useState<DraggableItem<T>>();
  const [confirmationPopupTitleBuilder, setConfirmationPopupTitleBuilder] =
    useState<(item?: DraggableItem<T>) => string>();

  const handleConfirmAction = useCallback(() => {
    deleteItem(data, onSetData, dealingItem);
    setModal(false);
  }, [data, onSetData, dealingItem]);

  const handleCancelAction = useCallback(() => {
    setDealingItem(undefined);
    setModal(false);
  }, []);

  const showConfirmationModal = useCallback(
    (
      itemToDealWith: DraggableItem<T>,
      titleBuilderFn: (item?: DraggableItem<T>) => string,
    ) => {
      setDealingItem(itemToDealWith);
      setConfirmationPopupTitleBuilder(() => titleBuilderFn);
      setModal(true);
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
        showDeleteConfirmationModal: showConfirmationModal,
      }}>
      {children}
      <PopupModal
        visible={modal?.visible}
        onRequestClose={() => setModal(undefined)}
        title={confirmationPopupTitleBuilder?.(dealingItem)}
        buttons={[
          {label: 'Yes', onPress: handleConfirmAction},
          {label: 'No', onPress: handleCancelAction},
        ]}
        Icon={DeleteIcon}
        shakeOnShow
        haptics
      />
    </DraggableContext.Provider>
  );
};

export {DraggableContext, DraggableContextProvider};
