import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {FadeIn, ZoomInRotate} from 'react-native-reanimated';

import {ContentRow, Emoji, styles, Title, TitleContainer} from './styles';
import {ListHeaderProps} from './types';

import {useTheme} from 'styled-components/native';
import {AnimatedIconRef} from '../animated-icons/animated-icon/types';
import {trimEmoji} from '../../utils/emoji-utils';
import {Header} from '../header';
import {BackButton} from '../back-button';
import {ListDefaultIcon} from '../animated-icons/list-default-icon';

const ListHeader: React.FC<ListHeaderProps> = memo(
  ({listData, onBackButtonPress, Icon, loading = false}) => {
    const [titleWidth, setTitleWidth] = useState(0);
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    const emojiInfo = useMemo(
      () => trimEmoji(listData?.label?.trim() ?? ''),
      [listData?.label],
    );

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
              {emojiInfo?.formattedText ?? listData?.label?.trim()}
            </Title>
          </TitleContainer>
          {!loading &&
            (Icon ? (
              <Icon
                size={70}
                ref={iconRef}
                style={styles.pageIcon}
                overrideColor={theme.colors.iconOverlay}
              />
            ) : emojiInfo?.emoji ? (
              <Emoji adjustsFontSizeToFit entering={ZoomInRotate.springify()}>
                {emojiInfo.emoji}
              </Emoji>
            ) : (
              <ListDefaultIcon
                size={70}
                ref={iconRef}
                style={styles.pageIcon}
                overrideColor={theme.colors.iconOverlay}
              />
            ))}
        </ContentRow>
      </Header>
    );
  },
);

export {ListHeader};
