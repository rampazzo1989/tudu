import React, {memo} from 'react';
import {Title, TitleContainer} from './styles';
import {SectionTitleProps} from './types';

const SectionTitle: React.FC<SectionTitleProps> = memo(({title, ...props}) => {
  return (
    <TitleContainer {...props}>
      <Title>{title}</Title>
    </TitleContainer>
  );
});

export {SectionTitle};
