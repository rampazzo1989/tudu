import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 56,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  checkAndTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 6,
    flex: 1,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    maxWidth: '90%',
  },
  labelAndAdditionalInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
  },
  starContainer: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
