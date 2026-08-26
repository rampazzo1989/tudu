import React from 'react';
import { OptionTileContainer, OptionTileText, styles } from './styles';
import { IconedOptionTileProps } from './types';
import { FadeIn } from 'react-native-reanimated';

const IconedOptionTile: React.FC<IconedOptionTileProps> = ({
  Icon,
  label,
  onPress,
  autoAnimateIcon,
  iconAnimationDelay,
}) => {
  return (
    <OptionTileContainer onPress={onPress} entering={FadeIn.duration(200)}>
      <Icon
        autoPlay={autoAnimateIcon}
        autoPlayDelay={iconAnimationDelay}
        style={styles.icon}
        size={38}
      />
      <OptionTileText>{label}</OptionTileText>
    </OptionTileContainer>
  );
};

export { IconedOptionTile };