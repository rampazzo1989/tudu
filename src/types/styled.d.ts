import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      iconOverlay: string;
      pageBackground: string;
      contrastColor: string;
      text: string;
      headerText: string;
      tabbar: string;
      listCard: string;
      listCardHighlighted: string;
      listCardNumber: string;
      listCardNumberHighlighted: string;
      listCardGroup: string;
      listCardGroupItem: string;
      tuduCard: string;
      tuduCardDone: string;
      button: string;
      buttonHighlight: string;
      profileThumbBackground: string;
      profileThumbText: string;
      sectionTitleBorder: string;
      counterTile: string;
      counterIconBackground: string;
      optionsButtonBackground: string;
      popupBackground: string;
      popupTopBackground: string;
      scrollFadeGradientColors: string[];
      scrollFadeGradientColorsPageBackground: string[];
      defaultSeparatorGradientColors: string[];
      menuSeparatorGradientColors: string[];
      swipeableCard: {
        background: string;
        optionsBackground: string;
      };
      defaultToast: {
        borderLeft: string;
        background: string;
        text: string;
      };
      actionMessageToast: {
        background: string;
      };
      star: string;
      suggestedEmoji: {
        selectedEmojiBorder: string;
      };
    };
    fonts: {
      header: string;
      itemLabel: string;
      listCardLabel: string;
      listCardLabelHighlighted: string;
      listCardGroupTitle: string;
      title: string;
      sectionTitle: string;
      initials: string;
      counterTitle: string;
      counterValue: string;
      default: string;
    };
  }
}
