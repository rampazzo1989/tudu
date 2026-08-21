import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export const Input = styled.TextInput`
  background-color: #fff;
  border-radius: 4px;
  color: #25303d;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
`;

export const ContentContainer = styled.View`
  width: 300px;
`;

export const ScheduleRowContainer = styled.View`
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
`;

export const ScheduleAddButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.2);
`;

export const ScheduleAddButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
`;

export const ScheduledBadgeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(99, 102, 241, 0.25);
  border-width: 1px;
  border-color: rgba(129, 140, 248, 0.6);
  border-radius: 14px;
  padding: 4px 10px;
`;

export const ScheduledBadgeButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

export const ScheduledBadgeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;

export const ClearScheduleButton = styled(TouchableOpacity)`
  margin-left: 8px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
`;

export const ClearScheduleText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  line-height: 12px;
  text-align: center;
`;

export const HeaderCalendarButton = styled(TouchableOpacity)`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

export const AISuggestionButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
  border-radius: 14px;
  background-color: rgba(121, 86, 191, 0.2);
  border-width: 1px;
  border-color: rgba(161, 136, 210, 0.5);
  margin-left: 8px;
`;

export const AISuggestionButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;