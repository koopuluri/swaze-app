import React, {Component} from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';
import Modal from '../components/Modal';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Link from '../components/Link';
import CONSTANTS from '../CONSTANTS';
import {getStripeConnectAuthUrl} from '../UTIL';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsListItem from '../components/SettingsListItem';

class Settings extends Component {
  state = {
    isNameModalOpen: false,
    name: {
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
    },
    errors: {},
  };
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
            padding={10}
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

  openStripeConnectUrl = async () => {
    let userToken = await this.props.firebase
      .auth()
      .currentUser.getIdToken(true);
    Linking.openURL(getStripeConnectAuthUrl(userToken));
  };

  getConnectBankRow = () => {
    let {user, firebase} = this.props;
    let message = '';
    let onPress = null;
    let label = '';
    let rightIcon = null;
    let icon = ''; // TODO: set this once we have icon support.

    if (!user.stripe) {
      message = 'Swaze uses Stripe to process payments and payouts.';
      label = 'Connect your bank to receive payouts.';
      onPress = () => this.openStripeConnectUrl();
      rightIcon = (
        <Icon
          name="exclamation-triangle"
          size={24}
          color="red"
          style={{marginRight: -4}}
        />
      );
    } else {
      if (user.stripe.error) {
        message =
          "There was an issue connecting your account. Please try again or reach out to us and we'll work with you to sort it out.";
        label = 'Connect your bank';
        onPress = () => this.openStripeConnectUrl();
        rightIcon = (
          <Icon
            name="exclamation-triangle"
            size={24}
            color="red"
            style={{marginRight: -4}}
          />
        );
      } else {
        message =
          'Contact us if you wish to change anything about your account.';
        label = 'Account successfully connected';
        rightIcon = (
          <Icon
            name="check-circle"
            size={24}
            color="#00cc00"
            style={{marginRight: -3}}
          />
        );
      }
    }
    return (
      <SettingsListItem
        label={label}
        onPress={onPress}
        caption={message}
        rightIcon={rightIcon}
      />
    );
  };

  logout = async () => {
    this.setState({isLogoutLoading: true});
    try {
      await this.props.logout();
      this.setState({isLogoutLoading: false});
    } catch (e) {}
  };

  render() {
    let {user, logout} = this.props;
    let {isNameModalOpen} = this.state;
    return (
      <ScrollView style={styles.settingsContainer}>
        <SettingsListItem
          label={user.firstName + ' ' + user.lastName}
          onPress={() => this.setState({isNameModalOpen: true})}
        />
        {this.getConnectBankRow()}
        <SettingsListItem
          label="Log out"
          labelColor="red"
          isLoading={this.state.isLogoutLoading}
          onPress={() => logout()}
        />
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
    padding: 10,
    paddingTop: 40,
  },
  menuText: {fontSize: 16, fontWeight: 'bold'},
  caption: {marginTop: 3, fontSize: 14, opacity: 0.7},
});

export default Settings;
