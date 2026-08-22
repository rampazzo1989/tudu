import React, {memo} from 'react';
import {ShrinkableView} from '../shrinkable-view';
import {ChipContainer, ChipText, IconSlot} from './styles';
import {TagChipProps} from './types';

const TagChip: React.FC<TagChipProps> = memo(
  ({label, Icon, variant = 'neutral', size = 'small', onPress, style}) => {
    const content = (
      <ChipContainer variant={variant} size={size} style={style}>
        {Icon && <IconSlot>{Icon}</IconSlot>}
        <ChipText variant={variant} size={size} numberOfLines={1}>
          {label}
        </ChipText>
      </ChipContainer>
    );

    if (onPress) {
      return (
        <ShrinkableView onPress={onPress} scaleFactor={0.05}>
          {content}
        </ShrinkableView>
      );
    }

    return content;
  },
);

export {TagChip};
