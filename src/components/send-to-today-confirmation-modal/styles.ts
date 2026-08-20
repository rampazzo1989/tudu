import styled from "styled-components/native";

export const OptionsContainer = styled.View`
    flex-direction: row;
    width: 254px;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
`;

export const Label = styled.Text`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.default};
    width: 250px;
`;