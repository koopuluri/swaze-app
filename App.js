/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Button, Linking, ActivityIndicator} from 'react-native';
import LoginPage from './screens/Login';
import MainNavigationContainer from './components/MainNavigationContainer';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {decode, encode} from 'base-64';
import LoadingSpinner from './components/LoadingSpinner';
global.crypto = require('@firebase/firestore');
global.crypto.getRandomValues = byteArray => {
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = Math.floor(256 * Math.random());
  }
};

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

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

class App extends Component {
  state = {
    currentUser: null,
    isLoading: true,
  };

  fetchAndSetCurrentUser = async () => {
    db = firebase.firestore();
    let id = firebase.auth().currentUser.uid;
    let doc = db
      .collection('users')
      .doc(id)
      .onSnapshot(doc => {
        if (doc.exists) {
          this.setState({
            currentUser: {
              ...doc.data(),
              id: id,
            },
          });
          this.setState({isLoading: false});
        }
      });
  };

  componentDidMount = async () => {
    if (firebase.auth().currentUser && !this.state.currentUser)
      this.fetchAndSetCurrentUser();

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.fetchAndSetCurrentUser();
      } else {
      }
    });
  };

  signInWithCustomToken = async custom_token => {
    try {
      await firebase.auth().signInWithCustomToken(custom_token);
    } catch (e) {
      console.log('error signing in with custom token: ', e);
    }
  };

  render() {
    let db = firebase.firestore();
    if (this.state.isLoading) return <LoadingSpinner />;
    let firebaseUser = firebase.auth().currentUser;
    if (!firebaseUser) return <LoginPage />;
    return (
      <MainNavigationContainer currentUser={this.state.currentUser} db={db} />
    );
  }
}

export default App;
