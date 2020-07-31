import React from 'react';
import {Avatar, useTheme} from 'react-native-paper';
import {relativeTimeRounding} from 'moment';
export default function SurferAvatar({label, profilePicture}) {
  const {maxWidth, colors, fonts} = useTheme();
  if (profilePicture) {
    return (
      <Avatar.Text
        label={label}
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
  } else
    return (
      <Avatar.Text
        label={label}
        size={60}
        color={colors.dark_second}
        style={{
          backgroundColor: colors.accent,
          borderColor: colors.surface,
          marginRight: 20,
        }}
      />
    );
}
