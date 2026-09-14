import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {ZoomInRotate} from 'react-native-reanimated';

import {ContentRow, Emoji, styles, Title, TitleContainer} from './styles';
import {ListHeaderProps} from './types';

import {useTheme} from 'styled-components/native';
import {AnimatedIconRef} from '../animated-icons/animated-icon/types';
import {trimEmoji} from '../../utils/emoji-utils';
import {Header} from '../header';
import {BackButton} from '../back-button';
import {ListDefaultIcon} from '../animated-icons/list-default-icon';
import {estimateTitleWidth} from '../header/utils';

const ListHeader: React.FC<ListHeaderProps> = memo(
  ({listData, onBackButtonPress, Icon}) => {
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    const emojiInfo = useMemo(
      () => trimEmoji(listData?.label?.trim() ?? ''),
      [listData?.label],
    );

    const titleText = emojiInfo?.formattedText ?? listData?.label?.trim() ?? '';
    const [titleWidth, setTitleWidth] = useState(() => estimateTitleWidth(titleText));

    useEffect(() => {
      const estimated = estimateTitleWidth(titleText);
      setTitleWidth(prev => (Math.abs(prev - estimated) > 3 ? estimated : prev));
    }, [titleText]);

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
              {titleText}
            </Title>
          </TitleContainer>


          {Icon ? (
            <Icon
              size={70}
              ref={iconRef}
              style={styles.pageIcon}
              overrideColor={theme.colors.iconOverlay}
            />
          ) : emojiInfo?.emoji ? (
            <Emoji entering={ZoomInRotate.springify()}>
              {emojiInfo.emoji}
            </Emoji>
          ) : (
            <ListDefaultIcon
              size={70}
              ref={iconRef}
              style={styles.pageIcon}
              overrideColor={theme.colors.iconOverlay}
            />
          )}
        </ContentRow>
      </Header>
    );
  },
);

export {ListHeader};
