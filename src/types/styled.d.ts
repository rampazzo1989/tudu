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
      profileThumbBackground: string;
      profileThumbText: string;
    };
    fonts: {
      header: string;
      itemLabel: string;
      listCardLabel: string;
      listCardLabelHighlighted: string;
      title: string;
      initials: string;
    };
  }
}
