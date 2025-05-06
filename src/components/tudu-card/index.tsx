import React, { memo, useCallback, useEffect, useState } from 'react';
import { toggle } from '../../utils/state-utils';
import { CalendarIcon } from '../animated-icons/calendar';
import { ListDefaultIcon } from '../animated-icons/list-default-icon';
import { SunIcon } from '../animated-icons/sun-icon';
import { Star } from '../star';
import { TuduCheckbox } from '../tudu-checkbox';
import {
  AdditionalInfoContainer,
  AdditionalInfoLabel,
  Card,
  CheckAndTextContainer,
  Label,
  LabelAndAdditionalInfoContainer,
  RecurrenceInfoContainer,
  RecurrenceInfoLabel,
  StarContainer,
} from './styles';
import { TuduAdditionalInformationOriginType, TuduCardProps } from './types';
import { RecurrenceType } from '../../scenes/home/types';
import { RecurrenceIcon } from '../animated-icons/recurrence-icon';
import { useTranslation } from 'react-i18next';

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

    const AdditionalInfoIcon = useCallback(
      (informationType: TuduAdditionalInformationOriginType) => {
        switch (informationType) {
          case 'today':
            return <SunIcon size={12} />;
          case 'list':
            return <ListDefaultIcon size={10} />;
          case 'scheduled':
            return <CalendarIcon size={12} />;
        }
      },
      [],
    );

    const getAdditionalInformationLabel = useCallback(
      (informationType: TuduAdditionalInformationOriginType, label: string) => {
        switch (informationType) {
          case 'today':
            return label;
          case 'list':
          default:
            return `${t('labels.in')} ${label}`;
        }
      },
      [],
    );

    const handleStarPress = useCallback(() => {
      setInternalStarred(toggle);
      setTimeout(() => onStarPress(data), 100);
    }, [data, onStarPress]);

    const getRecurrenceInfoLabel = useCallback(
      (recurrence: RecurrenceType) => {
        return t(`recurrence.${recurrence}`);
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
            {additionalInfo && (
              <AdditionalInfoContainer>
                {AdditionalInfoIcon(additionalInfo.originType)}
                <AdditionalInfoLabel>
                  {getAdditionalInformationLabel(
                    additionalInfo.originType,
                    additionalInfo.label,
                  )}
                </AdditionalInfoLabel>
                {data.recurrence && 
                <RecurrenceInfoContainer>
                  <RecurrenceIcon size={10} autoPlay />
                  <RecurrenceInfoLabel>
                    {getRecurrenceInfoLabel(data.recurrence)}
                  </RecurrenceInfoLabel>
                </RecurrenceInfoContainer>}
              </AdditionalInfoContainer>
            )}
          </LabelAndAdditionalInfoContainer>
          <TuduCheckbox checked={internalDone} onPress={handleTuduPress} />
        </CheckAndTextContainer>
      </Card>
    );
  },
);

export { TuduCard };
