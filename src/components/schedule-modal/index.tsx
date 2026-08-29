import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { PopupModal } from '../popup-modal';
import { getDaytimeIcon } from '../../utils/general-utils';
import { CalendarIcon, OpenCalendarIcon } from '../animated-icons/calendar';
import { ScheduleModalProps, ScheduleOptionsProps } from './types';
import { GoogleCalendarOption } from '../google-calendar-option';
import { RecurrenceIcon } from '../animated-icons/recurrence-icon';
import { RecurrenceType } from '../../scenes/home/types';
import {
  CurrentScheduleBadge,
  CurrentScheduleText,
  ModeButton,
  ModeButtonText,
  ModeSelectorContainer,
  OptionsContainer,
  RecurrenceChip,
  RecurrenceChipsContainer,
  RecurrenceSectionContainer,
  RecurrenceToggleButton,
  RecurrenceToggleLeft,
  RecurrenceToggleText,
  RecurrenceToggleValue,
  RecurrenceToggleChevron,
  RecurrenceChipText,
  SelectedDateBadge,
  SelectedDateText,
  TimeChip,
  TimeChipsContainer,
  TimeChipText,
  TimeStageContainer,
} from './styles';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { IconedOptionTile } from '../iconed-option-tile';
import { ScrollView, Text, View } from 'react-native';
import { OptionTile } from '../option-tile';
import { BackButton } from '../back-button';
import DatePicker from 'react-native-date-picker';
import { PopupButton } from '../popup-modal/types';
import {
  combineDateAndTime,
  formatScheduledDateTime,
  formatToLocaleTime,
} from '../../utils/date-utils';

const EnteringAnimation = FadeIn.duration(400);

const DayCalendarIcon: React.FC<{ day: number }> = ({ day }) => {
  return (
    <View
      style={{
        width: 35,
        height: 34,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'white',
      }}>
      <View
        style={{
          width: 34,
          height: 7,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: 'white',
        }}
      />
      <Text style={{ textAlign: 'center', fontSize: 17, color: 'white' }}>
        {day ?? 'XX'}
      </Text>
    </View>
  );
};

