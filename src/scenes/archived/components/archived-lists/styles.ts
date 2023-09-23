import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../../../../components/draggable-page-content/styles';
import {ArchivedListCard} from '../../../../components/list-card/archived-list-card';

export const Container = styled.View`
  flex: 1;
`;

export const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: DEFAULT_PAGE_HORIZONTAL_PADDING,
    paddingTop: 30,
    paddingBottom: 30,
  },
});

export const StyledArchivedListCard = styled(ArchivedListCard)`
  margin-bottom: 8px;
`;
