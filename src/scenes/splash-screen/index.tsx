import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {AnimatedIconRef} from '../../components/animated-icons/animated-icon/types';
import {AppIcon, Logo, Spacer, StyledSafeAreaView} from './styles';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';

const SplashScreen = React.memo(
  ({
    navigation,
  }: NativeStackScreenProps<StackNavigatorParamList, 'SplashScreen'>) => {
    const iconRef = useRef<AnimatedIconRef>(null);

    useEffect(() => {
      if (navigation) {
        iconRef.current?.play({
          animationLayer: 'toggleOff',
          onAnimationFinish: () =>
            iconRef.current?.play({
              animationLayer: 'toggleOn',
              onAnimationFinish: () => navigation.replace('Home'),
            }),
        });
      }
    });

    return (
      <StyledSafeAreaView>
        <StatusBar
          backgroundColor={'#6B49B7'}
          barStyle="light-content"
          translucent={false}
        />
        <Spacer />
        <AppIcon size={100} resizeMode="cover" speed={2} ref={iconRef} />
        <Logo height={61} width={56} />
      </StyledSafeAreaView>
    );
  },
);

export {SplashScreen};
