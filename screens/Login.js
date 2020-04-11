import React, {Component} from 'react';
import {View, Text, Linking, StyleSheet} from 'react-native';

import Button from '../components/Button';
import {getQueryStringParams} from '../UTIL';
import Logo from '../components/Logo';
import LinearGradient from 'react-native-linear-gradient';

class LoginPage extends Component {
  componentDidMount = async () => {
    Linking.addEventListener('url', async event => {
      let {access_token, refresh_token, custom_token} = getQueryStringParams(
        event.url,
      );

      // log this user in with Firebase using the custom_token:
      try {
        await this.props.signInWithCustomToken(custom_token);
        this.props.completeSignIn();
      } catch (e) {
        console.log('error authing: ', e.message);
      }
    });
  };

  render() {
    let text = 'Only works for PRO Zoom accounts. ';
    return (
      <LinearGradient
        colors={['#191B53', '#550E8D']}
        style={styles.linearGradient}>
        <View style={{paddingTop: 100, height: '100%'}}>
          <Logo color="white" style={{marginBottom: 30}} />
          <Text style={styles.line}>
            Swaze makes it easy to monetize your Zoom sessions.
          </Text>
          <Text style={styles.line}>
            1. Pick a price and schedule your session in Swaze and have a Zoom
            meeting for your session automagically created.{' '}
          </Text>
          <Text style={styles.line}>
            2. Share your session link with your audience.
          </Text>
          <Text style={styles.line}>
            3. When someone pays through your link, they're automatically added
            to your Zoom meeting. Receive 93% of the transaction, we keep 7%.
          </Text>
          <Text style={styles.line}>
            Keep track of all your sessions, who attended and finances in Swaze.
          </Text>
          <Text style={{...styles.line, fontWeight: 'bold', opacity: 1.0}}>
            {text}
            <Text
              style={{color: 'lightblue', textDecorationLine: 'underline'}}
              onPress={() => Linking.openURL('https://zoom.us/pricing')}>
              Get it here.
            </Text>
          </Text>
          <View style={{position: 'absolute', bottom: 50, width: '100%'}}>
            <Button
              title="Log in with Zoom"
              onPress={() =>
                Linking.openURL(
                  'https://zoom.us/oauth/authorize?response_type=code&client_id=uIGn9r5kQIem2e7b2c81fQ&redirect_uri=https%3A%2F%2Fus-central1-swaze-d8f83.cloudfunctions.net%2FauthorizeRedirect',
                )
              }
            />
            <Text
              style={{
                ...styles.line,
                textDecorationLine: 'underline',
              }}
              onPress={() =>
                Linking.openURL(
                  'https://www.notion.so/Swaze-Terms-and-Conditions-5d1a07172aab4bba830eb6731fb59356',
                )
              }>
              By logging in, you agree to our terms and conditions.
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
