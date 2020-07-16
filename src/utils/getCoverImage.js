import {FistralBeach} from '../assets/';
import {BrightonBeach} from '../assets/';

export default getCoverImage = (location) => {
  console.log(location);
  const coverImage = location?.CoverImage ? location?.CoverImage : location;
  console.log('cover image', coverImage);
  switch (coverImage) {
    case 'BrightonBeach':
    case 'Brighton Beach':
      console.log('brighton');
      return BrightonBeach;
      break;
    case 'FistralBeach':
    case 'Fistral Beach':
      console.log('fistral');
      return FistralBeach;
    default:
      console.log('Could not find beach');
  }
};
