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
  const [modal, setModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<DraggableItem<T>>();
  const [confirmationPopupTitleBuilder, setConfirmationPopupTitleBuilder] =
    useState<(item?: DraggableItem<T>) => string>();

  const handleConfirmDelete = useCallback(() => {
    deleteItem(data, onSetData, deletingItem);
    setModal(false);
  }, [data, onSetData, deletingItem]);

  const handleCancelDelete = useCallback(() => {
    setDeletingItem(undefined);
    setModal(false);
  }, []);

  const showDeleteConfirmationModal = useCallback(
    (
      itemToDelete: DraggableItem<T>,
      titleBuilderFn: (item?: DraggableItem<T>) => string,
    ) => {
      setDeletingItem(itemToDelete);
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
        showDeleteConfirmationModal,
      }}>
      {children}
      <PopupModal
        visible={modal}
        onRequestClose={() => setModal(false)}
        title={confirmationPopupTitleBuilder?.(deletingItem)}
        buttons={[
          {label: 'Sim', onPress: handleConfirmDelete},
          {label: 'Não', onPress: handleCancelDelete},
        ]}
        Icon={DeleteIcon}
        shakeOnShow
      />
    </DraggableContext.Provider>
  );
};

export {DraggableContext, DraggableContextProvider};
