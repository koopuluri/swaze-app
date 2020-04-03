import React, {Component} from 'react';
import {View, Text, Button, Linking} from 'react-native';

import {getQueryStringParams} from '../UTIL';

class LoginPage extends Component {
  componentDidMount = async () => {
    console.log('this.props for <Login>: ', this.props);
    Linking.addEventListener('url', async event => {
      let {access_token, refresh_token, custom_token} = getQueryStringParams(
        event.url,
      );

      // log this user in with Firebase using the custom_token:
      try {
        await this.props.signInWithCustomToken(custom_token);
        console.log(
          'SUCCESSFULLY LOGGED IN. Go back to App.js now to re-render',
        );
        this.props.completeSignIn();
      } catch (e) {
        console.log('error authing: ', e.message);
      }
    });
  };

  componentWillUnmount() {
    console.log('<Login> unmounting!');
  }

  render() {
    return (
      <View style={{marginTop: 100}}>
        <Button
          title="Log in with Zoom"
          onPress={() =>
            Linking.openURL(
              'https://zoom.us/oauth/authorize?response_type=code&client_id=uIGn9r5kQIem2e7b2c81fQ&redirect_uri=https%3A%2F%2Fus-central1-swaze-d8f83.cloudfunctions.net%2FauthorizeRedirect',
            )
          }
        />
      </View>
    );
  }
}

export default LoginPage;
