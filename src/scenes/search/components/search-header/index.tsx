import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { BackButton } from '../../../../components/back-button';
import { SearchIcon } from '../../../../components/animated-icons/search';
import { SearchHeaderProps } from './types';
import { AnimatedIconRef } from '../../../../components/animated-icons/animated-icon/types';
import { ContentRow, Input, styles, Title, TitleBackground, TitleContainer } from './styles';
import { HeaderContent } from '../../../../components/header/styles';
import { estimateTitleWidth } from '../../../../components/header/utils';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const SearchHeader: React.FC<SearchHeaderProps> = memo(
  ({ listData, onBackButtonPress, onTextChange }) => {
    const titleText = listData?.label?.trim() ?? '';
    const [titleWidth, setTitleWidth] = useState(() => estimateTitleWidth(titleText));
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
      iconRef.current?.play();
    }, []);

    useEffect(() => {
      const estimated = estimateTitleWidth(titleText);
      setTitleWidth(prev => (Math.abs(prev - estimated) > 3 ? estimated : prev));
    }, [titleText]);

    const handleTextChange = useCallback(
      (text: string) => {
        setSearchText(text);
        onTextChange(text);
      },
      [onTextChange],
    );

    const targetWidth = titleWidth ? 85 + titleWidth : 130;
    const width = useSharedValue(100);

    useEffect(() => {
      width.value = withSpring(targetWidth, {
        damping: 18,
        stiffness: 140,
        mass: 0.8,
      });
    }, [targetWidth, width]);

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

export { SearchHeader };

