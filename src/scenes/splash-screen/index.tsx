import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {AnimatedIconRef} from '../../components/animated-icons/animated-icon/types';
import {AppIcon, Logo, StyledSafeAreaView} from './styles';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';
import {useTheme} from 'styled-components/native';

const SplashScreen = React.memo(
  ({
    navigation,
  }: NativeStackScreenProps<StackNavigatorParamList, 'SplashScreen'>) => {
    const iconRef = useRef<AnimatedIconRef>(null);

    const theme = useTheme();

    useEffect(() => {
      if (navigation) {
        iconRef.current?.play({
          onAnimationFinish: () => {
            if (navigation.isFocused()) {
              navigation.replace('Home');
            }
          },
        });
      }
    }, [navigation]);

    return (
      <>
        <StyledSafeAreaView>
          <StatusBar
            backgroundColor={theme.colors.secondary}
            barStyle="light-content"
            translucent={false}
          />
          <AppIcon size={100} resizeMode="cover" speed={2} ref={iconRef} />
          <Logo height={61} width={56} />
        </StyledSafeAreaView>
      </>
    );
  },
);

export {SplashScreen};
