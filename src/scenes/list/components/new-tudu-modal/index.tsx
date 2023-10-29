import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {PopupModal} from '../../../../components/popup-modal';
import {PopupButton} from '../../../../components/popup-modal/types';
import {TuduViewModel} from '../../../home/types';
import {CheckMarkIcon} from '../../../../components/animated-icons/check-mark';
import {Input} from './styles';
import {NewTuduModalProps} from './types';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {
  DraggableContextType,
  DraggableItem,
} from '../../../../modules/draggable/draggable-context/types';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';

const getNewEmptyTudu = () =>
  new TuduViewModel(
    {
      label: '',
      done: false,
      id: generateRandomHash('New Tudu'),
    },
    '',
    'default',
  );

const NewTuduModal: React.FC<NewTuduModalProps> = memo(
  ({visible, editingTudu, onRequestClose}) => {
    const [internalTuduData, setInternalTuduData] = useState<TuduViewModel>(
      editingTudu ?? getNewEmptyTudu(),
    );

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const handleTextChange = useCallback((text: string) => {
      setInternalTuduData(x => {
        x.label = text;
        return x;
      });
    }, []);

    const isEditing = useMemo(() => !!editingTudu, [editingTudu]);

    const draggableContext =
      useContext<DraggableContextType<TuduViewModel>>(DraggableContext);

    const handleInsertOrUpdateTudu = useCallback(
      (tudu: TuduViewModel) => {
        console.log({tudu, isEditing, data: draggableContext.data});
        const draggableTudu = new DraggableItem([tudu]);
        if (isEditing) {
          const tuduIndex = draggableContext.data.findIndex(
            x => x.data[0].id === tudu.id,
          );
          if (tuduIndex >= 0) {
            const newList = draggableContext.data.slice();
            newList.splice(tuduIndex, 1, draggableTudu);
            draggableContext.setData(newList);
          }
        } else {
          const draggableTudus = draggableContext.data;
          const newList = draggableTudus.length
            ? [draggableTudu, ...draggableContext.data]
            : [draggableTudu];
          draggableContext.setData(newList);
        }
      },
      [draggableContext, isEditing],
    );

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalTuduData.label) {
        return;
      }

      handleInsertOrUpdateTudu(internalTuduData);

      onRequestClose();
    }, [handleInsertOrUpdateTudu, internalTuduData, onRequestClose]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !internalTuduData.label,
        },
        {label: t('buttons.cancel'), onPress: onRequestClose},
      ],
      [handleConfirmButtonPress, internalTuduData.label, onRequestClose, t],
    );

    return (
      <PopupModal
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={() => {
          setInternalTuduData(editingTudu ?? getNewEmptyTudu());
          setTimeout(() => inputRef.current?.focus(), 200);
        }}
        title={t(isEditing ? 'popupTitles.editTudu' : 'popupTitles.newTudu')}
        buttons={buttonsData}
        Icon={CheckMarkIcon}>
        <Input
          value={internalTuduData.label}
          onChangeText={handleTextChange}
          maxLength={30}
          ref={inputRef}
        />
      </PopupModal>
    );
  },
);

export {NewTuduModal};
