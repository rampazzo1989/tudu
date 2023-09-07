import React, {memo} from 'react';
import {BackButton} from '../../../../components/back-button';
import {Header} from '../../../../components/header';
import {ContentRow, Title, TitleContainer} from './styles';
import {ListHeaderProps} from './types';

const ListHeader: React.FC<ListHeaderProps> = memo(
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

    return (
      <Header>
        <ContentRow>
          <TitleContainer>
            <BackButton onPress={onBackButtonPress} />
            <Title
              adjustsFontSizeToFit
              numberOfLines={2}
              minimumFontScale={0.6}>
              {listData.label}
            </Title>
          </TitleContainer>
        </ContentRow>
      </Header>
    );
  },
);

export {ListHeader};
