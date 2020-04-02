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
import Home from './screens/Home';
import Settings from './screens/Settings';
import Session from './screens/Session';
import CreateSession from './screens/CreateSession';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

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

  getMainStack = (firebaseUser, db) => () => (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        options={({navigation, route}) => ({
          title: 'Sessions',
          headerRight: () => (
            <Button
              title="Settings"
              onPress={() => navigation.navigate('Settings')}
            />
          ),
        })}>
        {props => <Home {...props} db={db} user={this.state.currentUser} />}
      </MainStack.Screen>
      <MainStack.Screen name="Settings">
        {props => <Settings {...props} db={db} user={this.state.currentUser} />}
      </MainStack.Screen>
      <MainStack.Screen
        name="Session"
        options={({navigation, route}) => ({
          headerRight: () => (
            <Button
              title="Edit"
              onPress={() =>
                navigation.navigate('Edit Session', {id: route.params.id})
              }
            />
          ),
        })}>
        {props => <Session {...props} db={db} user={this.sta} />}
      </MainStack.Screen>
    </MainStack.Navigator>
  );

  getNavigator = (firebaseUser, db) => {
    let MainStack = this.getMainStack(firebaseUser, db);
    return (
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="Main"
          component={MainStack}
          options={{headerShown: false}}
        />
        <RootStack.Screen name="Create Session">
          {props => (
            <CreateSession {...props} db={db} user={this.state.currentUser} />
          )}
        </RootStack.Screen>
        <RootStack.Screen name="Edit Session">
          {props => (
            <CreateSession
              {...props}
              isEditMode={true}
              db={db}
              user={this.state.currentUser}
            />
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    );
  };

  render() {
    let db = firebase.firestore();
    if (this.state.isLoading) return <LoadingSpinner />;
    let firebaseUser = firebase.auth().currentUser;
    return (
      <NavigationContainer>
        {!firebaseUser ? <LoginPage /> : this.getNavigator(firebaseUser, db)}
      </NavigationContainer>
    );
  }
}

export default App;
