import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, Linking} from 'react-native';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';
import Modal from '../components/Modal';
import TextInput from '../components/TextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Link from '../components/Link';
import CONSTANTS from '../CONSTANTS';
import {getStripeConnectAuthUrl} from '../UTIL';

class Settings extends Component {
  state = {
    isNameModalOpen: false,
    name: {
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
    },
    errors: {},
  };
  getRowItem = (comp, onPress) => (
    <TouchableHighlight
      underlayColor="#e8e8e8"
      style={styles.settingsMenuItem}
      onPress={onPress}>
      {comp}
    </TouchableHighlight>
  );

  getNameEditForm = () => {
    let {name, isNameModalLoading, errors} = this.state;
    let {db, user} = this.props;
    return (
      <View>
        <Text style={{marginBottom: 10}}>
          Your name appears in the link you share with your audience.
        </Text>
        <TextInput
          title="First name"
          value={name.firstName}
          onChangeText={val => this.setState({name: {...name, firstName: val}})}
          error={errors.firstName}
          maxLength={CONSTANTS.MAX_FIRST_NAME_LENGTH}
        />
        <TextInput
          title="Last name"
          value={name.lastName}
          onChangeText={val => this.setState({name: {...name, lastName: val}})}
          error={errors.lastName}
          maxLength={CONSTANTS.MAX_LAST_NAME_LENGTH}
        />
        {isNameModalLoading ? (
          <LoadingSpinner />
        ) : (
          <Button
            title="Save"
            onPress={async () => {
              errors = {};
              if (!name.firstName)
                errors.firstName = 'Please enter your first name.';
              if (!name.lastName)
                errors.lastName = 'Please enter your last name.';

              if (errors.firstName || errors.lastName) {
                this.setState({errors});
              } else {
                // actually save it.
                this.setState({isNameModalLoading: true});
                try {
                  await db
                    .collection('users')
                    .doc(user.id)
                    .set({
                      firstName: name.firstName,
                      lastName: name.lastName,
                    });
                  this.setState({
                    isNameModalLoading: false,
                    isNameModalOpen: false,
                  });
                } catch (e) {}
              }
            }}
          />
        )}
      </View>
    );
  };

  render() {
    let {user} = this.props;
    let {isNameModalOpen} = this.state;
    return (
      <ScrollView style={styles.settingsContainer}>
        {this.getRowItem(
          <Text style={styles.menuText}>
            {user.firstName + ' ' + user.lastName}
          </Text>,
          () => this.setState({isNameModalOpen: true}),
        )}
        {this.getRowItem(
          <Text style={styles.menuText}>
            Connect your bank to receive payments.
          </Text>,
          () => Linking.openURL(getStripeConnectAuthUrl(user)),
        )}
        <View style={{marginTop: 30, padding: 20}}>
          <Link
            style={{marginBottom: 10}}
            name="Terms and conditions"
            url="https://www.notion.so/Swaze-app-terms-conditions-2c4bc9f2405f46618102f12a27b7f613"
          />
          <Link
            name="Need help? Email us at support@swaze.app"
            url="mailto:support@swaze.app"
          />
        </View>
        <Modal
          close={() => this.setState({isNameModalOpen: false})}
          isVisible={isNameModalOpen}
          title="Edit name">
          {this.getNameEditForm()}
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  settingsContainer: {
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 40,
  },
  menuText: {fontSize: 16},
  settingsMenuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
  },
});

export default Settings;
