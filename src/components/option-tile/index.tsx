import React from 'react';
import { OptionTileProps } from './types';
import { FadeIn } from 'react-native-reanimated';
import { OptionTileContainer, OptionTileText } from './styles';

const OptionTile: React.FC<OptionTileProps> = ({ TopComponent, label, onPress }) => {
    return (
        <OptionTileContainer onPress={onPress} entering={FadeIn.duration(1000)}>
            {TopComponent && <TopComponent />}
            <OptionTileText>{label}</OptionTileText>
        </OptionTileContainer>
    );
};

export { OptionTile };