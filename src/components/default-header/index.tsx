import React, {memo, useState} from 'react';
import {FadeIn} from 'react-native-reanimated';
import {BackButton} from '../back-button';
import {Header} from '../header';
import {ContentRow, styles, Title, TitleContainer} from './styles';
import {DefaultHeaderProps} from './types';

const DefaultHeader: React.FC<DefaultHeaderProps> = memo(
  ({title, Icon, onBackButtonPress}) => {
    const [titleWidth, setTitleWidth] = useState(0);

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
            autoPlay
            style={styles.pageIcon}
            overrideColor="#A188D2"
          />
        </ContentRow>
      </Header>
    );
  },
);

export {DefaultHeader};
