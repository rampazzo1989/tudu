import React, {memo} from 'react';
import {Container, Initials} from './styles';
import {ProfileThumbProps} from './types';

const ProfileThumb: React.FC<ProfileThumbProps> = memo(({initials, style}) => {
  return (
    <Container style={style}>
      {/* <ProfileAnimation /> */}
      <Initials>{initials}</Initials>
    </Container>
  );
});

export {ProfileThumb};
