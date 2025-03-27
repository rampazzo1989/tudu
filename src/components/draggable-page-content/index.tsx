import React, {memo} from 'react';
import {
  BottomFadingGradient,
  PageContentContainer,
  PageContentScroll,
  TopFadingGradient,
} from './styles';
import {DraggablePageContentProps} from './types';
import {useTheme} from 'styled-components/native';

const DraggablePageContent: React.FC<DraggablePageContentProps> = memo(
  ({children, ...props}) => {
    const theme = useTheme();
    return (
      <>
        <PageContentContainer {...props}>
          {children}
          <TopFadingGradient
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          colors={theme.colors.scrollFadeGradientColorsPageBackground}
          pointerEvents={'none'}
        />
        <BottomFadingGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={theme.colors.scrollFadeGradientColorsPageBackground}
          pointerEvents={'none'}
        />
        </PageContentContainer>
        
      </>
    );
  },
);

const DraggableScrollablePageContent: React.FC<DraggablePageContentProps> = memo(
  ({children, ...props}) => {
    const theme = useTheme();
    return (
      <>
        <PageContentScroll {...props}>
          {children}
        </PageContentScroll>
        <TopFadingGradient
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          colors={theme.colors.scrollFadeGradientColorsPageBackground}
          pointerEvents={'none'}
        />
        <BottomFadingGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={theme.colors.scrollFadeGradientColorsPageBackground}
          pointerEvents={'none'}
        />
      </>
    );
  },
);

export {DraggablePageContent, DraggableScrollablePageContent};
