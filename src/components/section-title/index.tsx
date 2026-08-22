import React, {memo} from 'react';
import {
  ControlContainer,
  ReactionContainer,
  RightActionsContainer,
  Title,
  TitleContainer,
} from './styles';
import {SectionTitleProps} from './types';

const SectionTitle: React.FC<SectionTitleProps> = memo(
  ({title, ControlComponent, ReactionComponent, ...props}) => {
    return (
      <TitleContainer {...props}>
        <Title numberOfLines={1}>{title}</Title>
        {(ControlComponent || ReactionComponent) && (
          <RightActionsContainer>
            {ReactionComponent && (
              <ReactionContainer>{ReactionComponent}</ReactionContainer>
            )}
            {ControlComponent && (
              <ControlContainer>{ControlComponent}</ControlContainer>
            )}
          </RightActionsContainer>
        )}
      </TitleContainer>
    );
  },
);

export {SectionTitle};

