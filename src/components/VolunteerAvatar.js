import React from 'react';
import {Avatar, useTheme} from 'react-native-paper';
import {relativeTimeRounding} from 'moment';
import {isEmpty} from 'lodash';

export default function VolunteerAvatar({label, source, isProfilePicture}) {
  const {maxWidth, colors, fonts} = useTheme();
  console.log('IN VOL AVATAR COMPONENT');
  if (isProfilePicture) {
    if (isEmpty(source.profileURL) || source.profileURL === '') {
      console.log('IS PROFILE PICTURE AND NO SOURCE');
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
    } else {
      console.log('IS PROFILE PICTURE AND THERE IS A SOURCE', source);
      return (
        <Avatar.Image
          source={{uri: source.profileURL}}
          size={100}
          style={{
            alignSelf: 'center',
            backgroundColor: colors.accent,
            borderColor: colors.surface,
            borderWidth: 3,
          }}
        />
      );
    }
  } else
    return (
      <Avatar.Image
        source={source}
        size={100}
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
}
