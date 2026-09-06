import styled from 'styled-components/native';
import { ShrinkableView } from '../../shrinkable-view';

export const DropzoneContainer = styled(ShrinkableView)`
  width: 100%;
  padding-vertical: 12px;
  padding-horizontal: 14px;
  border-radius: 10px;
  border-width: 1.5px;
  border-style: dashed;
  border-color: rgba(255, 255, 255, 0.12);
  background-color: rgba(255, 255, 255, 0.02);
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

export const DropzoneText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  font-style: italic;
`;
