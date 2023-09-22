import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {FadeIn} from 'react-native-reanimated';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {BackButton} from '../../../../components/back-button';
import {Header} from '../../../../components/header';
import {BuiltInList} from '../../../home/types';
import {ContentRow, styles, Title, TitleContainer} from './styles';
import {ListHeaderProps} from './types';
import {AnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';

const ListHeader: React.FC<ListHeaderProps> = memo(
  ({listData, onBackButtonPress}) => {
    const [titleWidth, setTitleWidth] = useState(0);
    const iconRef = useRef<AnimatedIconRef>(null);

    useEffect(() => {
      iconRef.current?.play();
    }, []);

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
              {listData?.label}
            </Title>
          </TitleContainer>
          <ListIcon
            size={70}
            ref={iconRef}
            style={styles.pageIcon}
            overrideColor="#A188D2"
          />
        </ContentRow>
      </Header>
    );
  },
);

export {ListHeader};
