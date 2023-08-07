import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

type StyledGradientProps = {marginTop?: number};

export const StyledGradient = styled(LinearGradient)<StyledGradientProps>`
  max-height: 1px;
  height: 1px;
  margin-top: ${({marginTop}) => marginTop ?? 0}px;
`;
