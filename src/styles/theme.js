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
    text: CustomColours.BLACK,
    disabled: CustomColours.GREY,
    placeholder: CustomColours.BLACK,
    backdrop: CustomColours.GREY,
  },
  fonts: {
    regular: CustomFonts.LatoBlack,
    medium: CustomFonts.AmaticSCBold,
    light: CustomFonts.LatoLight,
    thin: CustomFonts.LatoThin,
  },
};
