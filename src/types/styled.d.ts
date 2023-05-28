import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      pageBackground: string;
      text: string;
      tabbar: string;
    };
    fonts: {
      header: string;
      text: string;
      title: string;
    };
  }
}
