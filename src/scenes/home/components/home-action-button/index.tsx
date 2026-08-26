import React, {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {MenuOption} from '../../../../components/menu-options/types';
import {HomeActionButtonProps} from './types';
import {FloatingActionButtonRef} from '../../../../components/floating-action-button/types';
import {PlusIcon} from '../../../../components/animated-icons/plus-icon';
import {FloatingActionButton} from '../../../../components/floating-action-button';
import {
  HashIcon,
  HashIconActionAnimation,
} from '../../../../components/animated-icons/hash-icon';
import {CopyIcon} from '../../../../components/animated-icons/copy-icon';
import {NewListModal} from '../../../group/components/new-list-modal';
import {PasteListModal} from '../../../../components/paste-list-modal';
import {NewCounterModal} from '../../../counter/components/new-counter-modal';
import {NewTuduModal} from '../../../../components/new-tudu-modal';
import {useTranslation} from 'react-i18next';
import {NewGroupIcon} from '../../../../components/animated-icons/new-group-icon';
import {NewGroupModal} from '../../../group/components/new-group-modal';
import {DraggableContextType} from '../../../../modules/draggable/draggable-context/types';
import Toast from 'react-native-toast-message';
import {getUngroupedItems} from '../../../../modules/draggable/draggable-utils';
import {ListViewModel} from '../../types';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from '../../../../navigation/stack-navigator/types';
import {useListService} from '../../../../service/list-service-hook/useListService';
import {UNLISTED_LIST_ID} from '../../state';
import {MicIcon} from '../../../../components/animated-icons/mic-icon';

const HomeActionButton = memo(
  forwardRef<FloatingActionButtonRef, HomeActionButtonProps>((props, ref) => {
    const [newListPopupVisible, setNewListPopupVisible] = useState(false);
    const [pasteListPopupVisible, setPasteListPopupVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [newCounterPopupVisible, setNewCounterPopupVisible] = useState(false);
    const [newGroupPopupVisible, setNewGroupPopupVisible] = useState(false);
    const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
    const [autoStartVoice, setAutoStartVoice] = useState(false);
    const parentRef = useRef<FloatingActionButtonRef>(null);
    const draggableContext =
      useContext<DraggableContextType<ListViewModel>>(DraggableContext);
    const {t} = useTranslation();
    const navigation =
      useNavigation<NativeStackNavigationProp<StackNavigatorParamList>>();
    const {saveTudu} = useListService();

    const handleCreateTuduForToday = useCallback(() => {
      setAutoStartVoice(true);
      setNewTuduPopupVisible(true);
      parentRef.current?.closeMenu();
    }, []);

    const handleCreateNewList = useCallback(() => {
      setNewListPopupVisible(true);
      parentRef.current?.closeMenu();
    }, []);

    const handleCreateNewListFromText = useCallback(() => {
      setPasteListPopupVisible(true);
      parentRef.current?.closeMenu();
    }, []);

    const handleCreateNewCounter = useCallback(() => {
      setNewCounterPopupVisible(true);
      parentRef.current?.closeMenu();
    }, []);

    const handleCreateNewGroup = useCallback(() => {
      const ungroupedLists = getUngroupedItems(draggableContext.data);
      const thereAreLists = !!draggableContext.data.length;
      if (!ungroupedLists.length) {
        parentRef.current?.closeMenu();
        return Toast.show({
          type: 'tuduWarning',
          text1: 'No ungrouped lists',
          text2: thereAreLists
            ? 'All your lists are grouped already'
            : '👉 Start creating some lists',
          position: 'bottom',
          bottomOffset: 60,
        });
      }
      setNewGroupPopupVisible(true);
      parentRef.current?.closeMenu();
    }, [draggableContext.data]);

    const options: MenuOption[] = [
      {
        Icon: MicIcon,
        label: t('actions.newTuduToday'),
        onPress: handleCreateTuduForToday,
      },
      {
        Icon: ListDefaultIcon,
        label: t('actions.newList'),
        onPress: handleCreateNewList,
      },
      {
        Icon: CopyIcon,
        label: t('actions.newListFromText'),
        onPress: handleCreateNewListFromText,
      },
      {
        Icon: NewGroupIcon,
        label: t('actions.newGroup'),
        onPress: handleCreateNewGroup,
      },
      {
        Icon: HashIcon,
        label: t('actions.newCounter'),
        onPress: handleCreateNewCounter,
      },
    ];

    useImperativeHandle(ref, () => ({
      animateThisIcon(Icon) {
        parentRef.current?.animateThisIcon(Icon);
      },
      closeMenu() {
        parentRef.current?.closeMenu();
      },
    }));

    useEffect(() => {
      setTimeout(() => setVisible(true), 700);
    }, []);

    return visible ? (
      <>
        <FloatingActionButton
          DefaultIcon={PlusIcon}
          ref={parentRef}
          animationMode="play"
          animateOnPress
          menuOptions={options}
        />
        <NewTuduModal
          visible={newTuduPopupVisible}
          onRequestClose={() => {
            setNewTuduPopupVisible(false);
            setAutoStartVoice(false);
          }}
          onInsertOrUpdate={saveTudu}
          defaultDueDate={new Date()}
          defaultListId={UNLISTED_LIST_ID}
          defaultOrigin="unlisted"
          listName={t('listTitles.today')}
          autoStartVoice={autoStartVoice}
          onOpenAISettings={() => navigation.navigate('AISettings')}
        />
        <NewListModal
          visible={newListPopupVisible}
          onRequestClose={() => setNewListPopupVisible(false)}
        />
        <PasteListModal
          visible={pasteListPopupVisible}
          onRequestClose={() => setPasteListPopupVisible(false)}
          onOpenAISettings={() => navigation.navigate('AISettings')}
        />
        <NewCounterModal
          visible={newCounterPopupVisible}
          onRequestClose={() => setNewCounterPopupVisible(false)}
          onInsertNewCounter={() =>
            parentRef.current?.animateThisIcon(HashIconActionAnimation)
          }
        />
        <NewGroupModal
          visible={newGroupPopupVisible}
          onRequestClose={() => setNewGroupPopupVisible(false)}
        />
      </>
    ) : undefined;
  }),
);

export {HomeActionButton};
