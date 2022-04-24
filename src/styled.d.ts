import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    margin: string;
    padding: string;

    colors: {
      primary: string;
      primaryContrast: string;
      secondary: string;
      background: string;
      offsetGrey: string;
    };
  }
}
