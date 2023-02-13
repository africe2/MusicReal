import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import React, { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, View, Text } from "react-native"
import { BASE_URL, AppContext } from "../App"
import { UserInfo } from "../util/types"
import { body, header } from "./HomePage"
import { Menu } from "./Menu"
import { User } from "./User"

export const Friends = ({navigation}) => {
    const userInfo = useContext(AppContext).userInfo
    const [option, setOption] = useState('find')
    const [friendsList, setFriendsList] = useState<UserInfo[]>()
    const [possibleUsers, setPossibleUsers] = useState<UserInfo[]>()
    const [openMenu, setOpenMenu] = useState(false);
    // const [suggested, getSuggested] = useState<FriendInfo[]>()

    // const getSuggestedUsers = async () => {
    //     const info =  await fetch(
    //         `${BASE_URL}/getusers?userName=${userInfo.userName}`,
    //         {
    //             method: "GET",
    //             headers: { "Content-Type": "application/json" }
    //         }
    //     )
    //     const result = await info.json()
    //     getSuggested(result)
    // };

    function handleMenuClick() {
        setOpenMenu(!openMenu)
      }    

    const obtainFriends = async () => {
        try {
            let info = await fetch(
                `${BASE_URL}/getfriends?userName=${userInfo.userName}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
            let result = await info.json();
            setFriendsList(result.friends)
        } catch (err) {
            console.error(err)
        }
    }

    const searchFriend = async (input: string) => {
        try {
            let info = await fetch(
                `${BASE_URL}/selectFriends?userName1=${userInfo.userName}&userName2=${input}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
            let result = await info.json();
            setFriendsList(result.friends)
        } catch (err) {
            console.error(err)
        }
    }

    const searchUsers = async (input: string) => {
        try {
            let info = await fetch(
                `${BASE_URL}/getusers?userName=${input}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
            let result = await info.json();
            setPossibleUsers(result.users)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSearch = (input: string) => {
        if (option === 'find' && friendsList) {
            searchFriend(input)
        } else if (option === 'search') {
            searchUsers(input)
        }
    }
    
    useEffect(() => {
        obtainFriends();
    }, [option])

    navigation.addListener('focus', () => {
        // reset marker state
        setOpenMenu(false)
    });

    return (
        <View style={body.container}>
            <View style={header.container}>
                <Text style={header.appName} onPress={() => navigation.navigate('Home')}>MusicReal</Text>
                <Text style={header.icon_menu} onPress={() => setOpenMenu(true)}>
                    <FontAwesomeIcon style={header.icon} icon={faBars} />
                </Text>
                {openMenu &&
                    <Menu options={['Profile', 'Friends', 'Settings']} setOpenMenu={handleMenuClick} />
                }
            </View>
            <View>
                <ScrollView nestedScrollEnabled={true}>
                    <div style={friends.displayOptions}>
                        <button style={option === 'find' ? friends.onButton : friends.searchButton} onClick={() => setOption('find')}>Find Friends</button>
                        <button style={option === 'search' ? friends.onButton : friends.searchButton} onClick={() => setOption('search')}>Add Friend</button>
                    </div>
                    <input style={friends.search} type="text" placeholder={option === 'find' ? "Search Friends.." : "Search Users to add.."} onChange={(e) => handleSearch(e.target.value)} />
                    {(option === 'find' && friendsList) &&
                        <div>
                            {friendsList.map((friend, i) => (
                                <User key={i} info={friend} option={option} navigation={navigation}/>
                            ))}
                        </div>
                    }
                    {(option === 'search' && possibleUsers) &&
                        <div>
                            {possibleUsers.map((user, i) => {
                                if (user.userName !== userInfo.userName) {
                                    return (
                                        <User key={i} info={user} option={option} navigation={navigation}/>
                                    )
                                }
                            })}
                        </div>
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const friends = StyleSheet.create({
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