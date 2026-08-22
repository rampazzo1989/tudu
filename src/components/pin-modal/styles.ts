import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';

export const ModalContainer = styled.View`
  width: 92%;
  max-width: 380px;
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 24px;
  padding: 24px 16px;
  align-items: center;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  elevation: 10;
`;

export const IconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary}30;
`;

export const ModalHeader = styled.View`
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
`;

export const ModalTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 4px;
`;

export const ModalSubtitle = styled.Text<{ isError?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ isError, theme }) =>
    isError ? '#FF5E5B' : theme.colors.iconOverlay};
  text-align: center;
  min-height: 20px;
  padding-horizontal: 16px;
`;

export const CancelButton = styled(ShrinkableView)`
  margin-top: 8px;
  padding-vertical: 12px;
  padding-horizontal: 32px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
  align-items: center;
  justify-content: center;
`;

export const CancelButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;
