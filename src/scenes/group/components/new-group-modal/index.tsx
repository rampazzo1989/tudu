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
  BottomFadingGradient,
  Label,
  Lists,
  ListsContainer,
  SelectableListCard,
  TitleContainer,
  TitleInput,
  TopFadingGradient,
} from './styles';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {
  DraggableContextType,
  DraggableItem,
} from '../../../../modules/draggable/draggable-context/types';
import {NewGroupModalProps} from './types';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {CheckboxSimple} from '../../../../components/checkbox-simple';
import {useTheme} from 'styled-components/native';
import {removeFromList} from '../../../../utils/array-utils';

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
    const theme = useTheme();

    const ungroupedLists = useMemo(() => {
      const allLists = draggableContext.data;
      const ungrouped = allLists.filter(x => !x.groupId);
      return ungrouped;
    }, [draggableContext.data]);

    const handleConfirmButtonPress = useCallback(() => {
      const allSelectedLists = selectedLists.flatMap(x => x.data);
      const newGroup = new DraggableItem(allSelectedLists, title);
      const newData = draggableContext.data.slice();
      const newDataWithoutGroupedItems = removeFromList(newData, selectedLists);
      newDataWithoutGroupedItems.push(newGroup);
      draggableContext.setData(newDataWithoutGroupedItems);
      onRequestClose();
    }, [draggableContext, onRequestClose, selectedLists, title]);

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
      setSelectedLists([]);
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
            <Lists
              pointerEvents="auto"
              keyboardShouldPersistTaps="handled"
              scrollEnabled
              onStartShouldSetResponderCapture={() => false}>
              <View onStartShouldSetResponder={() => true}>
                {ungroupedLists.map(list => {
                  return (
                    <SelectableListCard
                      label={list.data[0].label}
                      Icon={ListDefaultIcon}
                      numberOfActiveItems={list.data[0].numberOfActiveItems}
                      isHighlighted
                      key={`${list.data[0].label}`}
                      ControlComponent={
                        <CheckboxSimple
                          checked={selectedLists.includes(list)}
                          onPress={() => {
                            setSelectedLists(current => {
                              const itemIndex = current.indexOf(list);

                              const newList = current.slice();

                              if (itemIndex >= 0) {
                                newList.splice(itemIndex, 1);
                              } else {
                                newList.push(list);
                              }

                              return newList;
                            });
                          }}
                        />
                      }
                    />
                    // <Text key={list.data[0].label}>{list.data[0].label}</Text>
                  );
                })}
              </View>
            </Lists>
            <TopFadingGradient
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}
              colors={theme.colors.scrollFadeGradientColors}
              pointerEvents={'none'}
            />
            <BottomFadingGradient
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              colors={theme.colors.scrollFadeGradientColors}
              pointerEvents={'none'}
            />
          </ListsContainer>
        </View>
      </PopupModal>
    );
  },
);

export {NewGroupModal};