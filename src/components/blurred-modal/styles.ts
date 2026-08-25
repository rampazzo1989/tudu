import {BlurView} from '@react-native-community/blur';
import styled from 'styled-components/native';

export const Blur = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Modal = styled.Modal`
  flex: 1;
`;

export const ContentContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  flex: 1;
`;
