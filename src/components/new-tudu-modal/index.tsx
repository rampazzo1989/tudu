import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, TextInput } from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { generateRandomHash } from '../../hooks/useHashGenerator';
import { TuduViewModel, RecurrenceType } from '../../scenes/home/types';
import { CheckMarkIcon } from '../animated-icons/check-mark';
import { CalendarIcon } from '../animated-icons/calendar';
import { RecurrenceIcon } from '../animated-icons/recurrence-icon';
import { PopupModal } from '../popup-modal';
import { PopupButton } from '../popup-modal/types';
import { ScheduleModal } from '../schedule-modal';
import { AISuggestionsModal } from '../ai-suggestions-modal';
import { formatScheduledDateTime } from '../../utils/date-utils';
import {
  AISuggestionButton,
  AISuggestionButtonText,
  ClearScheduleButton,
  ClearScheduleText,
  ContentContainer,
  HeaderCalendarButton,
  Input,
  InputContainer,
  MicButton,
  ScheduleAddButton,
  ScheduleAddButtonText,
  ScheduledBadgeButton,
  ScheduledBadgeContainer,
  ScheduledBadgeText,
  ScheduleRowContainer,
} from './styles';
import { NewTuduModalProps } from './types';
import { useEmojiSearch } from '../../hooks/useEmojiSearch';
import { useVoiceRecognition, isBenignVoiceError } from '../../hooks/useVoiceRecognition';
import { MicIcon } from '../animated-icons/mic-icon';
import { parseVoiceInput } from '../../utils/voice-parser';
import Toast from 'react-native-toast-message';
import SuggestedEmojiList from '../suggested-emoji-list';
import {
  DATE_PARAMETERS_REGEX,
  PARAMETERS_REGEX,
  TIME_PARAMETERS_REGEX,
} from '../../constants';
import { trimEmoji } from '../../utils/emoji-utils';

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
  ({
    visible,
    editingTudu,
    listName,
    existingTasks,
    onRequestClose,
    onInsertOrUpdate,
    onBatchInsert,
    onOpenAISettings,
  }) => {
    const [internalTuduData, setInternalTuduData] = useState<TuduViewModel>(
      editingTudu ? editingTudu.clone() : getNewEmptyTudu(),
    );
    const [suggestedEmojis, setSuggestedEmojis] = useState<string[]>([]);
    const [isTopContainerVisible, setIsTopContainerVisible] = useState(false);
    const [showingMostUsedEmojis, setShowingMostUsedEmojis] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAIGenerated, setIsAIGenerated] = useState(false);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [isAISuggestionsModalVisible, setIsAISuggestionsModalVisible] = useState(false);


    const { t, i18n } = useTranslation();

    const inputRef = useRef<TextInput>(null);
    const preVoiceLabelRef = useRef<string>('');

    const {
      debounceSearchEmojis,
      searchEmojis,
      getMostUsedEmojis,
      getDefaultEmojis,
    } = useEmojiSearch(1200);

    useEffect(() => {
      if (visible) {
        setInternalTuduData(editingTudu ? editingTudu.clone() : getNewEmptyTudu());
        setIsScheduleModalVisible(false);
      }
    }, [visible, editingTudu]);

    const handleVoiceFinal = useCallback(
      (spokenText: string) => {
        if (!spokenText) return;

        const baseText = preVoiceLabelRef.current.trim();
        const fullSpoken = baseText ? `${baseText} ${spokenText}` : spokenText;
        const parsed = parseVoiceInput(fullSpoken);

        setInternalTuduData(prev => {
          const updated = prev.clone();
          updated.label = parsed.cleanedText;
          if (parsed.dueDate) {
            updated.dueDate = parsed.dueDate;
            updated.hasTime = parsed.hasTime ?? false;
          }
          if (parsed.recurrence) {
            updated.recurrence = parsed.recurrence;
          }
          if (parsed.starred) {
            updated.starred = true;
          }
          return updated;
        });

        handleTextChange(parsed.cleanedText);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const handleVoicePartial = useCallback((partialText: string) => {
      if (!partialText) return;
      const baseText = preVoiceLabelRef.current.trim();
      const combined = baseText ? `${baseText} ${partialText}` : partialText;
      setInternalTuduData(prev => {
        const updated = prev.clone();
        updated.label = combined;
        return updated;
      });
    }, []);

    const handleVoiceError = useCallback(
      (err: string) => {
        if (!err || isBenignVoiceError(err)) {
          return;
        }

        const normalized = String(err).trim();
        const code = normalized.split('/')[0].trim();

        if (code === 'permission_denied' || code === '9') {
          Alert.alert(
            t('voice.permissionTitle', { defaultValue: 'Permissão de Microfone' }),
            t('voice.permissionDenied', {
              defaultValue:
                'Permissão de microfone necessária para ditar tudús. Deseja abrir as configurações?',
            }),
            [
              {
                text: t('buttons.cancel', { defaultValue: 'Cancelar' }),
                style: 'cancel',
              },
              {
                text: t('voice.openSettings', { defaultValue: 'Abrir Configurações' }),
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return;
        }

        let errorMessage = t('voice.error', {
          defaultValue: 'Não foi possível reconhecer a voz. Tente novamente.',
        });

        if (code === '1' || code === '2' || code === '4') {
          errorMessage = `${errorMessage}\n\nVerifique a conexão com a internet ou o serviço de voz do Google (Código: ${code}).`;
        } else if (code === '3') {
          errorMessage = 'Erro ao capturar o microfone. Verifique se outro app está usando o áudio.';
        } else if (code === 'service_unavailable' || code === 'no_service') {
          errorMessage = 'Serviço de voz do Google não encontrado ou desativado no celular.';
        } else if (code && code !== 'voice_error') {
          errorMessage = `${errorMessage} (${code})`;
        }

        Alert.alert(
          t('voice.errorTitle', { defaultValue: 'Reconhecimento de Voz' }),
          errorMessage,
        );
      },
      [t],
    );

    const {
      isListening,
      startListening,
      stopListening,
      cancelListening,
    } = useVoiceRecognition({
      onSpeechFinal: handleVoiceFinal,
      onSpeechPartial: handleVoicePartial,
      onError: handleVoiceError,
    });

    const handleMicPress = useCallback(async () => {
      if (isListening) {
        await stopListening();
      } else {
        preVoiceLabelRef.current = internalTuduData.label || '';
        const currentLang = i18n.language || 'pt-BR';
        await startListening(currentLang);
      }
    }, [isListening, internalTuduData.label, i18n.language, startListening, stopListening]);

    const handleRequestClose = useCallback(() => {
      cancelListening();
      setIsTopContainerVisible(false);
      setSuggestedEmojis([]);
      setIsLoading(false);
      setIsAIGenerated(false);
      setIsScheduleModalVisible(false);
      setIsAISuggestionsModalVisible(false);
      onRequestClose();
    }, [cancelListening, onRequestClose]);

    const handleOpenAISuggestions = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      setIsAISuggestionsModalVisible(true);
    }, []);

    const handleAISuggestionsConfirm = useCallback(
      (selectedTasks: string[]) => {
        if (selectedTasks.length === 0) return;
        if (onBatchInsert) {
          onBatchInsert(selectedTasks);
          handleRequestClose();
        } else {
          selectedTasks.forEach(taskLabel => {
            const newTudu = getNewEmptyTudu();
            newTudu.label = taskLabel;
            newTudu.origin = editingTudu?.origin || 'default';
            newTudu.listId = editingTudu?.listId || '';
            onInsertOrUpdate(newTudu);
          });
          handleRequestClose();
        }
      },
      [onBatchInsert, handleRequestClose, editingTudu, onInsertOrUpdate],
    );


    const searchEmojisForListName = useCallback(() => {
      var resultsForListName: string[] = [];
      const tuduListName = editingTudu?.listName || listName;

      if (tuduListName) {
        resultsForListName = searchEmojis(tuduListName);
      }

      return resultsForListName;
    }, [editingTudu, searchEmojis, listName]);

    const handleTextChange = useCallback(
      (text: string) => {
        setInternalTuduData(x => {
          const newTudu = x.clone();
          newTudu.label = text;
          return newTudu;
        });

        setIsTopContainerVisible(true);

        const targetListName = editingTudu?.listName || listName;

        debounceSearchEmojis(
          text,
          (results, isShowingMostUsed, isAI) => {
            var emojis = results;

            if (isShowingMostUsed) {
              if (emojis.length < 3) {
                emojis = [...emojis, ...searchEmojisForListName()];
              }
              emojis = [...new Set([...emojis, ...getDefaultEmojis('tudu')])];
            }
            setShowingMostUsedEmojis(isShowingMostUsed);
            setIsAIGenerated(isAI);
            setIsLoading(false);
            setSuggestedEmojis(emojis);
          },
          true,
          () => {
            if (suggestedEmojis.length === 0) {
              setIsLoading(true);
            }
          },
          {
            type: 'tudu',
            listName: targetListName,
          },
        );
      },
      [
        debounceSearchEmojis,
        editingTudu,
        listName,
        searchEmojisForListName,
        getDefaultEmojis,
        suggestedEmojis.length,
      ],
    );

    const isEditing = useMemo(() => !!editingTudu, [editingTudu]);

    const handleOpenScheduleModal = useCallback(() => {
      setIsScheduleModalVisible(true);
    }, []);

    const handleCloseScheduleModal = useCallback(() => {
      setIsScheduleModalVisible(false);
    }, []);

    const handleScheduleConfirm = useCallback(
      (date: Date, withTime?: boolean, recurrence?: RecurrenceType) => {
        setInternalTuduData(prev => {
          const updated = prev.clone();
          updated.dueDate = date;
          updated.hasTime = withTime ?? false;
          updated.recurrence = recurrence;
          return updated;
        });
        setIsScheduleModalVisible(false);
      },
      [],
    );

    const handleClearSchedule = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      setInternalTuduData(prev => {
        const updated = prev.clone();
        updated.dueDate = undefined;
        updated.hasTime = undefined;
        updated.recurrence = undefined;
        return updated;
      });
    }, []);

    const handleInsertOrUpdateTudu = useCallback(
      (tudu: TuduViewModel) => {
        const parseParameters = (text: string) => {
          const params: { [key: string]: boolean | Date | number | null } = {
            starred: false,
            today: false,
            tomorrow: false,
            dueDate: null,
            hasTime: false,
            timeHours: 0,
            timeMinutes: 0,
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
            switch (match[1]?.toLowerCase()) {
              case '-s':
              case '--starred':
                params.starred = true;
                break;
              case '-t':
              case '--today':
                params.today = true;
                break;
              case '-T':
              case '-t':
              case '--tomorrow':
                if (match[1] === '-T' || match[1] === '--tomorrow') {
                  params.tomorrow = true;
                }
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

          // Parse optional time (e.g., @14:30, @14h30, @14h, --time 14:30, -h 14:30)
          const timeRegex = /(?:^|\s)(?:@|--time\s+|-h\s+)(\d{1,2})(?::|h)?(\d{2})?(?=\s|$)/i;
          const timeMatch = timeRegex.exec(text);
          if (timeMatch) {
            const hour = parseInt(timeMatch[1], 10);
            const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
            if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
              params.hasTime = true;
              params.timeHours = hour;
              params.timeMinutes = minute;
            }
          }

          const cleanedText = text
            .replace(DATE_PARAMETERS_REGEX, '')
            .replace(TIME_PARAMETERS_REGEX, '')
            .replace(PARAMETERS_REGEX, '')
            .trim();

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
        } else if (params.sunday) {
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
          const dueDate = params.dueDate ? (params.dueDate as Date) : updatedTudu.dueDate;
          updatedTudu.dueDate = dueDate;
        }

        if (params.hasTime) {
          updatedTudu.dueDate ||= new Date();
          updatedTudu.dueDate = new Date(updatedTudu.dueDate);
          updatedTudu.dueDate.setHours(
            Number(params.timeHours),
            Number(params.timeMinutes),
            0,
            0,
          );
          updatedTudu.hasTime = true;
        } else if (updatedTudu.dueDate) {
          updatedTudu.hasTime = updatedTudu.hasTime ?? false;
        } else {
          updatedTudu.hasTime = false;
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
        { label: t('buttons.cancel'), onPress: handleRequestClose },
      ],
      [handleConfirmButtonPress, internalTuduData.label, handleRequestClose, t],
    );

    const handleEmojiSelect = useCallback((emoji: string) => {
      setInternalTuduData(current => {
        var tuduClone = current.clone();
        var label = tuduClone.label;
        label = trimEmoji(label, 'start')?.formattedText ?? '';
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
          isAIGenerated={isAIGenerated}
          isLoading={isLoading}
        />
      );
    }, [
      suggestedEmojis,
      handleEmojiSelect,
      showingMostUsedEmojis,
      isAIGenerated,
      isLoading,
    ]);

    const ActionButtonComponent = useMemo(
      () => (
        <HeaderCalendarButton onPress={handleOpenScheduleModal}>
          <CalendarIcon size={20} />
        </HeaderCalendarButton>
      ),
      [handleOpenScheduleModal],
    );

    return (
      <>
        <PopupModal
          visible={visible && !isScheduleModalVisible}
          topContainerVisible={isTopContainerVisible}
          onTouchBackground={handleRequestClose}
          TopContainerComponent={TopContainerComponent}
          onShow={() => {
            setTimeout(() => inputRef.current?.focus(), 200);
            setTimeout(() => {
              setIsLoading(true);
              setIsTopContainerVisible(true);

              setTimeout(() => {
                var emojis = searchEmojis(editingTudu?.label ?? '');

                if (!emojis.length) {
                  emojis = [
                    ...new Set([
                      ...getMostUsedEmojis(),
                      ...getDefaultEmojis('tudu'),
                    ]),
                  ];
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
          ActionButton={ActionButtonComponent}
          Icon={CheckMarkIcon}>
          <ContentContainer>
            <InputContainer>
              <Input
                value={internalTuduData.label}
                onChangeText={handleTextChange}
                maxLength={MAX_TUDU_LENGTH}
                ref={inputRef}
                placeholder={
                  isListening
                    ? t('voice.listening', { defaultValue: 'Ouvindo...' })
                    : undefined
                }
                placeholderTextColor={isListening ? '#EF4444' : '#9CA3AF'}
              />
              <MicButton
                onPress={handleMicPress}
                activeOpacity={0.7}
                accessibilityLabel={t('voice.tapToSpeak', {
                  defaultValue: 'Ditar por voz',
                })}>
                <MicIcon isListening={isListening} size={18} />
              </MicButton>
            </InputContainer>
            <ScheduleRowContainer>
              {internalTuduData.dueDate ? (
                <ScheduledBadgeContainer>
                  <ScheduledBadgeButton onPress={handleOpenScheduleModal}>
                    {internalTuduData.recurrence ? (
                      <RecurrenceIcon size={14} autoPlay={false} />
                    ) : (
                      <CalendarIcon size={14} autoPlay={false} />
                    )}
                    <ScheduledBadgeText>
                      {formatScheduledDateTime(
                        internalTuduData.dueDate,
                        internalTuduData.hasTime,
                        t,
                      )}
                      {internalTuduData.recurrence
                        ? ` • ${t(`recurrence.${internalTuduData.recurrence}`)}`
                        : ''}
                    </ScheduledBadgeText>
                  </ScheduledBadgeButton>
                  <ClearScheduleButton onPress={handleClearSchedule}>
                    <ClearScheduleText>×</ClearScheduleText>
                  </ClearScheduleButton>
                </ScheduledBadgeContainer>
              ) : (
                <ScheduleAddButton onPress={handleOpenScheduleModal}>
                  <CalendarIcon size={14} autoPlay={false} />
                  <ScheduleAddButtonText style={{ marginLeft: 5 }}>
                    {t('scheduleOptions.addSchedule', {
                      defaultValue: '+ Agendar data/hora',
                    })}
                  </ScheduleAddButtonText>
                </ScheduleAddButton>
              )}
              <AISuggestionButton onPress={handleOpenAISuggestions}>
                <CalendarIcon size={14} autoPlay={false} overrideColor="transparent" />
                <AISuggestionButtonText>
                  {t('aiSuggestions.buttonSuggestShort', {
                    defaultValue: '✨ Sugerir itens',
                  })}
                </AISuggestionButtonText>
              </AISuggestionButton>
            </ScheduleRowContainer>
          </ContentContainer>
        </PopupModal>
        <ScheduleModal
          isVisible={isScheduleModalVisible}
          onModalClose={handleCloseScheduleModal}
          onSchedule={handleScheduleConfirm}
          currentDate={internalTuduData.dueDate}
          hasTimeInitial={internalTuduData.hasTime}
          currentRecurrence={internalTuduData.recurrence}
        />
        <AISuggestionsModal
          isVisible={isAISuggestionsModalVisible}
          onClose={() => setIsAISuggestionsModalVisible(false)}
          listName={editingTudu?.listName || listName}
          existingTasks={existingTasks}
          seedInput={internalTuduData.label}
          onConfirm={handleAISuggestionsConfirm}
          onOpenAISettings={onOpenAISettings}
        />
      </>
    );

  },
);

export { NewTuduModal };
