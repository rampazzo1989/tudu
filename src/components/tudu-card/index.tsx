import React, { memo, useCallback, useEffect, useState } from 'react';
import { toggle } from '../../utils/state-utils';
import { CalendarIcon } from '../animated-icons/calendar';
import { ListDefaultIcon } from '../animated-icons/list-default-icon';
import { SunIcon } from '../animated-icons/sun-icon';
import { Star } from '../star';
import { TuduCheckbox } from '../tudu-checkbox';
import {
  Card,
  CheckAndTextContainer,
  ChipsRow,
  Label,
  LabelAndAdditionalInfoContainer,
  StarContainer,
} from './styles';
import { TuduAdditionalInformationOriginType, TuduCardProps } from './types';
import { RecurrenceIcon } from '../animated-icons/recurrence-icon';
import { useTranslation } from 'react-i18next';
import { TagChip } from '../tag-chip';

const TuduCard = memo<TuduCardProps>(
  ({
    data,
    onPress,
    onStarPress,
    additionalInfo,
  }) => {
    const { t } = useTranslation();
    const [internalDone, setInternalDone] = useState(data.done);
    const [internalStarred, setInternalStarred] = useState(!!data.starred);

    useEffect(() => {
      setInternalDone(data.done);
      setInternalStarred(!!data.starred);
    }, [data.done, data.starred]);

    const handleTuduPress = useCallback(() => {
      setInternalDone(toggle);
    
      const toggleTimeout = data.done ? 0 : 100;
      setTimeout(() => onPress(data), toggleTimeout);
    }, [data, onPress]);

    const handleStarPress = useCallback(() => {
      setInternalStarred(toggle);
      setTimeout(() => onStarPress(data), 100);
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
        switch (type) {
          case 'today':
            return <SunIcon size={12} />;
          case 'list':
            return <ListDefaultIcon size={10} />;
          case 'scheduled':
            return <CalendarIcon size={11} />;
        }
      },
      [],
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
      <Card
        scaleFactor={0.03}
        onPress={handleTuduPress}
        onLongPress={() => {
          return undefined;
        }}
        done={internalDone}>
        <StarContainer>
          <Star checked={internalStarred} onPress={handleStarPress} />
        </StarContainer>
        <CheckAndTextContainer done={data.done}>
          <LabelAndAdditionalInfoContainer>
            <Label done={internalDone}>{data.label}</Label>
            {(additionalInfo || data.recurrence) && (
              <ChipsRow>
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
              </ChipsRow>
            )}
          </LabelAndAdditionalInfoContainer>
          <TuduCheckbox checked={internalDone} onPress={handleTuduPress} />
        </CheckAndTextContainer>
      </Card>
    );
  },
);

export { TuduCard };

