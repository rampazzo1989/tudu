import React, {memo, useEffect, useRef, useState} from 'react';
import {FadeIn} from 'react-native-reanimated';
import {BackButton} from '../back-button';
import {Header} from '../header';
import {ContentRow, styles, Title, TitleContainer} from './styles';
import {DefaultHeaderProps} from './types';
import {AnimatedIconRef} from '../animated-icons/animated-icon/types';
import {useTheme} from 'styled-components/native';

const DefaultHeader: React.FC<DefaultHeaderProps> = memo(
  ({title, Icon, onBackButtonPress}) => {
    const [titleWidth, setTitleWidth] = useState(0);
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    return (
      <Header titleWidth={titleWidth}>
        <ContentRow entering={FadeIn.duration(500)}>
          <TitleContainer>
            <BackButton onPress={onBackButtonPress} />
            <Title
              adjustsFontSizeToFit
              onLayout={e => {
                setTitleWidth(e.nativeEvent.layout.width);
              }}
              numberOfLines={2}
              minimumFontScale={0.6}>
              {title}
            </Title>
          </TitleContainer>
          <Icon
            size={55}
            style={styles.pageIcon}
            ref={iconRef}
            overrideColor={theme.colors.iconOverlay}
          />
        </ContentRow>
      </Header>
    );
  },
);

export {DefaultHeader};
