import { StyleSheet } from "react-native";
import styled from "styled-components/native";

export const OptionTileContainer = styled.TouchableOpacity`
    width: 120px;
    height: 120px;
    border-radius: 8px;
    background-color: #444B56;
    justify-content: center;
    align-items: center;
`;

export const OptionTileText = styled.Text`
    font-family: ${({ theme }) => theme.fonts.default};
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    text-align: center;
    margin-top: 6px;
    max-width: 90%;
`;

export const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});