import React, { memo, useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { toggle } from '../../utils/state-utils';
import { Star } from '../star';
import { TuduCheckbox } from '../tudu-checkbox';
import { styles } from './styles';
import { TuduAdditionalInformationOriginType, TuduCardProps } from './types';
import { RecurrenceIcon } from '../animated-icons/recurrence-icon';
import { useTranslation } from 'react-i18next';
import { TagChip } from '../tag-chip';
import { CalendarChipSvg, ListChipSvg, SunChipSvg } from '../../assets/static/tudu-icons';

const TuduCard = memo<TuduCardProps>(
  ({
    data,
    onPress,
    onStarPress,
    additionalInfo,
  }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [optimisticDone, setOptimisticDone] = useState<boolean | null>(null);
    const [optimisticStarred, setOptimisticStarred] = useState<boolean | null>(null);

    const isDone = optimisticDone !== null ? optimisticDone : data.done;
    const isStarred = optimisticStarred !== null ? optimisticStarred : !!data.starred;

    const handleTuduPress = useCallback(() => {
      setOptimisticDone(!data.done);
    
      const toggleTimeout = data.done ? 0 : 100;
      setTimeout(() => {
        onPress(data);
        setOptimisticDone(null);
      }, toggleTimeout);
    }, [data, onPress]);

    const handleStarPress = useCallback(() => {
      setOptimisticStarred(!data.starred);
      setTimeout(() => {
        onStarPress(data);
        setOptimisticStarred(null);
      }, 100);
    }, [data, onStarPress]);

    const getAdditionalInfoVariant = useCallback(
      (type: TuduAdditionalInformationOriginType) => {
        switch (type) {
          case 'today':
            return 'today';
          case 'list':
            return 'list';
          case 'scheduled':
          default:
            return 'primary';
        }
      },
      [],
    );

    const getAdditionalInfoIcon = useCallback(
      (type: TuduAdditionalInformationOriginType) => {
        const iconColor = theme.colors.contrastColor || 'white';
        switch (type) {
          case 'today':
            return <SunChipSvg size={12} color={iconColor} />;
          case 'list':
            return <ListChipSvg size={10} color={iconColor} />;
          case 'scheduled':
            return <CalendarChipSvg size={11} color={iconColor} />;
        }
      },
      [theme.colors.contrastColor],
    );

    const getAdditionalInformationLabel = useCallback(
      (
        informationType: TuduAdditionalInformationOriginType,
        label: string,
      ) => {
        switch (informationType) {
          case 'today':
          case 'scheduled':
            return label;
          case 'list':
          default:
            return `${t('labels.in')} ${label}`;
        }
      },
      [t],
    );

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDone
              ? theme.colors.tuduCardDone
              : theme.colors.tuduCard,
            borderColor: isDone
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(255, 255, 255, 0.06)',
          },
        ]}>
        <View style={styles.starContainer}>
          <Star checked={isStarred} onPress={handleStarPress} />
        </View>
        <View
          style={[
            styles.checkAndTextContainer,
            { opacity: isDone ? 0.35 : 1 },
          ]}>
          <View style={styles.labelAndAdditionalInfoContainer}>
            <Text
              style={[
                styles.label,
                {
                  fontFamily: theme.fonts.itemLabel,
                  color: theme.colors.text,
                  textDecorationLine: isDone ? 'line-through' : 'none',
                },
              ]}>
              {data.label}
            </Text>
            {(additionalInfo || data.recurrence) && (
              <View style={styles.chipsRow}>
                {additionalInfo && (
                  <TagChip
                    label={getAdditionalInformationLabel(
                      additionalInfo.originType,
                      additionalInfo.label,
                    )}
                    Icon={getAdditionalInfoIcon(additionalInfo.originType)}
                    variant={getAdditionalInfoVariant(additionalInfo.originType)}
                    size="small"
                  />
                )}
                {data.recurrence && (
                  <TagChip
                    label={t(`recurrence.${data.recurrence}`)}
                    Icon={<RecurrenceIcon size={10} autoPlay />}
                    variant="recurrence"
                    size="small"
                  />
                )}
              </View>
            )}
          </View>
          <TuduCheckbox checked={isDone} onPress={handleTuduPress} />
        </View>
      </View>
    );
  },
);

export { TuduCard };
