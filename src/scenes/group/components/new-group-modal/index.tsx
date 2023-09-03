import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {NewCounterModalProps} from './types';
import {PopupModal} from '../../../../components/popup-modal';
import {Counter, List} from '../../../home/types';
import {useTranslation} from 'react-i18next';
import {HashIcon} from '../../../../components/animated-icons/hash-icon';
import {PopupButton} from '../../../../components/popup-modal/types';
import {Text, TextInput, View} from 'react-native';
import {NewGroupIcon} from '../../../../components/animated-icons/new-group-icon';
import {
  Label,
  Lists,
  ListsContainer,
  TitleContainer,
  TitleInput,
} from './styles';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {
  DraggableContextType,
  DraggableItem,
} from '../../../../modules/draggable/draggable-context/types';
import {NewGroupModalProps} from './types';

const emptyCounter: Counter = {title: '', value: 0, pace: 1};

const defaultPaceOptions = [1, 5, 10];

const NewGroupModal: React.FC<NewGroupModalProps> = memo(
  ({visible, editingGroupData, onRequestClose}) => {
    const [title, setTitle] = useState('');
    const titleInputRef = useRef<TextInput>(null);
    const {t} = useTranslation();
    const [selectedLists, setSelectedLists] = useState<DraggableItem<List>[]>(
      [],
    );
    const draggableContext =
      useContext<DraggableContextType<List>>(DraggableContext);

    const ungroupedLists = useMemo(() => {
      const allLists = draggableContext.data;
      const ungrouped = allLists.filter(x => !x.groupId);
      return ungrouped;
    }, [draggableContext.data]);

    const handleConfirmButtonPress = useCallback(() => {}, []);

    const dataValidated = useMemo(
      () => !!title && !!selectedLists.length,
      [selectedLists.length, title],
    );

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !dataValidated,
        },
        {label: t('buttons.cancel'), onPress: onRequestClose},
      ],
      [dataValidated, handleConfirmButtonPress, onRequestClose, t],
    );

    const handlePopupShow = useCallback(() => {
      setTitle('');
      setTimeout(() => titleInputRef.current?.focus(), 200);
    }, []);

    const handleTitleChange = useCallback((text: string) => {
      setTitle(text);
    }, []);

    return (
      <PopupModal
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={handlePopupShow}
        title={t('popupTitles.newGroup')}
        buttons={buttonsData}
        Icon={NewGroupIcon}>
        <View>
          <TitleContainer>
            <Label>{t('inputLabels.name')}</Label>
            <TitleInput
              value={title}
              maxLength={30}
              onChangeText={handleTitleChange}
              ref={titleInputRef}
              enterKeyHint="next"
            />
          </TitleContainer>
          <ListsContainer>
            <Label>{t('inputLabels.addLists')}</Label>
            <Lists>
              {ungroupedLists.map(list => {
                return (
                  <Text key={list.data[0].label}>{list.data[0].label}</Text>
                );
              })}
            </Lists>
          </ListsContainer>
        </View>
      </PopupModal>
    );
  },
);

export {NewGroupModal};
