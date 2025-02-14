import React, {memo} from 'react';
import {
  BottomFadingGradient,
  PageContentContainer,
  TopFadingGradient,
} from './styles';
import {PageContentProps} from './types';
import {useTheme} from 'styled-components/native';
import { View } from 'react-native';

const PageContent: React.FC<PageContentProps> = memo(({children, ...props}) => {
  const theme = useTheme();
  return (
    <View style={{flex: 1}}>
      <PageContentContainer {...props}>{children}</PageContentContainer>
      <TopFadingGradient
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        colors={theme.colors.scrollFadeGradientColorsPageBackground}
        pointerEvents={'none'}
      />
      <BottomFadingGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={theme.colors.scrollFadeGradientColorsPageBackground}
        pointerEvents={'none'}
      />
    </View>
  );
});

export {PageContent};
