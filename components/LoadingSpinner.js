import React from 'react';

import {ActivityIndicator} from 'react-native';

export default function LoadingSpinner() {
  return (
    <ActivityIndicator
      style={{marginTop: 'auto', marginBottom: 'auto'}}
      size="large"
      color="blue"
    />
  );
}
