import { StyleSheet } from "react-native";
import styled from "styled-components/native";

export const OptionButtonContainer = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  background-color: #444B56;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  padding: 0 16px;
`;

export const OptionButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-align: center;
  margin-left: 10px;
  max-width: 90%;
`;

export const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});