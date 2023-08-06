import React, {memo} from 'react';
import {useTheme} from 'styled-components/native';
import {GradientSeparator} from '../gradient-separator';
import {Label, OptionContainer, OptionLine} from './styles';
import {MenuOptionsProps} from './types';

const MenuOptions: React.FC<MenuOptionsProps> = memo(({options}) => {
  const theme = useTheme();
  return (
    <>
      {options.map(({Icon, label, onPress}, index, {length}) => {
        const isLastItem = index === length - 1;
        console.log({isLastItem});

        return (
          <OptionContainer key={label}>
            <OptionLine onPress={onPress}>
              <Icon animateWhenIdle={false} style={{maxHeight: 20}} />
              <Label>{label}</Label>
            </OptionLine>
            {!isLastItem && (
              <GradientSeparator
                colorArray={theme.colors.defaultSeparatorGradientColors}
                marginTop={0}
              />
            )}
          </OptionContainer>
        );
      })}
    </>
  );
});

export {MenuOptions};
