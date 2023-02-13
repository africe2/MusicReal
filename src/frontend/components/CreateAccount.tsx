import React, { useContext, useEffect, useState } from "react"
import { View, Pressable, Text, TextInput, StyleSheet } from "react-native"
import { CommonActions } from '@react-navigation/native';
import { AppContext, BASE_URL, login } from "../App";

export const CreateAccount = ({ navigation }) => {
    const [username, setUserName] = useState('');
    const [alreadyUser, setAlreadyUser] = useState(false)
    const appInfo = useContext(AppContext)
    

    function createAccount() {
        setTimeout(async () => {
            if (appInfo.randomNumb) {
                try {
                    await fetch(
                        `${BASE_URL}/createAccount?userName=${username}&randomNumber=${appInfo.randomNumb}`,
                        {
                            method: "GET",
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                    navigation.navigate('Home')
                } catch (err) {
                    console.error(err)
                }
            }
        }, 300);
    }

    function checkUserExists() {
        setTimeout(async () => {
            console.log(appInfo, 'checking')
            try {
                let info = await fetch(
                    `${BASE_URL}/checkAccountCreation?randomNumber=${appInfo.randomNumb}`, 
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    });
                let result = await info.json();
                if (result.accountCreated === true) {
                    setAlreadyUser(true)
                }
            } catch (err) {
                console.error(err)
            }
        }, 800);
    }

    useEffect(() => {
        //! check if user already exists, set alreadyUser to boolean
        checkUserExists()
    }, [])

    useEffect(() => {
        if (alreadyUser) {
            navigation.dispatch(
                CommonActions.reset({
                    routes: [{ name: 'Home' }],
                }))
        }
    }, [alreadyUser])

    return (
        <View style={login.container}>
            <View style={login.login}>
                <Text style={login.appName}>MusicReal</Text>
                <TextInput
                    style={styles.createUsername}
                    placeholder={"Enter a Username"}
                    onChangeText={username => setUserName(username)}
                />
                <Pressable onPress={createAccount} style={styles.button}>
                    <Text>
                        Create Account
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    createUsername: {
        color: 'grey',
        fontSize: 20,
        padding: '10px',
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 3,
        borderRadius: 10,
        marginBottom: 20,
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
    }
})