import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {generateRandomHash} from '../../hooks/useHashGenerator';
import {TuduViewModel} from '../../scenes/home/types';
import {CheckMarkIcon} from '../animated-icons/check-mark';
import {PopupModal} from '../popup-modal';
import {PopupButton} from '../popup-modal/types';
import {Input} from './styles';
import {NewTuduModalProps} from './types';
import { useEmojiSearch } from '../../hooks/useEmojiSearch';
import SuggestedEmojiList from '../suggested-emoji-list';
import { trimEmoji } from '../../utils/emoji-utils';
import { DATE_PARAMETERS_REGEX, PARAMETERS_REGEX } from '../../constants';

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

const MAX_TUDU_LENGTH = 100;

const NewTuduModal: React.FC<NewTuduModalProps> = memo(
  ({visible, editingTudu, listName, onRequestClose, onInsertOrUpdate}) => {
    const [internalTuduData, setInternalTuduData] = useState<TuduViewModel>(
      editingTudu ?? getNewEmptyTudu(),
    );
    const [suggestedEmojis, setSuggestedEmojis] = useState<string[]>([]);
    const [isTopContainerVisible, setIsTopContainerVisible] = useState(false);
    const [showingMostUsedEmojis, setShowingMostUsedEmojis] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {t} = useTranslation();

    const inputRef = useRef<TextInput>(null);

    const {
      debounceSearchEmojis,
      searchEmojis,
      getMostUsedEmojis,
      getDefaultEmojis
    } = useEmojiSearch(1000);

    const handleRequestClose = useCallback(() => {
      setIsTopContainerVisible(false);
      setSuggestedEmojis([]);
      onRequestClose();
    }, []);

    const searchEmojisForListName = useCallback(() => {
      var resultsForListName: string[] = [];
      const tuduListName = editingTudu?.listName || listName;

      if (tuduListName) {
        resultsForListName = searchEmojis(tuduListName);
      }

      return resultsForListName;
    }, [editingTudu, searchEmojis]);

    const handleTextChange = useCallback((text: string) => {
      setInternalTuduData(x => {
        const newTudu = x.clone();
        newTudu.label = text;
        return newTudu;
      });

      setIsTopContainerVisible(true);

      debounceSearchEmojis(text, (results, isShowingMostUsed) => {
        var emojis = results;

        if (emojis.length < 3) {
          emojis = [...emojis, ...searchEmojisForListName()];
        }
        setShowingMostUsedEmojis(isShowingMostUsed);

        if (isShowingMostUsed) {
          emojis = [...new Set([...emojis, ...getDefaultEmojis('tudu')])];
        }
        setIsLoading(false);
        setSuggestedEmojis(emojis);
      },true, () => setIsLoading(true));
    }, [debounceSearchEmojis, editingTudu]);

    const isEditing = useMemo(() => !!editingTudu, [editingTudu]);

    const handleInsertOrUpdateTudu = useCallback(
      (tudu: TuduViewModel) => {
        const parseParameters = (text: string) => {
          const params: { [key: string]: boolean | Date | null } = {
            starred: false,
            today: false,
            tomorrow: false,
            dueDate: null,
            daily: false,
            weekly: false,
            monthly: false,
            yearly: false,
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
          };

          let match;
          while ((match = PARAMETERS_REGEX.exec(text)) !== null) {
            switch (match[1]) {
              case '-s':
              case '--starred':
                params.starred = true;
                break;
              case '-t':
              case '--today':
                params.today = true;
                break;
              case '-T':
              case '--tomorrow':
                params.tomorrow = true;
                break;
              case '-d':
              case '--daily':
                params.daily = true;
                break;
              case '-D':
              case '--date':
                const dateRegex = /(\d{4}-\d{2}-\d{2})/;
                dateRegex.lastIndex = match.index;
                const dateMatch = text.match(dateRegex);
                if (dateMatch) {
                  const [year, month, day] = dateMatch[0].split('-').map(Number);
                  const parsedDate = new Date(year, month - 1, day);
                  if (!isNaN(parsedDate.getTime())) {
                    params.dueDate = parsedDate;
                  }
                }
                break;
              case '-w':
              case '--weekly':
                params.weekly = true;
                break;
              case '-m':
              case '--monthly':
                params.monthly = true;
                break;
              case '-y':
              case '--yearly':
                params.yearly = true;
                break;
              case '-ns':
              case '--sunday':
                params.sunday = true;
                break;
              case '-nm':
              case '--monday':
                params.monday = true;
                break;
              case '-nt':
              case '--tuesday':
                params.tuesday = true;
                break;
              case '-nw':
              case '--wednesday':
                params.wednesday = true;
                break;
              case '-nh':
              case '--thursday':
                params.thursday = true;
                break;
              case '-nf':
              case '--friday':
                params.friday = true;
                break;
              case '-na':
              case '--saturday':
                params.saturday = true;
                break;
              default:
                break;
            }
          }

          const cleanedText = text.replace(DATE_PARAMETERS_REGEX, '').replace(PARAMETERS_REGEX, '').trim();

          return { params, cleanedText };
        };

        const getNextDateForDay = (day: number): Date => {
          const today = new Date();
          const currentDay = today.getDay();
          const daysUntilNext = (day + 7 - currentDay) % 7 || 7;
          const nextDate = new Date(today);
          nextDate.setDate(today.getDate() + daysUntilNext);
          return nextDate;
        };

        const { params, cleanedText } = parseParameters(tudu.label);

        const updatedTudu = tudu.clone();
        updatedTudu.label = cleanedText;

        if (params.starred) {
          updatedTudu.starred = true;
        }

        if (params.today) {
          updatedTudu.dueDate = new Date();
        } else if (params.tomorrow) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          updatedTudu.dueDate = tomorrow;
        }

        if (params.sunday) {
          updatedTudu.dueDate = getNextDateForDay(0);
        } else if (params.monday) {
          updatedTudu.dueDate = getNextDateForDay(1);
        } else if (params.tuesday) {
          updatedTudu.dueDate = getNextDateForDay(2);
        } else if (params.wednesday) {
          updatedTudu.dueDate = getNextDateForDay(3);
        } else if (params.thursday) {
          updatedTudu.dueDate = getNextDateForDay(4);
        } else if (params.friday) {
          updatedTudu.dueDate = getNextDateForDay(5);
        } else if (params.saturday) {
          updatedTudu.dueDate = getNextDateForDay(6);
        } else {
          const dueDate = params.dueDate ? params.dueDate as Date : updatedTudu.dueDate;
          updatedTudu.dueDate = dueDate;
        }

        if (params.daily) {
          updatedTudu.recurrence = 'daily';
          updatedTudu.dueDate ||= new Date();
        }

        if (params.weekly) {
          updatedTudu.recurrence = 'weekly';
          updatedTudu.dueDate ||= new Date();
        }

        if (params.monthly) {
          updatedTudu.recurrence = 'monthly';
          updatedTudu.dueDate ||= new Date();
        }

        if (params.yearly) {
          updatedTudu.recurrence = 'yearly';
          updatedTudu.dueDate ||= new Date();
        }

        onInsertOrUpdate(updatedTudu);
      },
      [onInsertOrUpdate],
    );

    const handleConfirmButtonPress = useCallback(() => {
      if (!internalTuduData.label) {
        return;
      }

      handleInsertOrUpdateTudu(internalTuduData);

      handleRequestClose();
    }, [handleInsertOrUpdateTudu, internalTuduData, handleRequestClose]);

    const buttonsData = useMemo<PopupButton[]>(
      () => [
        {
          label: t('buttons.ok'),
          onPress: handleConfirmButtonPress,
          disabled: !internalTuduData.label,
        },
        {label: t('buttons.cancel'), onPress: handleRequestClose},
      ],
      [handleConfirmButtonPress, internalTuduData.label, handleRequestClose, t],
    );

    const handleEmojiSelect = useCallback((emoji: string) => {
      setInternalTuduData((current) => {
        var tuduClone = current.clone();
        var label = tuduClone.label;
        label = trimEmoji(label, "start")?.formattedText ?? '';
        tuduClone.label = `${emoji} ${label.trim()}`;
        return tuduClone;
      });
    }, []);

    const TopContainerComponent = useMemo(() => {
      return (
        <SuggestedEmojiList
          emojis={suggestedEmojis}
          onEmojiSelect={handleEmojiSelect}
          isShowingMostUsedEmojis={showingMostUsedEmojis}
          isLoading={isLoading}
        />
      );
    }, [suggestedEmojis, handleEmojiSelect, showingMostUsedEmojis, isLoading]);

    return (
      <PopupModal
        visible={visible}
        topContainerVisible={isTopContainerVisible}
        onRequestClose={handleRequestClose}
        TopContainerComponent={TopContainerComponent}
        onShow={() => {
          setInternalTuduData(editingTudu ?? getNewEmptyTudu());
          setTimeout(() => inputRef.current?.focus(), 200);
          setTimeout(() => {
            setIsLoading(true);
            setIsTopContainerVisible(true);

            setTimeout(() => {
              var emojis = searchEmojis(editingTudu?.label ?? '');

              if (!emojis.length) {
                emojis = [...new Set([...getMostUsedEmojis(), ...getDefaultEmojis("tudu")])];
                setShowingMostUsedEmojis(!!emojis.length);
              }

              if (emojis.length < 3) {
                emojis = [...emojis, ...searchEmojisForListName()];
              }

              setSuggestedEmojis(emojis);
              setIsLoading(false);
            }, 0);
          }, 700);
        }}
        title={t(isEditing ? 'popupTitles.editTudu' : 'popupTitles.newTudu')}
        buttons={buttonsData}
        Icon={CheckMarkIcon}>
        <Input
          value={internalTuduData.label}
          onChangeText={handleTextChange}
          maxLength={MAX_TUDU_LENGTH}
          ref={inputRef}
        />
      </PopupModal>
    );
  },
);

export {NewTuduModal};
