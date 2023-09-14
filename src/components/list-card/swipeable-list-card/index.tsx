import React, {memo, useMemo} from 'react';
import {useTheme} from 'styled-components/native';
import {FolderIcon} from '../../animated-icons/folder-icon';
import {OptionsArrowDownIcon} from '../../animated-icons/options-arrow-down-icon';
import {SwipeableCard} from '../../swipeable-card';
import {SwipeableOption} from '../../swipeable-card/types';
import {SwipeableListCardProps} from './types';

const SwipeableListCard: React.FC<SwipeableListCardProps> = memo(
  ({children, isHighlighted, enabled = false}) => {
    const theme = useTheme();

    const rightOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: OptionsArrowDownIcon,
          text: 'Options',
          onPress: () => console.log('Options'),
        },
      ],
      [],
    );

    const leftOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: FolderIcon,
          text: 'Archive',
          onPress: () => console.log('Archive'),
        },
      ],
      [],
    );

    return (
      <SwipeableCard
        enabled={enabled}
        backgroundColor={
          isHighlighted
            ? theme.colors.listCardHighlighted
            : theme.colors.listCard
        }
        rightOptions={rightOptions}
        leftOptions={leftOptions}
        fullWidthOnLeftOptions
        onSwipeRight={() => console.log('swipeRight')}
        optionsBackgroundColor={theme.colors.primary}>
        {children}
      </SwipeableCard>
    );
  },
);

export {SwipeableListCard};
