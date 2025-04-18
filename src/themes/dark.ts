import {DefaultTheme} from 'styled-components/native';

const darkTheme: DefaultTheme = {
  colors: {
    primary: '#7956BF',
    secondary: '#6B49B7',
    iconOverlay: '#A188D2',
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
    listCardGroupItem: '#474C56',
    tuduCard: '#3C414A',
    tuduCardDone: '#283341',
    button: '#3C414A',
    buttonHighlight: '#444B56',
    profileThumbBackground: '#FFFFFF',
    profileThumbText: '#212529',
    sectionTitleBorder: '#444B56',
    counterTile: '#3C414A',
    counterIconBackground: '#2B3139',
    optionsButtonBackground: '#2B3139',
    popupBackground: '#3C414A',
    popupTopBackground: '#5e626a',
    scrollFadeGradientColors: [
      'rgba(60, 65, 74, 0.1)',
      'rgba(60, 65, 74, 0.7)',
      'rgba(60, 65, 74, 1)',
    ],
    scrollFadeGradientColorsPageBackground: [
      'rgba(37, 48, 61, 0.1)',
      'rgba(37, 48, 61, 0.7)',
      'rgba(37, 48, 61, 1)',
    ],
    defaultSeparatorGradientColors: ['#3C414A', '#FFFFFF20', '#3C414A'],
    menuSeparatorGradientColors: ['#2B3139', '#FFFFFF20', '#2B3139'],
    swipeableCard: {
      background: '#3C414A',
      optionsBackground: '#7956BF',
    },
    defaultToast: {
      borderLeft: '#7956BF',
      background: '#444B56',
      text: '#FFFFFF',
    },
    actionMessageToast: {
      background: '#585f69',
    },
    star: '#F5B404',
    suggestedEmoji: {
      selectedEmojiBorder: 'rgba(255, 255, 255, 0.4)',
      scrollFadeGradientColors: [
        'rgba(94, 98, 106, 0.1)',
        'rgba(94, 98, 106, 0.7)',
        'rgba(94, 98, 106, 1)',
      ],
    }
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
