import React, {memo} from 'react';
import {ControlContainer, Title, TitleContainer} from './styles';
import {SectionTitleProps} from './types';

const SectionTitle: React.FC<SectionTitleProps> = memo(
  ({title, ControlComponent, ...props}) => {
    return (
      <TitleContainer {...props}>
        <Title>{title}</Title>
        <ControlContainer>{ControlComponent}</ControlContainer>
      </TitleContainer>
    );
  },
);

export {SectionTitle};
