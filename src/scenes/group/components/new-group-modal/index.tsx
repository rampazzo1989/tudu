import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {PopupModal} from '../../../../components/popup-modal';
import {ListDataViewModel} from '../../../home/types';
import {useTranslation} from 'react-i18next';
import {PopupButton} from '../../../../components/popup-modal/types';
import {TextInput, View} from 'react-native';
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
import {getUngroupedItems} from '../../../../modules/draggable/draggable-utils';
import {getDuplicateProofGroupTitle} from '../../../../utils/list-and-group-utils';

const NewGroupModal: React.FC<NewGroupModalProps> = memo(
  ({visible, editingGroupData, onRequestClose}) => {
    const [title, setTitle] = useState('');
    const titleInputRef = useRef<TextInput>(null);
    const {t} = useTranslation();
    const [selectedLists, setSelectedLists] = useState<
      DraggableItem<ListDataViewModel>[]
    >([]);
    const draggableContext =
      useContext<DraggableContextType<ListDataViewModel>>(DraggableContext);
    const theme = useTheme();

    const availableLists = useMemo(() => {
      const ungrouped = getUngroupedItems(draggableContext?.data);
      if (!editingGroupData) {
        return ungrouped;
      }
      const currentGroupLists = (editingGroupData.data || []).map(
        list => new DraggableItem([list]),
      );
      return [...currentGroupLists, ...ungrouped];
    }, [draggableContext?.data, editingGroupData]);

    const handleConfirmButtonPress = useCallback(() => {
      const allSelectedLists = selectedLists.flatMap(x => x.data);

      if (editingGroupData) {
        const isUpdatingTitle = title.trim() !== editingGroupData.groupId;
        const otherItems = (draggableContext?.data || []).filter(
          item => item !== editingGroupData,
        );
        const finalTitle = isUpdatingTitle
          ? getDuplicateProofGroupTitle(otherItems, title.trim())
          : (editingGroupData.groupId ?? title.trim());

        const selectedListIds = selectedLists.map(s => s.data[0].id);

        const removedLists = (editingGroupData.data || []).filter(
          orig => !selectedListIds.includes(orig.id),
        );

        const newlyAddedListIds = selectedLists
          .filter(
            s => !editingGroupData.data.some(orig => orig.id === s.data[0].id),
          )
          .map(s => s.data[0].id);

        const updatedGroup = new DraggableItem(allSelectedLists, finalTitle);
        const newData: DraggableItem<ListDataViewModel>[] = [];

        for (const item of (draggableContext?.data || [])) {
          if (item === editingGroupData) {
            if (allSelectedLists.length > 0) {
              newData.push(updatedGroup);
            }
            removedLists.forEach(removed => {
              newData.push(new DraggableItem([removed]));
            });
          } else if (item.groupId) {
            newData.push(item);
          } else {
            if (!newlyAddedListIds.includes(item.data[0].id)) {
              newData.push(item);
            }
          }
        }

        draggableContext?.setData(newData);
      } else {
        const duplicateProofListTitle = getDuplicateProofGroupTitle(
          draggableContext?.data || [],
          title.trim(),
        );
        const newGroup = new DraggableItem(
          allSelectedLists,
          duplicateProofListTitle,
        );
        const selectedListIds = selectedLists.map(s => s.data[0].id);
        const newDataWithoutGroupedItems = (draggableContext?.data || []).filter(
          item => !selectedListIds.includes(item.data[0]?.id),
        );
        newDataWithoutGroupedItems.push(newGroup);
        draggableContext?.setData(newDataWithoutGroupedItems);
      }
      onRequestClose();
    }, [draggableContext, editingGroupData, onRequestClose, selectedLists, title]);

    const dataValidated = useMemo(
      () => !!title.trim() && selectedLists.length > 0,
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
      if (editingGroupData) {
        setTitle(editingGroupData.groupId ?? '');
        const initialSelected = editingGroupData.data.map(
          list => new DraggableItem([list]),
        );
        setSelectedLists(initialSelected);
      } else {
        setTitle('');
        setSelectedLists([]);
      }
      setTimeout(() => titleInputRef.current?.focus(), 200);
    }, [editingGroupData]);

    const handleTitleChange = useCallback((text: string) => {
      setTitle(text);
    }, []);

    const handleCheckboxPressGenerator = useCallback(
      (list: DraggableItem<ListDataViewModel>) => () => {
        setSelectedLists(current => {
          const exists = current.some(s => s.data[0].id === list.data[0].id);
          if (exists) {
            return current.filter(s => s.data[0].id !== list.data[0].id);
          } else {
            return [...current, list];
          }
        });
      },
      [],
    );

    return (
      <PopupModal
        visible={visible}
        onTouchBackground={onRequestClose}
        onShow={handlePopupShow}
        title={
          editingGroupData
            ? t('popupTitles.editGroup')
            : t('popupTitles.newGroup')
        }
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
                {availableLists.map(list => {
                  const isChecked = selectedLists.some(
                    s => s.data[0].id === list.data[0].id,
                  );
                  return (
                    <SelectableListCard
                      label={list.data[0].label}
                      Icon={ListDefaultIcon}
                      numberOfActiveItems={list.data[0].numberOfActiveItems}
                      isHighlighted
                      key={`${list.data[0].id}`}
                      ControlComponent={
                        <CheckboxSimple
                          checked={isChecked}
                          onPress={handleCheckboxPressGenerator(list)}
                        />
                      }
                    />
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
