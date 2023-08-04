import {DefaultTheme} from 'styled-components/native';

const darkTheme: DefaultTheme = {
  colors: {
    primary: '#7956BF',
    secondary: '#6B49B7',
    pageBackground: '#25303D',
    contrastColor: '#FFFFFF',
    text: '#FFFFFF',
    headerText: '#FFFFFF',
    tabbar: '#2D344A',
    listCard: '#3C414A',
    listCardHighlighted: '#444B56',
    listCardNumber: '#444B56',
    listCardNumberHighlighted: '#3C414A',
    listCardGroup: '#3C414A',
    button: '#3C414A',
    buttonHighlight: '#444B56',
    profileThumbBackground: '#FFFFFF',
    profileThumbText: '#212529',
    sectionTitleBorder: '#444B56',
    counterTile: '#3C414A',
    counterIconBackground: '#2B3139',
    optionsButtonBackground: '#2B3139',
    popupBackground: '#3C414A',
    scrollFadeGradientColors: [
      'rgba(37, 48, 61, 0.1)',
      'rgba(37, 48, 61, 0.7)',
      'rgba(37, 48, 61, 1)',
    ],
  },
  fonts: {
    header: 'Inter-SemiBold',
    itemLabel: 'Inter-Regular',
    listCardLabel: 'Inter-Regular',
    listCardLabelHighlighted: 'Inter-Regular',
    listCardGroupTitle: 'Inter-Regular',
    title: 'Inter-Regular',
    sectionTitle: 'Inter-SemiBold',
    initials: 'Inter-Medium',
    counterTitle: 'Inter-Regular',
    counterValue: 'Inter-Regular',
    default: 'Inter-Regular',
  },
};

export {darkTheme};
