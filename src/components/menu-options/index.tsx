import React, {memo} from 'react';
import {useTheme} from 'styled-components/native';
import {GradientSeparator} from '../gradient-separator';
import {
  IconContainer,
  Label,
  OptionContainer,
  OptionLine,
  styles,
} from './styles';
import {MenuOptionsProps} from './types';

const MenuOptions: React.FC<MenuOptionsProps> = memo(({options, closeMenu}) => {
  const theme = useTheme();
  return (
    <>
      {options.map(({Icon, label, onPress}, index, {length}) => {
        const isLastItem = index === length - 1;

        const handlePress = () => {
          onPress();
          closeMenu?.();
        };

        return (
          <OptionContainer key={label}>
            <OptionLine onPress={handlePress}>
              <IconContainer>
                <Icon style={styles.icon} />
              </IconContainer>
              <Label>{label}</Label>
            </OptionLine>
            {!isLastItem && (
              <GradientSeparator
                colorArray={theme.colors.menuSeparatorGradientColors}
              />
            )}
          </OptionContainer>
        );
      })}
    </>
  );
});

export {MenuOptions};
