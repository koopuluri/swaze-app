import React from 'react';

import {ActivityIndicator} from 'react-native';

export default function LoadingSpinner(props) {
  return (
    <ActivityIndicator
      style={{
        marginTop: props.marginTop ? props.marginTop : 'auto',
        marginBottom: props.marginBottom ? props.marginBottom : 'auto',
      }}
      size="large"
      color={props.color ? props.color : 'blue'}
    />
  );
}
