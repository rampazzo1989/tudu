import React, {memo, useEffect, useRef, useState} from 'react';
import {BackButton} from '../back-button';
import {Header} from '../header';
import {ContentRow, styles, Title, TitleContainer} from './styles';
import {DefaultHeaderProps} from './types';
import {AnimatedIconRef} from '../animated-icons/animated-icon/types';
import {useTheme} from 'styled-components/native';
import {estimateTitleWidth} from '../header/utils';

const DefaultHeader: React.FC<DefaultHeaderProps> = memo(
  ({title, Icon, onBackButtonPress}) => {
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();

    const [titleWidth, setTitleWidth] = useState(() => estimateTitleWidth(title));

    useEffect(() => {
      const estimated = estimateTitleWidth(title);
      setTitleWidth(prev => (Math.abs(prev - estimated) > 3 ? estimated : prev));
    }, [title]);

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    return (
      <Header titleWidth={titleWidth}>
        <ContentRow>
          <TitleContainer>
            <BackButton onPress={onBackButtonPress} />
            <Title
              adjustsFontSizeToFit
              onLayout={e => {
                const measured = e.nativeEvent.layout.width;
                if (measured > 0 && Math.abs(measured - titleWidth) > 3) {
                  setTitleWidth(measured);
                }
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
