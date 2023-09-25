import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {FadeIn} from 'react-native-reanimated';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {BackButton} from '../../../../components/back-button';
import {Header} from '../../../../components/header';
import {BuiltInList} from '../../../home/types';
import {ContentRow, Emoji, styles, Title, TitleContainer} from './styles';
import {ListHeaderProps} from './types';
import {AnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';

const EMOJI_REGEX = /^[\p{Emoji}\u200d]+/gu;

const ListHeader: React.FC<ListHeaderProps> = memo(
  ({listData, onBackButtonPress}) => {
    const [titleWidth, setTitleWidth] = useState(0);
    const iconRef = useRef<AnimatedIconRef>(null);

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    const titleEmoji = useMemo(() => {
      const emojis = listData?.label?.match(EMOJI_REGEX);
      console.log(emojis?.length, emojis);
      if (!emojis?.length || emojis.length > 3) {
        return;
      }
      let emojiList: string[] = [];

      for (const emoji of emojis) {
        emojiList.push(emoji);
      }

      return emojiList.join('');
    }, [listData?.label]);

    const textWithNoFirstEmoji = useMemo(() => {
      return listData?.label?.replace(EMOJI_REGEX, '')?.trim();
    }, [listData?.label]);

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
            <Emoji adjustsFontSizeToFit>{titleEmoji}</Emoji>
          ) : (
            <ListIcon
              size={70}
              ref={iconRef}
              style={styles.pageIcon}
              overrideColor="#A188D2"
            />
          )}
        </ContentRow>
      </Header>
    );
  },
);

export {ListHeader};
