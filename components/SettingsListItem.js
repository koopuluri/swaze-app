import React from 'react';
import {TouchableHighlight, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SettingsListItem(props) {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      underlayColor="#e8e8e8"
      style={styles.settingsMenuItem}>
      {!props.isLoading ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text
              style={{
                ...styles.menuText,
                color: props.labelColor ? props.labelColor : 'black',
              }}>
              {props.label}
            </Text>
            {props.caption ? (
              <Text style={styles.caption}>{props.caption}</Text>
            ) : null}
          </View>
          {props.onPress ? (
            <Icon name="angle-right" size={24} color="gray" />
          ) : null}
          {props.rightIcon ? props.rightIcon : null}
        </View>
      ) : (
        <LoadingSpinner />
      )}
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 40,
  },
  menuText: {fontSize: 16, fontWeight: 'bold', paddingRight: 10},
  caption: {marginTop: 3, fontSize: 14, opacity: 0.7, paddingRight: 10},
  settingsMenuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
  },
});
