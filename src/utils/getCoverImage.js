import {
  BrightonBeach,
  Aberavon,
  Benone,
  BigburyBeach,
  Boscombe,
  Bude,
  Croyde,
  Dunbar,
  EastWittering,
  FistralBeach,
  GoodringtonBeach,
  Gwithian,
  Polzeath,
  Porthcawl,
  Portrush,
  Sandown,
  Shoreham,
  Sidmouth,
  StIves,
  TheWave,
  Tynemouth,
  Whitby,
} from '../assets/';

export default getCoverImage = (location) => {
  // console.log('location', location);
  const coverImage = location?.CoverImage ? location?.CoverImage : location;
  // console.log('cover image', coverImage);
  switch (coverImage) {
    case 'BrightonBeach':
    case 'Brighton Beach':
      // console.log('brighton');
      return BrightonBeach;
      break;
    case 'FistralBeach':
    case 'Fistral Beach':
      // console.log('fistral');
      return FistralBeach;
    case 'Aberavon':
      return Aberavon;
      break;
    case 'Benone':
      return Benone;
      break;
    case 'BigburyBeach':
    case 'Bigbury Beach':
      return BigburyBeach;
      break;
    case 'Boscombe':
      return Boscombe;
      break;
    case 'Bude':
      return Bude;
      break;
    case 'Croyde':
      return Croyde;
      break;
    case 'Dunbar':
      return Dunbar;
      break;
    case 'EastWittering':
    case 'East Wittering':
      return EastWittering;
      break;
    case 'GoodringtonBeach':
    case 'Goodrington Beach':
      return GoodringtonBeach;
      break;
    case 'Gwithian':
      return Gwithian;
      break;
    case 'Polzeath':
      return Polzeath;
      break;
    case 'Porthcawl':
      return Porthcawl;
      break;
    case 'Portrush':
      return Portrush;
      break;
    case 'Sandown':
      return Sandown;
      break;
    case 'Shoreham':
      return Shoreham;
      break;
    case 'Sidmouth':
      return Sidmouth;
      break;
    case 'StIves':
    case 'St Ives':
      return StIves;
      break;
    case 'TheWave':
    case 'The Wave':
      return TheWave;
      break;
    case 'Tynemouth':
      return Tynemouth;
      break;
    case 'Whitby':
      return Whitby;
      break;
    default:
      console.log('Could not find beach');
  }
};
