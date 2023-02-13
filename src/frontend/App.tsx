import 'react-native-gesture-handler';
import { faChevronLeft, faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Linking, Alert, View, Pressable, Image, ScrollView, TextInput } from 'react-native';
import { Link, NativeRouter } from 'react-router-native';
import { About } from './components/About';
import { Account } from './components/Account';
import { Friends } from './components/FriendsList';
import { Help } from './components/Help';
import { HomePage } from './components/HomePage';
import { Menu } from './components/Menu';
import { Profile } from './components/Profile';
import { appInfo } from './util/types';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { AddPost } from './components/AddPost';
import { AllHistory } from './components/AllHistory';
import { Post } from './components/Post';
import { CreateAccount } from './components/CreateAccount';
import { FriendProfile } from './components/FriendProfile';

export const defaultAppInfo: appInfo = {
  randomNumb: 0,
  userInfo: {
    userName: "",
    name: "",
    email: "",
    profile_pic: "",
  }
}

export const AppContext = React.createContext(defaultAppInfo);
export const BASE_URL = "https://cosmic-talent-364620.uc.r.appspot.com"

export default function App() {
  const [appInfo, setAppInfo] = useState<appInfo>()
  const [loggedIn, setLoggedIn] = useState(false)
  const [alreadyUser, setAlreadyUser] = useState(false)
  const [username, setUserName] = useState('');
  const Stack = createStackNavigator();

  async function logIn() {
    if (appInfo) {
      const supported = await Linking.canOpenURL(`${BASE_URL}/authorize?randomNumber=${appInfo.randomNumb}`)
      if (supported) {
        await Linking.openURL(`${BASE_URL}/authorize?randomNumber=${appInfo.randomNumb}`)
        setLoggedIn(true)
      } else {
        Alert.alert(`Don't know how to open this URL: ${BASE_URL}/authorize`);
      }
    }
  }

  function checkUserExists() {
    setTimeout(async () => {
      try {
        let info = await fetch(
          `${BASE_URL}/checkAccountCreation?randomNumber=${appInfo.randomNumb}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
        let result = await info.json();
        if (result.accountCreated === true) {
          obtainSpotifyProfile()
          setAlreadyUser(true)
        }
      } catch (err) {
        console.error(err)
      }
    }, 800);
  }

  const obtainSpotifyProfile = () => {
    setTimeout(async () => {
      try {
        let info = await fetch(
          `${BASE_URL}/profileNew?randomNumber=${appInfo.randomNumb}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );
        let result = await info.json();
        setAppInfo({ ...appInfo, userInfo: result })
      } catch (err) {
        console.error(err)
      }
    }, 300);
  }


  function createAccount() {
    setTimeout(async () => {
      try {
        await fetch(
          `${BASE_URL}/createAccount?userName=${username}&randomNumber=${appInfo.randomNumb}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (err) {
        console.error(err)
      }
    }, 300);
  }

  useEffect(() => {
    if (loggedIn) checkUserExists()
  }, [loggedIn])

  useEffect(() => {
    setAppInfo({ ...defaultAppInfo, randomNumb: Math.round(Math.random() * 1000000) })
  }, [])

  return (
    <>
      {!loggedIn ?
        <View style={login.container}>
          <View style={login.login}>
            <Text style={login.appName}>MusicReal</Text>
            <Pressable onPress={logIn} style={login.button}>
              <Text>
                Log in with Spotify
              </Text>
            </Pressable>
          </View>
        </View>
        :
        (alreadyUser ?
          <AppContext.Provider value={appInfo}>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={({ navigation }) => ({
                  headerLeft: () => (
                    <HeaderBackButton
                      onPress={navigation.goBack}
                    />
                  ),
                })}
              >
                <Stack.Screen
                  name="Home"
                  component={HomePage}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={Profile}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Friend Profile"
                  component={FriendProfile}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Friends"
                  component={Friends}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Account"
                  component={Account}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Help"
                  component={Help}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="About"
                  component={About}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Add Post"
                  component={AddPost}
                  options={{
                    headerShown: false,
                  }} />
                <Stack.Screen
                  name="All History"
                  component={AllHistory}
                  options={{
                    headerShown: false,
                  }} />
              </Stack.Navigator>
            </NavigationContainer>
          </AppContext.Provider>
          :
          <View style={login.container}>
            <View style={login.login}>
              <Text style={login.appName}>MusicReal</Text>
              <TextInput
                style={login.createUsername}
                placeholder={"Enter a Username"}
                onChangeText={username => setUserName(username)}
              />
              <Pressable onPress={createAccount} style={login.button}>
                <Text>
                  Create Account
                </Text>
              </Pressable>
            </View>
          </View>
        )}
    </>
  );
}

export const login = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#252525',
  },
  login: {
    alignSelf: 'center',
    position: 'absolute',
    top: '35%',
  },
  appName: {
    fontSize: 64,
    paddingHorizontal: '10px',
    fontWeight: 'bold',
    flex: 2,
    color: 'white',
    paddingVertical: 20,
    textAlign: 'center'
  },
  button: {
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    width: '200px'
  },
  createUsername: {
    color: 'grey',
    fontSize: 20,
    padding: '10px',
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 3,
    borderRadius: 10,
    marginBottom: 20,
  }
})

