import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {FadeIn} from 'react-native-reanimated';

import {useTheme} from 'styled-components/native';
import {BackButton} from '../../../../components/back-button';
import {Header} from '../../../../components/header';
import {SearchIcon} from '../../../../components/animated-icons/search';
import {SearchHeaderProps} from './types';
import {AnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';
import {ContentRow, Input, styles, Title, TitleContainer} from './styles';

const SearchHeader: React.FC<SearchHeaderProps> = memo(
  ({listData, onBackButtonPress, onTextChange}) => {
    const [titleWidth, setTitleWidth] = useState(0);
    const iconRef = useRef<AnimatedIconRef>(null);
    const theme = useTheme();
    const [searchText, setSearchText] = useState('');

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

    return (
      <Header titleWidth={titleWidth} style={styles.header}>
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
      </Header>
    );
  },
);

export {SearchHeader};
