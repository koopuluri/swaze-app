import React, {Component} from 'react';
import {View, Text, Linking, StyleSheet} from 'react-native';

import Button from '../components/Button';
import {getQueryStringParams} from '../UTIL';
import Logo from '../components/Logo';
import LinearGradient from 'react-native-linear-gradient';
import LoadingSpinner from '../components/LoadingSpinner';
import InAppBrowser from 'react-native-inappbrowser-reborn';

class LoginPage extends Component {
  state = {
    isLoading: false,
    errorMessage: '',
  };
  componentDidMount = async () => {};

  renderButton = () => {
    let {errorMessage, isLoading} = this.state;
    if (isLoading)
      return <LoadingSpinner color="white" marginTop={10} marginBottom={30} />;
    return (
      <View>
        <Button
          title="Log in with Zoom"
          onPress={async () => {
            let resp = await InAppBrowser.openAuth(
              'https://zoom.us/oauth/authorize?response_type=code&client_id=8qWk9IAHS7yzOMwh5WGVGQ&redirect_uri=https%3A%2F%2Fus-central1-swaze-d8f83.cloudfunctions.net%2FauthorizeRedirect',
            );
            if (resp.type === 'success') {
              let {
                access_token,
                refresh_token,
                custom_token,
              } = getQueryStringParams(resp.url);

              // log this user in with Firebase using the custom_token:
              try {
                this.setState({isLoading: true});
                await this.props.signInWithCustomToken(custom_token);
              } catch (e) {
                this.setState({
                  isLoading: false,
                  errorMessage:
                    'There was an error logging in. Please try again.',
                });
              }
            } else {
              this.setState({
                isLoading: false,
                errorMessage:
                  'There was an error logging in. Please try again.',
              });
            }
          }}
        />
        {errorMessage ? (
          <Text
            style={{
              fontSize: 13,
              color: '#f70d1a',
              marginTop: -5,
              marginBottom: 10,
              textAlign: 'center',
            }}>
            {errorMessage}
          </Text>
        ) : null}
      </View>
    );
  };

  render() {
    let text = 'Only works for PRO Zoom accounts. ';
    return (
      <LinearGradient
        colors={['#191B53', '#550E8D']}
        style={styles.linearGradient}>
        <View style={{paddingTop: '60%', height: '100%'}}>
          <Logo color="#FBEE54" style={{marginBottom: 30}} />
          <Text style={styles.line}>
            Charge viewers and efficiently manage Zoom classes.
          </Text>

          <Text
            style={{
              ...styles.line,
              fontWeight: '400',
              opacity: 1.0,
              fontSize: 14,
            }}>
            {text}
            <Text
              style={{color: 'lightblue', textDecorationLine: 'underline'}}
              onPress={() => Linking.openURL('https://zoom.us/pricing')}>
              Get it here.
            </Text>
          </Text>
          <View style={{marginTop: 30, width: '100%'}}>
            {this.renderButton()}
            <Text
              style={{
                ...styles.line,
                textDecorationLine: 'underline',
                fontSize: 13,
                textAlign: 'center',
                marginTop: -10,
              }}
              onPress={() =>
                Linking.openURL(
                  'https://www.notion.so/Swaze-Terms-and-Conditions-5d1a07172aab4bba830eb6731fb59356',
                )
              }>
              By logging in, you agree to our terms and conditions.
            </Text>
            <Text
              style={{
                ...styles.line,
                textDecorationLine: 'underline',
                fontSize: 13,
                textAlign: 'center',
                marginTop: 40,
              }}
              onPress={() =>
                Linking.openURL(
                  'https://www.notion.so/Swaze-Pay-Official-140c87b57cca470090a49b1983883473',
                )
              }>
              See our WIKI for privacy policy, terms & conditions, support
              information, FAQs, etc.
            </Text>
            <Text
              style={{
                ...styles.line,
                fontSize: 13,
                textAlign: 'center',
                marginTop: -12,
              }}>
              You can also find all of these resources in the settings after
              you've signed in.
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  line: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    paddingLeft: 20,
    paddingRight: 20,
    padding: 10,
    opacity: 0.9,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

export default LoginPage;
