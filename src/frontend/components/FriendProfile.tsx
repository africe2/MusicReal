import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { TextInput, View, Text, StyleSheet, Pressable, Image } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useLocation } from "react-router-native"
import { AppContext, BASE_URL } from "../App"
import { home, ProfileInfo, UserInfo } from "../util/types"
import { account } from "./Account"
import { body, header } from "./HomePage"
import { Menu } from "./Menu"
import { userStyle } from "./User"

const sampleSharedSongs = {
    artist: "Peppa Pig",
    songTitle: "Peppa Vibes sdflkjdfs lkfsjdldfslkjdskl sdfj lskdfj lsdkfj sdfklj lsdkfj lsdfkj dfsj kjdflksfd ldfskjfs dllfskjdlsjdflkdfslkjdfs  dfsl kjdfsjdfsk dfsl ",
    albumCover: "https://i.pinimg.com/originals/e8/bb/10/e8bb108d1aab76692f6db2af816b8dec.jpg"
}

export const FriendProfile = ({ navigation, route }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [sharedSongs, setSharedSongs] = useState([])
    const [hits, setHits] = useState([])
    const appInfo = useContext(AppContext)

    function handleMenuClick() {
        setOpenMenu(!openMenu)
    }

    navigation.addListener('focus', () => {
        // reset marker state
        setOpenMenu(false)
    });

    async function getSharedSongs() {
        try {
            const info = await fetch(
                `${BASE_URL}/sharedSongs?randomNumber=${appInfo.randomNumb}&friendUser=${route.params.friend.userName}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
            const result = await info.json();
            result.sharedSongs.forEach(async song => {
                setHits(prevHits => [...prevHits, song.hits] )
                try {
                    const info = await fetch(
                        `${BASE_URL}/getSongInfo?randomNumber=${appInfo.randomNumb}&songId=${song.songId}`,
                        {
                            method: "GET",
                            headers: { "Content-Type": "application/json" }
                        }
                    );
                    const result = await info.json();
                    setSharedSongs(prevSongs => [...prevSongs, result])
                } catch (err) {
                    console.log(err)
                }
            })
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getSharedSongs()
    }, [])

    console.log(sharedSongs, hits)

    return (
        <View style={body.container}>
            <View style={header.container}>
                <Pressable style={styles.iconContainer} onPress={() => navigation.navigate('Friends')}>
                    <FontAwesomeIcon style={{ color: 'white', height: '25px', width: '25px' }} icon={faChevronLeft} />
                </Pressable>
                <Text style={header.appName} onPress={() => navigation.navigate('Friends')}>Back</Text>
                <Text style={header.icon_menu} onPress={() => setOpenMenu(true)}>
                    <FontAwesomeIcon style={header.icon} icon={faBars} />
                </Text>
                {openMenu &&
                    <Menu options={['Profile', 'Friends', 'Settings']} setOpenMenu={handleMenuClick} />
                }
            </View>
            <View style={styles.picContainer}>
                <img style={styles.accountPic} src={'https://static.wikia.nocookie.net/peppapedia/images/4/4a/Zoe.png'} />
            </View>
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.userName}>{route.params.friend.userName}</td>
                    </tr>
                    <tr>
                        <td style={styles.row}>
                            <Text style={{ color: 'white', fontSize: 18 }}>Name: </Text>
                        </td>
                        <td><Text style={{ color: 'white', fontSize: 18 }}>{route.params.friend.userName}</Text></td>
                    </tr>
                </tbody>
            </table>
            <View style={{ padding: "30px", paddingBottom: 0 }}>
                <Text style={styles.userName}>You both posted...</Text>
            </View>
            <ScrollView horizontal={true}>
                {sharedSongs.length === 0 ?
                    <View style={sharedSong.container}>
                        <View ><Text numberOfLines={6} style={sharedSong.text}>{"You have no similar songs :("}</Text></View>
                    </View>
                    :
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        {sharedSongs.map((song, i) => {
                            console.log(song)
                            return (
                            <View key={i} style={sharedSong.container}>
                                <Image style={sharedSong.albumCover} source={{ uri: song.coverPic }} />
                                <View ><Text numberOfLines={6} style={sharedSong.text}>{song.artist}</Text></View>
                                <View ><Text numberOfLines={6} style={sharedSong.text}>{song.title}</Text></View>
                                <View ><Text numberOfLines={6} style={{ color: 'grey', alignSelf: 'center', textAlign: 'center' }}>{`${hits[i]} other users posted this song`}</Text></View>
                            </View>
                            )
                        })}
                    </View>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        marginLeft: '5px',
        marginTop: '8px'
    },
    table: {
        padding: "30px",
        fontSize: 20
    },
    picContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    accountPic: {
        height: 150,
        width: 150,
        borderRadius: 150 / 2
    },
    row: {
        width: "30%",
    },
    userName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
})

const sharedSong = StyleSheet.create({
    container: {
        paddingHorizontal: '20px',
        paddingVertical: '10px',
        margin: '10px',
        maxHeight: '250px',
        width: '150px',
    },
    albumCover: {
        height: '100px',
        width: '100px',
        alignSelf: 'center'
    },
    text: {
        color: 'white',
        alignSelf: 'center'
    }
})

function useFocusEffect(arg0: any) {
    throw new Error("Function not implemented.")
}
