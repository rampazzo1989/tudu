import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      pageBackground: string;
      text: string;
      headerText: string;
      tabbar: string;
      listCard: string;
      listCardHighlighted: string;
      listCardNumber: string;
      listCardNumberHighlighted: string;
      listCardGroup: string;
      profileThumbBackground: string;
      profileThumbText: string;
      sectionTitleBorder: string;
      counterTile: string;
      counterIconBackground: string;
      optionsButtonBackground: string;
      scrollFadeGradientColors: string[];
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
    };
  }
}
