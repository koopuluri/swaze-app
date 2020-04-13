import React from 'react';
import {View, Text} from 'react-native';

export default function Logo(props) {
  return (
    <View>
      <Text
        style={{
          ...props.style,
          fontSize: 48,
          textAlign: 'center',
          fontStyle: 'italic',
          fontWeight: '600',
          color: props.color ? props.color : '#550E8D',
        }}>
        SWAZE PAY
      </Text>
    </View>
  );
}
