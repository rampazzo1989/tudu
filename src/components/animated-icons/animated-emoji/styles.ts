import Animated from "react-native-reanimated";
import styled from "styled-components/native";

export const Emoji = styled(Animated.Text)`
    color: ${({theme}) => theme.colors.headerText};
    font-size: 32px;
    transform: rotate(180deg);
`;