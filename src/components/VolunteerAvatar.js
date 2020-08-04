import React from 'react';
import {Avatar, useTheme} from 'react-native-paper';
export default function VolunteerAvatar({
  label,
  source,
  isProfilePicture,
  size,
}) {
  console.log('other volunteer avatar');
  console.log({source});
  const {maxWidth, colors, fonts} = useTheme();
  if (isProfilePicture && size === 'LARGE' && source?.uri?.length > 0) {
    return (
      <Avatar.Image
        source={source}
        size={100}
        style={{
          alignSelf: 'center',
          backgroundColor: colors.accent,
          borderColor: colors.surface,
          borderWidth: 3,
        }}
      />
    );
  } else if (
    isProfilePicture &&
    size === 'LARGE' &&
    !(source?.uri?.length > 0)
  ) {
    return (
      <Avatar.Text
        label={label}
        size={100}
        style={{
          alignSelf: 'center',
          backgroundColor: colors.accent,
          borderColor: colors.surface,
          borderWidth: 3,
        }}
      />
    );
  } else if (isProfilePicture && size === 'MEDIUM' && source?.uri?.length > 0) {
    return (
      <Avatar.Image
        source={source}
        size={100}
        color={colors.dark_second}
        style={{
          position: 'absolute',
          display: 'flex',
          alignSelf: 'center',
          top: 130,
          backgroundColor: colors.accent,
          borderColor: colors.surface,
          borderWidth: 3,
        }}
      />
    );
  } else if (isProfilePicture && size === 'MEDIUM') {
    return (
      <Avatar.Text
        label={label}
        size={100}
        color={colors.dark_second}
        style={{
          backgroundColor: colors.accent,
          position: 'absolute',
          display: 'flex',
          alignSelf: 'center',
          top: 130,
        }}
      />
    );
  } else if (size === 'SMALL') {
    return (
      <Avatar.Text
        label={label}
        source={source}
        size={60}
        color={colors.dark_second}
        style={{
          backgroundColor: colors.accent,
          marginRight: 20,
        }}
      />
    );
  } else {
    return <Avatar.Text />;
  }
}
