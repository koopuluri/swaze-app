import React, {Component} from 'react';
import {View, Text, Button, Linking} from 'react-native';

import {getQueryStringParams} from '../UTIL';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: 'AIzaSyCxfLEkFeJMxsaX3JxOVAfRODS3vud-TjU',
  authDomain: 'swaze-d8f83.firebaseapp.com',
  databaseURL: 'https://swaze-d8f83.firebaseio.com',
  projectId: 'swaze-d8f83',
  storageBucket: 'swaze-d8f83.appspot.com',
  messagingSenderId: '572770145804',
  appId: '1:572770145804:web:4e20f5dab789de4fa1c029',
  measurementId: 'G-XRH96MQ3WH',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

class LoginPage extends Component {
  componentDidMount = async () => {
    Linking.addEventListener('url', async event => {
      console.log('received url w/ event: ', event);

      let {access_token, refresh_token, custom_token} = getQueryStringParams(
        event.url,
      );

      // log this user in with Firebase using the custom_token:
      try {
        this.props.signInWithCustomToken(custom_token);
      } catch (e) {
        console.log('error authing: ', e.message);
      }
    });
  };

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
