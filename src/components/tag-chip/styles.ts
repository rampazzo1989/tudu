import styled from 'styled-components/native';
import {TagChipVariant} from './types';

const getVariantBackground = (variant: TagChipVariant = 'neutral') => {
  switch (variant) {
    case 'primary':
      return 'rgba(121, 86, 191, 0.18)';
    case 'today':
      return 'rgba(245, 180, 4, 0.15)';
    case 'recurrence':
      return 'rgba(76, 175, 80, 0.15)';
    case 'list':
      return 'rgba(90, 155, 255, 0.14)';
    case 'neutral':
    default:
      return 'rgba(255, 255, 255, 0.07)';
  }
};

const getVariantBorderColor = (variant: TagChipVariant = 'neutral') => {
  switch (variant) {
    case 'primary':
      return 'rgba(121, 86, 191, 0.35)';
    case 'today':
      return 'rgba(245, 180, 4, 0.30)';
    case 'recurrence':
      return 'rgba(76, 175, 80, 0.30)';
    case 'list':
      return 'rgba(90, 155, 255, 0.28)';
    case 'neutral':
    default:
      return 'rgba(255, 255, 255, 0.08)';
  }
};

const getVariantTextColor = (variant: TagChipVariant = 'neutral') => {
  switch (variant) {
    case 'primary':
      return '#FFFFFF';
    case 'today':
      return '#F5B404';
    case 'recurrence':
      return '#81C784';
    case 'list':
      return '#93B5FF';
    case 'neutral':
    default:
      return '#A0AAB8';
  }
};

export const ChipContainer = styled.View<{
  variant?: TagChipVariant;
  size?: 'small' | 'medium';
}>`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({size}) => (size === 'small' ? '6px' : '8px')};
  padding-vertical: ${({size}) => (size === 'small' ? '2px' : '3px')};
  border-radius: ${({size}) => (size === 'small' ? '6px' : '7px')};
  background-color: ${({variant}) => getVariantBackground(variant)};
  border-width: 1px;
  border-color: ${({variant}) => getVariantBorderColor(variant)};
  align-self: flex-start;
`;

export const IconSlot = styled.View`
  margin-right: 4px;
  align-items: center;
  justify-content: center;
`;

export const ChipText = styled.Text<{
  variant?: TagChipVariant;
  size?: 'small' | 'medium';
}>`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: ${({size}) => (size === 'small' ? '10px' : '11px')};
  color: ${({variant}) => getVariantTextColor(variant)};
  font-weight: 500;
  line-height: ${({size}) => (size === 'small' ? '13px' : '15px')};
`;
