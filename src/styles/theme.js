import {DefaultTheme} from 'react-native-paper';
import CustomColours from '../styles/colours';
import CustomFonts from '../styles/typography';
export default theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    primary: CustomColours.DEEP_BLUE,
    accent: CustomColours.GREY,
    background: CustomColours.WHITE,
    surface: CustomColours.WHITE,
    text: CustomColours.DEEP_BLUE,
    disabled: CustomColours.GREY,
    placeholder: CustomColours.BLACK,
    backdrop: CustomColours.GREY,
    tertiary: CustomColours.LIME_GREEN,
    dark_second: CustomColours.DARK_GREY,
  },
  fonts: {
    regular: CustomFonts.LatoBlack,
    medium: CustomFonts.LatoBlack,
    light: CustomFonts.LatoLight,
    thin: CustomFonts.LatoThin,
    button: CustomFonts.LatoBlack,
  },

  maxWidth: 250,
};
