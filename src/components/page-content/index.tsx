import React, {memo} from 'react';
import {PageContentContainer} from './styles';
import {PageContentProps} from './types';

const PageContent: React.FC<PageContentProps> = memo(({children, ...props}) => {
  return <PageContentContainer {...props}>{children}</PageContentContainer>;
});

export {PageContent};