const NextDays: React.FC<{ onScheduleToDay: (date: Date) => void }> = ({
  onScheduleToDay,
}) => {
  const { t } = useTranslation();
  const daysOfWeek = useMemo(
    () => [
      t('scheduleDays.sunday'),
      t('scheduleDays.monday'),
      t('scheduleDays.tuesday'),
      t('scheduleDays.wednesday'),
      t('scheduleDays.thursday'),
      t('scheduleDays.friday'),
      t('scheduleDays.saturday'),
    ],
    [t],
  );

  const next7Days = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from({ length: 7 }, (_, i) => {
      const nextDate = new Date(tomorrow);
      nextDate.setDate(tomorrow.getDate() + i + 1);
      return {
        dayOfWeek: daysOfWeek[nextDate.getDay()],
        dayOfMonth: nextDate.getDate(),
        date: nextDate,
      };
    });
  }, [daysOfWeek]);

  return (
    <Animated.View entering={EnteringAnimation} style={{ height: 124 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}>
        {next7Days.map((dayInfo, index) => (
          <View key={index} style={{ marginRight: 10 }}>
            <OptionTile
              TopComponent={<DayCalendarIcon day={dayInfo.dayOfMonth} />}
              label={dayInfo.dayOfWeek}
              onPress={() => {
                onScheduleToDay(dayInfo.date);
              }}
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const ScheduleOptions: React.FC<ScheduleOptionsProps> = memo(
  ({
    hasTime,
    onToggleHasTime,
    recurrence,
    onSelectRecurrence,
    onSchedule,
    onPressDate,
    onPressNextDays,
    currentDate,
    currentTime,
  }) => {
    const { t } = useTranslation();
    const [isRecurrenceExpanded, setIsRecurrenceExpanded] = useState(false);

    const effectiveDate = useMemo(() => {
      if (!currentDate) {
        return null;
      }
      if (hasTime && currentTime) {
        return combineDateAndTime(currentDate, currentTime);
      }
      return currentDate;
    }, [currentDate, hasTime, currentTime]);

    const currentScheduledText = useMemo(() => {
      if (!effectiveDate) {
        return null;
      }
      const formatted = formatScheduledDateTime(
        effectiveDate,
        hasTime,
        t,
      );
      const recurrenceSuffix = recurrence
        ? ` • ${t(`recurrence.${recurrence}Short`, { defaultValue: recurrence })}`
        : '';
      return `${t('scheduleOptions.scheduledFor', {
        defaultValue: 'Agendado para:',
      })} ${formatted}${recurrenceSuffix}`;
    }, [effectiveDate, hasTime, recurrence, t]);

    const handleScheduleToday = useCallback(() => {
      onSchedule(new Date());
    }, [onSchedule]);

    const handleScheduleTomorrow = useCallback(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      onSchedule(tomorrow);
    }, [onSchedule]);

    const recurrenceOptions = useMemo(
      () => [
        {
          key: 'none',
          value: undefined as RecurrenceType | undefined,
          label: `✕ ${t('recurrence.none')}`,
        },
        {
          key: 'daily',
          value: 'daily' as RecurrenceType,
          label: `🔁 ${t('recurrence.dailyShort', { defaultValue: 'Diariamente' })}`,
        },
        {
          key: 'weekly',
          value: 'weekly' as RecurrenceType,
          label: `📅 ${t('recurrence.weeklyShort', { defaultValue: 'Semanalmente' })}`,
        },
        {
          key: 'monthly',
          value: 'monthly' as RecurrenceType,
          label: `🗓️ ${t('recurrence.monthlyShort', { defaultValue: 'Mensalmente' })}`,
        },
        {
          key: 'yearly',
          value: 'yearly' as RecurrenceType,
          label: `📆 ${t('recurrence.yearlyShort', { defaultValue: 'Anualmente' })}`,
        },
      ],
      [t],
    );

    const currentRecurrenceLabel = useMemo(() => {
      if (!recurrence) return t('recurrence.none');
      return t(`recurrence.${recurrence}Short`, { defaultValue: recurrence });
    }, [recurrence, t]);

    const handleSelectRecurrence = useCallback(
      (val?: RecurrenceType) => {
        onSelectRecurrence(val);
        if (!val) {
          setIsRecurrenceExpanded(false);
        }
      },
      [onSelectRecurrence],
    );

    return (
      <Animated.View entering={EnteringAnimation} style={{ alignItems: 'center' }}>
        {/* Current Schedule Badge if already scheduled */}
        {currentScheduledText && (
          <CurrentScheduleBadge entering={FadeIn.duration(200)}>
            <CurrentScheduleText>
              📅 {currentScheduledText}
            </CurrentScheduleText>
          </CurrentScheduleBadge>
        )}

        {/* Mode Selector: All Day vs With Time */}
        <ModeSelectorContainer>
          <ModeButton
            active={!hasTime}
            onPress={() => onToggleHasTime(false)}>
            <ModeButtonText active={!hasTime}>
              ☀️ {t('scheduleMode.allDay')}
            </ModeButtonText>
          </ModeButton>
          <ModeButton
            active={hasTime}
            onPress={() => onToggleHasTime(true)}>
            <ModeButtonText active={hasTime}>
              ⏰ {t('scheduleMode.withTime')}
            </ModeButtonText>
          </ModeButton>
        </ModeSelectorContainer>

        {/* 4 Option Tiles (Hoje, Amanhã, Próximos dias, Data) */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 252,
          }}>
          <IconedOptionTile
            Icon={getDaytimeIcon()}
            label={t('scheduleOptions.today')}
            onPress={handleScheduleToday}
            autoAnimateIcon
          />
          <IconedOptionTile
            Icon={OpenCalendarIcon}
            label={t('scheduleOptions.tomorrow')}
            onPress={handleScheduleTomorrow}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 252,
            marginTop: 10,
            marginBottom: 14,
          }}>
          <IconedOptionTile
            Icon={CalendarIcon}
            label={t('scheduleOptions.nextDays')}
            onPress={onPressNextDays}
            autoAnimateIcon
            iconAnimationDelay={1200}
          />
          <IconedOptionTile
            Icon={CalendarIcon}
            label={t('scheduleOptions.date')}
            onPress={onPressDate}
            autoAnimateIcon
            iconAnimationDelay={1200}
          />
        </View>

        {/* Collapsible Recurrence Selector */}
        <RecurrenceSectionContainer>
          <RecurrenceToggleButton
            active={!!recurrence}
            onPress={() => setIsRecurrenceExpanded(prev => !prev)}>
            <RecurrenceToggleLeft>
              <RecurrenceIcon size={13} autoPlay={false} />
              <RecurrenceToggleText active={!!recurrence}>
                {t('recurrence.repeatTitle', { defaultValue: 'Repetir' })}:
              </RecurrenceToggleText>
              <RecurrenceToggleValue active={!!recurrence}>
                {currentRecurrenceLabel}
              </RecurrenceToggleValue>
            </RecurrenceToggleLeft>
            <RecurrenceToggleChevron>
              {isRecurrenceExpanded ? '▲' : '▼'}
            </RecurrenceToggleChevron>
          </RecurrenceToggleButton>

          {isRecurrenceExpanded && (
            <Animated.View entering={FadeIn.duration(200)}>
              <RecurrenceChipsContainer>
                {recurrenceOptions.map(opt => {
                  const isSelected = recurrence === opt.value;
                  return (
                    <RecurrenceChip
                      key={opt.key}
                      selected={isSelected}
                      onPress={() => handleSelectRecurrence(opt.value)}>
                      <RecurrenceChipText selected={isSelected}>
                        {opt.label}
                      </RecurrenceChipText>
                    </RecurrenceChip>
                  );
                })}
              </RecurrenceChipsContainer>
            </Animated.View>
          )}
        </RecurrenceSectionContainer>
      </Animated.View>
    );
  },
);

const DatePickerComponent: React.FC<{
  date: Date;
  onDateSelected: (date: Date) => void;
}> = ({ date, onDateSelected }) => {
  return (
    <Animated.View
      entering={EnteringAnimation}
      style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
      <DatePicker
        date={date}
        onDateChange={onDateSelected}
        mode="date"
        theme="dark"
      />
    </Animated.View>
  );
};

const TimePickerComponent: React.FC<{
  selectedDate: Date;
  time: Date;
  onTimeChange: (time: Date) => void;
}> = ({ selectedDate, time, onTimeChange }) => {
  const { t } = useTranslation();

  const handleShortcutPress = useCallback(
    (hour: number, minute: number = 0) => {
      const newTime = new Date(time);
      newTime.setHours(hour, minute, 0, 0);
      onTimeChange(newTime);
    },
    [time, onTimeChange],
  );

  const shortcuts = [
    { label: '09:00', hour: 9, min: 0 },
    { label: '14:00', hour: 14, min: 0 },
    { label: '18:00', hour: 18, min: 0 },
    { label: '20:00', hour: 20, min: 0 },
  ];

  const currentHour = time.getHours();
  const currentMin = time.getMinutes();

  return (
    <TimeStageContainer>
      <SelectedDateBadge>
        <SelectedDateText>
          📅 {formatScheduledDateTime(selectedDate, false, t)}
        </SelectedDateText>
      </SelectedDateBadge>

      <TimeChipsContainer>
        {shortcuts.map(s => {
          const isSelected = currentHour === s.hour && currentMin === s.min;
          return (
            <TimeChip
              key={s.label}
              selected={isSelected}
              onPress={() => handleShortcutPress(s.hour, s.min)}>
              <TimeChipText selected={isSelected}>{s.label}</TimeChipText>
            </TimeChip>
          );
        })}
      </TimeChipsContainer>

      <View style={{ height: 140, justifyContent: 'center', alignItems: 'center' }}>
        <DatePicker
          date={time}
          onDateChange={onTimeChange}
          mode="time"
          theme="dark"
          is24hourSource="locale"
        />
      </View>
    </TimeStageContainer>
  );
};

type PopupStage = {
  title: string;
  Icon: React.FC<any>;
  Content: React.ReactNode;
  ActionButton: React.ReactNode | undefined;
  buttons: PopupButton[];
  onRequestClose?: () => void;
};

enum PopupStageEnum {
  INITIAL = 'initial',
  NEXT_DAYS = 'nextDays',
  DATE = 'date',
  TIME = 'time',
}

const ScheduleModal: React.FC<ScheduleModalProps> = memo(
  ({
    isVisible,
    currentDate,
    hasTimeInitial,
    currentRecurrence,
    tuduTitle,
    listName,
    onModalClose,
    onSchedule,
  }) => {
    const { t } = useTranslation();
    const [popupStage, setPopupStage] = useState(PopupStageEnum.INITIAL);
    const [previousStage, setPreviousStage] = useState(PopupStageEnum.INITIAL);
    const [hasTime, setHasTime] = useState(hasTimeInitial ?? false);
    const [addToGoogleCalendar, setAddToGoogleCalendar] = useState(false);
    const [recurrence, setRecurrence] = useState<RecurrenceType | undefined>(
      currentRecurrence,
    );
    const [internalDate, setInternalDate] = useState(currentDate || new Date());
    const [targetDateForTime, setTargetDateForTime] = useState(
      currentDate || new Date(),
    );
    const [internalTime, setInternalTime] = useState(() => {
      if (currentDate && hasTimeInitial) {
        return new Date(currentDate);
      }
      const defaultTime = new Date();
      defaultTime.setMinutes(0, 0, 0);
      defaultTime.setHours(defaultTime.getHours() + 1);
      return defaultTime;
    });

    useEffect(() => {
      setInternalDate(currentDate ?? new Date());
      setHasTime(hasTimeInitial ?? false);
      setRecurrence(currentRecurrence);
      setAddToGoogleCalendar(false);
      if (currentDate && hasTimeInitial) {
        setInternalTime(new Date(currentDate));
      }
    }, [currentDate, hasTimeInitial, currentRecurrence]);

    const handleModalClose = useCallback(() => {
      setPopupStage(PopupStageEnum.INITIAL);
      setAddToGoogleCalendar(false);
      onModalClose();
    }, [onModalClose]);

    const handleScheduleToDate = useCallback(
      (date: Date, withTime: boolean = false) => {
        console.log(`📅 [ScheduleModal] Confirmando agendamento:`, {
          tuduTitle,
          listName,
          dateISO: date.toISOString(),
          dateLocal: date.toString(),
          withTime,
          recurrence,
          addToGoogleCalendar,
        });
        onSchedule(date, withTime, recurrence, addToGoogleCalendar);
        handleModalClose();
      },
      [onSchedule, recurrence, addToGoogleCalendar, handleModalClose, listName, tuduTitle],
    );

    const handleInitialDateChoice = useCallback(
      (chosenDate: Date) => {
        if (!hasTime) {
          handleScheduleToDate(chosenDate, false);
        } else {
          setTargetDateForTime(chosenDate);
          setPreviousStage(PopupStageEnum.INITIAL);
          setPopupStage(PopupStageEnum.TIME);
        }
      },
      [hasTime, handleScheduleToDate],
    );

    const onPressDate = useCallback(() => {
      setPopupStage(PopupStageEnum.DATE);
    }, []);

    const onPressNextDays = useCallback(() => {
      setPopupStage(PopupStageEnum.NEXT_DAYS);
    }, []);

    const handleNextDaysChoice = useCallback(
      (chosenDate: Date) => {
        if (!hasTime) {
          handleScheduleToDate(chosenDate, false);
        } else {
          setTargetDateForTime(chosenDate);
          setPreviousStage(PopupStageEnum.NEXT_DAYS);
          setPopupStage(PopupStageEnum.TIME);
        }
      },
      [hasTime, handleScheduleToDate],
    );

    const handleDatePickerConfirm = useCallback(() => {
      if (!hasTime) {
        handleScheduleToDate(internalDate, false);
      } else {
        setTargetDateForTime(internalDate);
        setPreviousStage(PopupStageEnum.DATE);
        setPopupStage(PopupStageEnum.TIME);
      }
    }, [hasTime, internalDate, handleScheduleToDate]);

    const handleTimeConfirm = useCallback(() => {
      const finalDateTime = combineDateAndTime(targetDateForTime, internalTime);
      handleScheduleToDate(finalDateTime, true);
    }, [targetDateForTime, internalTime, handleScheduleToDate]);

    const handleConfirmExistingDate = useCallback(() => {
      if (currentDate) {
        if (hasTime) {
          setTargetDateForTime(currentDate);
          setPreviousStage(PopupStageEnum.INITIAL);
          setPopupStage(PopupStageEnum.TIME);
        } else {
          handleScheduleToDate(currentDate, false);
        }
      }
    }, [currentDate, hasTime, handleScheduleToDate]);

    const cancelButton: PopupButton = useMemo(
      () => ({ label: t('buttons.cancel'), onPress: handleModalClose }),
      [handleModalClose, t],
    );

    const initialButtons = useMemo(() => {
      const buttons: PopupButton[] = [];
      if (currentDate) {
        buttons.push({
          label: hasTime
            ? t('scheduleOptions.pickTime', { defaultValue: 'Definir horário ➔' })
            : t('buttons.confirm'),
          onPress: handleConfirmExistingDate,
          highlight: true,
        });
      }
      buttons.push(cancelButton);
      return buttons;
    }, [currentDate, hasTime, handleConfirmExistingDate, cancelButton, t]);

    const popupStages: Record<PopupStageEnum, PopupStage> = useMemo(
      () => ({
        [PopupStageEnum.INITIAL]: {
          title: t('popupTitles.schedule'),
          Icon: CalendarIcon,
          Content: (
            <ScheduleOptions
              hasTime={hasTime}
              onToggleHasTime={setHasTime}
              recurrence={recurrence}
              onSelectRecurrence={setRecurrence}
              onSchedule={handleInitialDateChoice}
              onPressNextDays={onPressNextDays}
              onPressDate={onPressDate}
              currentDate={currentDate}
              currentTime={internalTime}
            />
          ),
          ActionButton: (
            <GoogleCalendarOption
              isSelected={addToGoogleCalendar}
              onToggle={setAddToGoogleCalendar}
            />
          ),
          buttons: initialButtons,
          onRequestClose: handleModalClose,
        },
        [PopupStageEnum.NEXT_DAYS]: {
          title: t('popupTitles.scheduleToNext'),
          Icon: OpenCalendarIcon,
          Content: <NextDays onScheduleToDay={handleNextDaysChoice} />,
          ActionButton: (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <GoogleCalendarOption
                isSelected={addToGoogleCalendar}
                onToggle={setAddToGoogleCalendar}
                style={{ marginRight: 8 }}
              />
              <BackButton onPress={() => setPopupStage(PopupStageEnum.INITIAL)} />
            </View>
          ),
          buttons: [cancelButton],
          onRequestClose: () => setPopupStage(PopupStageEnum.INITIAL),
        },
        [PopupStageEnum.DATE]: {
          title: t('popupTitles.scheduleToDate'),
          Icon: CalendarIcon,
          Content: (
            <DatePickerComponent
              date={internalDate}
              onDateSelected={setInternalDate}
            />
          ),
          ActionButton: (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <GoogleCalendarOption
                isSelected={addToGoogleCalendar}
                onToggle={setAddToGoogleCalendar}
                style={{ marginRight: 8 }}
              />
              <BackButton onPress={() => setPopupStage(PopupStageEnum.INITIAL)} />
            </View>
          ),
          buttons: [
            {
              label: hasTime
                ? t('scheduleOptions.pickTime', { defaultValue: 'Definir horário ➔' })
                : t('buttons.confirm'),
              onPress: handleDatePickerConfirm,
              highlight: true,
            },
            cancelButton,
          ],
          onRequestClose: () => setPopupStage(PopupStageEnum.INITIAL),
        },
        [PopupStageEnum.TIME]: {
          title: t('popupTitles.scheduleTime'),
          Icon: CalendarIcon,
          Content: (
            <TimePickerComponent
              selectedDate={targetDateForTime}
              time={internalTime}
              onTimeChange={setInternalTime}
            />
          ),
          ActionButton: (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <GoogleCalendarOption
                isSelected={addToGoogleCalendar}
                onToggle={setAddToGoogleCalendar}
                style={{ marginRight: 8 }}
              />
              <BackButton onPress={() => setPopupStage(previousStage)} />
            </View>
          ),
          buttons: [
            {
              label: t('buttons.confirmAt', {
                time: formatToLocaleTime(internalTime),
                defaultValue: `Confirmar às ${formatToLocaleTime(internalTime)}`,
              }),
              onPress: handleTimeConfirm,
              highlight: true,
            },
            cancelButton,
          ],
          onRequestClose: () => setPopupStage(previousStage),
        },
      }),
      [
        hasTime,
        recurrence,
        addToGoogleCalendar,
        handleInitialDateChoice,
        onPressNextDays,
        onPressDate,
        currentDate,
        initialButtons,
        handleNextDaysChoice,
        internalDate,
        handleDatePickerConfirm,
        targetDateForTime,
        internalTime,
        previousStage,
        handleTimeConfirm,
        cancelButton,
        handleModalClose,
        t,
      ],
    );

    if (!isVisible) return null;

    return (
      <PopupModal
        visible
        onTouchBackground={handleModalClose}
        onRequestClose={popupStages[popupStage].onRequestClose}
        title={popupStages[popupStage].title}
        buttons={popupStages[popupStage].buttons}
        ActionButton={popupStages[popupStage].ActionButton}
        Icon={popupStages[popupStage].Icon}>
        <OptionsContainer>
          {popupStages[popupStage].Content}
        </OptionsContainer>
      </PopupModal>
    );
  },
);

export { ScheduleModal };