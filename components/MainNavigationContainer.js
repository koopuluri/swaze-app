import React from 'react';
import {NavigationContainer, useLinking} from '@react-navigation/native';
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import Session from '../screens/Session';
import CreateSession from '../screens/CreateSession';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

export default function MainNavigationContainer(props) {
  const ref = React.useRef();

  const {getInitialState} = useLinking(ref, {
    prefixes: ['com.swaze://'],
    config: {
      Main: {
        screen: {
          Settings: 'settings',
        },
      },
    },
  });

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    Promise.race([
      getInitialState(),
      new Promise(resolve =>
        // Timeout in 150ms if `getInitialState` doesn't resolve
        // Workaround for https://github.com/facebook/react-native/issues/25675
        setTimeout(resolve, 150),
      ),
    ])
      .catch(e => {
        console.error(e);
      })
      .then(state => {
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return null;
  }

  let {db, currentUser, logout, firebase} = props;

  let MainStackComponent = () => (
    <MainStack.Navigator uriPrefix="com.swaze://">
      <MainStack.Screen
        name="Home"
        options={({navigation, route}) => ({
          title: 'SWAZE PAY',
          headerRight: () => (
            <Icon
              onPress={() => navigation.navigate('settings')}
              name="cog"
              size={24}
              color="white"
              style={{marginRight: 20, padding: 10}}
            />
          ),
          headerStyle: {
            backgroundColor: '#550e8d',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontStyle: 'italic',
            color: 'white',
          },
        })}>
        {props => <Home {...props} db={db} user={currentUser} />}
      </MainStack.Screen>
      <MainStack.Screen
        name="settings"
        path="settings"
        options={({navigation, route}) => ({
          title: 'Settings',
          headerLeft: () => (
            <Icon
              onPress={() => navigation.pop()}
              name="chevron-left"
              size={20}
              color="black"
              style={{marginLeft: 20, padding: 10}}
            />
          ),
        })}>
        {props => (
          <Settings
            {...props}
            firebase={firebase}
            logout={logout}
            db={db}
            user={currentUser}
          />
        )}
      </MainStack.Screen>
      <MainStack.Screen
        name="Session"
        options={({navigation, route}) => ({
          title: '',
          headerStyle: {
            backgroundColor: '#550e8d',
          },
          headerRight: () => {
            if (!currentUser.stripe || !currentUser.stripe.stripe_user_id) {
              return null;
            } else {
              return (
                <Icon
                  onPress={() =>
                    navigation.navigate('Edit Session', {id: route.params.id})
                  }
                  name="pencil-square-o"
                  size={24}
                  color="white"
                  style={{marginRight: 20, padding: 10}}
                />
              );
            }
          },
          headerLeft: () => (
            <Icon
              onPress={() => navigation.pop()}
              name="chevron-left"
              size={20}
              color="white"
              style={{marginLeft: 20, padding: 10}}
            />
          ),
        })}>
        {props => (
          <Session {...props} firebase={firebase} db={db} user={currentUser} />
        )}
      </MainStack.Screen>
    </MainStack.Navigator>
  );

  return (
    <NavigationContainer initialState={initialState} ref={ref}>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="Main"
          component={MainStackComponent}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Create Session"
          options={({navigation, route}) => ({
            title: 'Create',
            headerLeft: () => (
              <Icon
                onPress={() => navigation.pop()}
                name="chevron-left"
                size={20}
                color="gray"
                style={{marginLeft: 20, padding: 10}}
              />
            ),
          })}>
          {props => (
            <CreateSession
              {...props}
              firebase={firebase}
              db={db}
              user={currentUser}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="Edit Session"
          options={({navigation, route}) => ({
            title: 'Edit',

            headerLeft: () => (
              <Icon
                onPress={() => navigation.pop()}
                name="chevron-left"
                size={20}
                color="gray"
                style={{marginLeft: 20, padding: 10}}
              />
            ),
          })}>
          {props => (
            <CreateSession
              {...props}
              isEditMode={true}
              firebase={firebase}
              db={db}
              user={currentUser}
            />
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
