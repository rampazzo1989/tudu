import React, {memo} from 'react';
import {
  BottomFadingGradient,
  PageContentContainer,
  PageContentViewContainer,
  TopFadingGradient,
} from './styles';
import {PageContentProps} from './types';
import {useTheme} from 'styled-components/native';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const PageContent: React.FC<PageContentProps> = memo(({children, scrollable = true, ...props}) => {
  const theme = useTheme();
  const Container = scrollable ? PageContentContainer : PageContentViewContainer;
  return (
    <View style={styles.container}>
      <Container {...(props as any)}>{children}</Container>
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
