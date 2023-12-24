import React, {memo, useCallback, useEffect, useState} from 'react';
import {isToday} from '../../utils/date-utils';
import {toggle} from '../../utils/state-utils';
import {CalendarIcon} from '../animated-icons/calendar';
import {ListDefaultIcon} from '../animated-icons/list-default-icon';
import {SunIcon} from '../animated-icons/sun-icon';
import {Star} from '../star';
import {TuduCheckbox} from '../tudu-checkbox';
import {
  AdditionalInfoContainer,
  AdditionalInfoLabel,
  Card,
  CheckAndTextContainer,
  Label,
  LabelAndAdditionalInfoContainer,
  StarContainer,
} from './styles';
import {SwipeableTuduCard} from './swipeable-tudu-card';
import {TuduAdditionalInformationOriginType, TuduCardProps} from './types';

const TuduCard = memo<TuduCardProps>(
  ({
    data,
    onPress,
    onDelete,
    onEdit,
    onStarPress,
    onSendToOrRemoveFromToday,
    additionalInfo,
  }) => {
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
            return `in ${label}`;
        }
      },
      [],
    );

    const handleStarPress = useCallback(() => {
      setInternalStarred(toggle);
      setTimeout(() => onStarPress(data), 100);
    }, [data, onStarPress]);

    return (
      <Card
        scaleFactor={0.03}
        onPress={handleTuduPress}
        onLongPress={() => {
          return undefined;
        }}
        done={internalDone}>
        <SwipeableTuduCard
          done={internalDone}
          onDelete={onDelete}
          onEdit={onEdit}
          isOnToday={data.dueDate && isToday(data.dueDate)}
          onSendToOrRemoveFromToday={onSendToOrRemoveFromToday}>
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
                </AdditionalInfoContainer>
              )}
            </LabelAndAdditionalInfoContainer>
            <TuduCheckbox checked={internalDone} onPress={handleTuduPress} />
          </CheckAndTextContainer>
          {/* <Favorite /> */}
        </SwipeableTuduCard>
      </Card>
    );
  },
);

export {TuduCard};
