import React, {memo, useMemo, useRef, useState} from 'react';
import {FadeIn} from 'react-native-reanimated';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {BackButton} from '../../../../components/back-button';
import {Header} from '../../../../components/header';
import {ContentRow, Title, TitleContainer} from './styles';
import {ListHeaderProps} from './types';

const DefaultHeader: React.FC<ListHeaderProps> = memo(
  ({listData, onBackButtonPress}) => {
    //   const iconRef = useRef<AnimatedIconRef>(null);

    //   useEffect(() => {
    //     iconRef.current?.play({
    //       animationLayer: 'toggleOff',
    //       delay: 2000,
    //       onAnimationFinish: () => {
    //         iconRef.current?.play({animationLayer: 'toggleOn'});
    //       },
    //     });
    //   }, []);

    const [titleWidth, setTitleWidth] = useState(0);

    const ListIcon = useMemo(() => {
      return listData?.icon ?? ListDefaultIcon;
    }, [listData?.icon]);

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
            autoPlay
            style={{opacity: 0.3, marginRight: -15, marginTop: 0}}
          />
        </ContentRow>
      </Header>
    );
  },
);

export {DefaultHeader};
