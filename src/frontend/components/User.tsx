import { faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useContext, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { BASE_URL, AppContext } from "../App";
import { UserInfo } from "../util/types"
import { useNavigation } from '@react-navigation/native';
import { useNavigate } from "react-router-native";
interface props {
    info: UserInfo,
    option: string,
    navigation: any
}
export const User = (props: props) => {
    const user = props.info
    const [isFriend, setIsFriend] = useState(props.option === 'find' ? true : false)
    const userInfo = useContext(AppContext).userInfo
    const navigation = props.navigation

    const deleteFriend = async (friend: string) => {
        try {
            await fetch(
                `${BASE_URL}/deleteFriend?userName1=${userInfo.userName}&userName2=${friend}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
        } catch (err) {
            console.error(err)
        }
    }

    const addFriend = async (user: string) => {
        try {
            await fetch(
                `${BASE_URL}/addFriend?userName1=${userInfo.userName}&userName2=${user}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
        } catch (err) {
            console.error(err)
        }
    }

    function handleFriend() {
        if (isFriend === true) {
            setIsFriend(!isFriend)
            deleteFriend(user.userName)
        } else {
            console.log('add')
            setIsFriend(!isFriend)
            addFriend(user.userName)
        }
    }

    return (
        <div style={userStyle.row}>
            <Pressable onPress={() => navigation.navigate('Friend Profile', {friend: user})}>
                <img style={userStyle.pfp} src={'https://static.wikia.nocookie.net/peppapedia/images/4/4a/Zoe.png'} />
            </Pressable>
            <div style={userStyle.userInfo}>
                <div style={userStyle.name}>{user.userName}</div>
                {/* <div style={userStyle.userName}>{user.userName}</div> */}
            </div>
            <button style={userStyle.friendButton} onClick={handleFriend}>
                <View style={userStyle.nestedButton}>
                    {isFriend ?
                        <FontAwesomeIcon icon={faUsers} /> : <FontAwesomeIcon icon={faPlus} />
                    }
                    <div style={{ paddingLeft: '3px' }}>{isFriend ? 'Friend' : 'Add'}</div>
                </View>
            </button>
        </div>
    )
}

export const userStyle = StyleSheet.create({
    displayOptions: {
        display: 'flex',
        justifyContent: 'center',
    },
    searchButton: {
        height: '30px',
        textAlign: 'center'
    },
    friendButton: {
        height: '22px',
        alignItems: 'flex-end'
    },
    nestedButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onButton: {
        backgroundColor: 'transparent',
        color: 'white',
        height: '30px',
    },
    search: {
        margin: '20px',
        height: '20px',
        width: '80%',
        alignSelf: 'center'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        margin: '10px'
    },
    pfp: {
        width: '50px',
        height: '50px',
        borderRadius: 50,
        marginLeft: '10px',
    },
    userInfo: {
        marginLeft: '10px',
        display: 'flex',
        flexDirection: 'column',
        flex: 2
    },
    name: {
        color: 'white',
        paddingHorizontal: '10px',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userName: {
        color: 'white',
        fontSize: 17,
        paddingHorizontal: '10px',
    }
})