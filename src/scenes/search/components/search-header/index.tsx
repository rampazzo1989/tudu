import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import {useTheme} from 'styled-components/native';
import {BackButton} from '../../../../components/back-button';
import {Header} from '../../../../components/header';
import {SearchIcon} from '../../../../components/animated-icons/search';
import {SearchHeaderProps} from './types';
import {AnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';
import {ContentRow, Input, styles, Title, TitleBackground, TitleContainer} from './styles';
import { HeaderContent } from '../../../../components/header/styles';
import {estimateTitleWidth} from '../../../../components/header/utils';

const SearchHeader: React.FC<SearchHeaderProps> = memo(
  ({listData, onBackButtonPress, onTextChange}) => {
    const titleText = listData?.label?.trim() ?? '';
    const [titleWidth, setTitleWidth] = useState(() => estimateTitleWidth(titleText));
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();
    const [searchText, setSearchText] = useState('');
    const isFirstRender = useRef(true);

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    const handleTextChange = useCallback(
      (text: string) => {
        setSearchText(text);
        onTextChange(text);
      },
      [onTextChange],
    );

    const targetWidth = titleWidth ? 85 + titleWidth : 130;
    const width = useSharedValue(targetWidth);
    
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        width.value = targetWidth;
        return;
      }
      width.value = withTiming(targetWidth, { duration: 150 });
    }, [targetWidth]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: width.value,
      };
    });

    return (
      <HeaderContent style={styles.header}>
        <TitleBackground style={[animatedStyle]} />
              
        <ContentRow>
          <TitleContainer>
            <BackButton onPress={onBackButtonPress} />
            <Title
              adjustsFontSizeToFit
              onLayout={e => {
                setTitleWidth(e.nativeEvent.layout.width);
              }}
              numberOfLines={2}
              minimumFontScale={0.6}>
              {listData?.label?.trim()}
            </Title>
          </TitleContainer>

          <SearchIcon
            size={70}
            ref={iconRef}
            style={styles.pageIcon}
            overrideColor={theme.colors.iconOverlay}
          />
        </ContentRow>
        <Input
          value={searchText}
          onChangeText={handleTextChange}
          maxLength={30}
          autoFocus
        />
      </HeaderContent>
    );
  },
);

export {SearchHeader};
