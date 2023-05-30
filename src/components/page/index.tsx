import React, {memo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PageProps} from './types';
import {ScrollView, StatusBar, StyledSafeAreaView} from './styles';
import {useTheme} from 'styled-components/native';

const Page: React.FC<PageProps> = memo(({children}) => {
  const theme = useTheme();
  return (
    <StyledSafeAreaView>
      <StatusBar backgroundColor={theme.colors.primary} />
      <ScrollView>{children}</ScrollView>
    </StyledSafeAreaView>
  );
});

export {Page};
