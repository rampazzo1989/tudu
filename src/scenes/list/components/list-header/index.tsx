import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {FadeIn, ZoomInRotate} from 'react-native-reanimated';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {BackButton} from '../../../../components/back-button';
import {Header} from '../../../../components/header';
import {BuiltInList} from '../../../home/types';
import {ContentRow, Emoji, styles, Title, TitleContainer} from './styles';
import {ListHeaderProps} from './types';
import {AnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';
import {useTheme} from 'styled-components/native';
import {
  EMOJI_REGEX,
  getEmojiFromBeginning,
  removeEmojiFromBeginning,
} from '../../../../utils/emoji-utils';

const ListHeader: React.FC<ListHeaderProps> = memo(
  ({listData, onBackButtonPress}) => {
    const [titleWidth, setTitleWidth] = useState(0);
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    const titleEmoji = useMemo(
      () => getEmojiFromBeginning(listData?.label ?? ''),
      [listData?.label],
    );

    const textWithNoFirstEmoji = useMemo(
      () => removeEmojiFromBeginning(listData?.label ?? ''),
      [listData?.label],
    );

    const ListIcon = useMemo(() => {
      return (listData as BuiltInList)?.icon ?? ListDefaultIcon;
    }, [listData]);

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
              {textWithNoFirstEmoji}
            </Title>
          </TitleContainer>
          {titleEmoji ? (
            <Emoji adjustsFontSizeToFit entering={ZoomInRotate.springify()}>
              {titleEmoji}
            </Emoji>
          ) : (
            <ListIcon
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
