import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {FadeIn, ZoomInRotate} from 'react-native-reanimated';

import {ContentRow, Emoji, styles, Title, TitleContainer} from './styles';
import {ListHeaderProps} from './types';

import {useTheme} from 'styled-components/native';
import {AnimatedIconRef} from '../animated-icons/animated-icon/types';
import {getFirstEmoji, trimFirstEmoji} from '../../utils/emoji-utils';
import {Header} from '../header';
import {BackButton} from '../back-button';
import {ListDefaultIcon} from '../animated-icons/list-default-icon';

const ListHeader: React.FC<ListHeaderProps> = memo(
  ({listData, onBackButtonPress, Icon}) => {
    const [titleWidth, setTitleWidth] = useState(0);
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    const titleEmoji = useMemo(
      () => getFirstEmoji(listData?.label?.trim() ?? ''),
      [listData?.label],
    );

    const titleRemovedMainEmoji = useMemo(
      () => trimFirstEmoji(listData?.label?.trim() ?? ''),
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
              {titleRemovedMainEmoji}
            </Title>
          </TitleContainer>
          {Icon ? (
            <Icon
              size={70}
              ref={iconRef}
              style={styles.pageIcon}
              overrideColor={theme.colors.iconOverlay}
            />
          ) : titleEmoji ? (
            <Emoji adjustsFontSizeToFit entering={ZoomInRotate.springify()}>
              {titleEmoji}
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
