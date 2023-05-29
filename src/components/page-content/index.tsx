import React, {memo} from 'react';
import {PageContentContainer} from './styles';
import {PageContentProps} from './types';

const PageContent: React.FC<PageContentProps> = memo(({children}) => {
  return <PageContentContainer>{children}</PageContentContainer>;
});

export {PageContent};
