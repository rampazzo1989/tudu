import React from 'react';
import { OptionButtonContainer, OptionButtonText, styles } from './styles';
import { OptionButtonProps } from './types';

const OptionButton: React.FC<OptionButtonProps> = ({ Icon, label, onPress, iconAnimationDelay, autoAnimateIcon, ...props }) => {
    return (
        <OptionButtonContainer onPress={onPress} {...props}>
            <Icon
                autoPlay={autoAnimateIcon}
                autoPlayDelay={iconAnimationDelay}
                style={styles.icon}
                size={24} />
            <OptionButtonText>{label}</OptionButtonText>
        </OptionButtonContainer>
    );
};

export { OptionButton };