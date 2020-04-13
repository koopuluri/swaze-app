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
        <View style={{paddingTop: '60%', height: '100%'}}>
          <Logo color="#FBEE54" style={{marginBottom: 30}} />
          <Text style={styles.line}>
            Charge viewers and efficiently manage Zoom classes.
          </Text>

          <Text
            style={{
              ...styles.line,
              fontWeight: 'bold',
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
            <Button
              title="Log in with Zoom"
              onPress={() =>
                Linking.openURL(
                  'https://zoom.us/oauth/authorize?response_type=code&client_id=8qWk9IAHS7yzOMwh5WGVGQ&redirect_uri=https%3A%2F%2Fus-central1-swaze-d8f83.cloudfunctions.net%2FauthorizeRedirect',
                )
              }
            />
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
