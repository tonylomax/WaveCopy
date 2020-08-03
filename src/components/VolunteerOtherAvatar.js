import React from 'react';
import {Text, View} from 'react-native';
import {Avatar, useTheme} from 'react-native-paper';
import {relativeTimeRounding} from 'moment';
export default function VolunteerOtherAvatar({
  label,
  source,
  isProfilePicture,
}) {
  console.log({source});
  const {maxWidth, colors, fonts} = useTheme();
  if (isProfilePicture && source?.uri?.length > 0) {
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
  } else if (isProfilePicture) {
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
  } else {
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
  }
}
