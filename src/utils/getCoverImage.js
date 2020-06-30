import {FistralBeach} from '../assets/';
import {BrightonBeach} from '../assets/';

export default (location) => {
  switch (location.CoverImage) {
    case 'BrightonBeach':
      return BrightonBeach;
      break;
    case 'FistralBeach':
      return FistralBeach;
  }
};
