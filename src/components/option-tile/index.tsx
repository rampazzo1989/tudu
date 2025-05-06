import React from 'react';
import { OptionTileContainer, OptionTileText, styles } from './styles';
import { OptionTileProps } from './types';

const OptionTile: React.FC<OptionTileProps> = ({ Icon, label, onPress, iconAnimationDelay }) => {
    return (<OptionTileContainer onPress={onPress}>
        <Icon
            autoPlay
            autoPlayDelay={iconAnimationDelay}
            style={styles.icon}
            size={38} />
        <OptionTileText>{label}</OptionTileText>
    </OptionTileContainer>);
};

export { OptionTile };