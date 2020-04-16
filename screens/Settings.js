import React, {Component} from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
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
                    .update({
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
          'Your payments for each session will be deposited into your account after the session is held. Please feel free to reach out with any questions you may have, or if you would like to change your account details.';
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
      <ScrollView
        contentContainerStyle={{paddingBottom: 100}}
        style={styles.settingsContainer}>
        <SettingsListItem
          label={user.firstName + ' ' + user.lastName}
          onPress={() => this.setState({isNameModalOpen: true})}
        />
        {this.getConnectBankRow()}
        <SettingsListItem
          label="Give us feedback!"
          labelColor="black"
          onPress={() => Linking.openURL('mailto:karthik@swaze.app')}
        />
        <SettingsListItem
          label="Log out"
          labelColor="red"
          isLoading={this.state.isLogoutLoading}
          onPress={() => logout()}
        />
        <View style={{marginTop: 30, padding: 20}}>
          <Text style={{...styles.lineText, fontWeight: 'bold'}}>
            How SwazePay works:
          </Text>
          <Text style={styles.lineText}>Login with your Zoom PRO account.</Text>
          <Text style={styles.lineText}>
            Connect your card so that when your audience pays to join your
            session, that money can be deposited into your account.
          </Text>
          <Text style={styles.lineText}>
            Create a session and set a price to it.
          </Text>
          <Text style={styles.lineText}>
            Share the url with your audience. When someone pays through the
            link, they will automatically be added to your Zoom meeting and will
            be sent the Zoom meeting details.{' '}
            <Text
              style={{...styles.lineText, opacity: 1.0, fontWeight: 'bold'}}>
              You don't have to do anything else on your part!
            </Text>
          </Text>
          <Text style={styles.lineText}>
            You will be notified in Swaze Pay when someone has paid and joined
            your session.
          </Text>
          <Text style={{...styles.lineText, marginBottom: 30}}>
            We're happy to answer any questions you have. Reach us through the
            link below. Thanks!
          </Text>
          <Link
            style={{marginBottom: 10}}
            name="Terms and conditions"
            url="https://www.notion.so/Swaze-Terms-and-Conditions-5d1a07172aab4bba830eb6731fb59356"
          />
          <Link
            style={{marginBottom: 10}}
            name="Privacy policy"
            url="https://www.notion.so/Swaze-Privacy-Policy-8faeb852b0694f528cc45aa2f31d79d3"
          />
          <Link
            style={{marginBottom: 10}}
            name="Frequently asked questions"
            url="https://www.notion.so/Swaze-Frequently-asked-questions-9087251964784d00a1b7e1db4b22f629"
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
  lineText: {
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.7,
  },
  menuText: {fontSize: 16, fontWeight: 'bold'},
  caption: {marginTop: 3, fontSize: 14, opacity: 0.7},
});

export default Settings;
