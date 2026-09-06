import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../../components/page-content/styles';
import {EditableListCard} from '../../components/list-card/editable-list-card';

export const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: DEFAULT_PAGE_HORIZONTAL_PADDING,
    paddingTop: 30,
    paddingBottom: 30,
  },
});

export const Container = styled.View`
  width: 100%;
`;

export const StyledListCard = styled(EditableListCard)`
  margin-bottom: 8px;
`;

export const EmptyStateContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

export const EmptyStateTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 16px;
  color: ${({theme}) => theme.colors.contrastColor};
  text-align: center;
  margin-bottom: 8px;
`;

export const EmptyStateSubtitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.itemLabel};
  font-size: 14px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-align: center;
  line-height: 20px;
`;
