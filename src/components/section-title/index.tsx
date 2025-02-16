import React, {memo} from 'react';
import {ControlContainer, ReactionContainer, Title, TitleContainer} from './styles';
import {SectionTitleProps} from './types';

const SectionTitle: React.FC<SectionTitleProps> = memo(
  ({title, ControlComponent, ReactionComponent, ...props}) => {
    return (
      <TitleContainer {...props}>
        <Title>{title}</Title>
        <ControlContainer>{ControlComponent}</ControlContainer>
        {ReactionComponent && <ReactionContainer>{ReactionComponent}</ReactionContainer>}
      </TitleContainer>
    );
  },
);

export {SectionTitle};
