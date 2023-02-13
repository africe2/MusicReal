import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useContext, useEffect, useState } from "react"
import { Image, StyleSheet, View, Text, Pressable, PanResponderGestureState } from "react-native"
import { buttons, songInfo } from "./Post";
import GestureRecognizer from 'react-native-swipe-gestures';
import { AppContext, BASE_URL } from "../App";
import { home, PostInfo } from "../util/types";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { header } from "./HomePage";
import { Menu } from "./Menu";


const sampleSongData = {
    songTitle: "current song",
    songArtist: "the artist",
    albumCover: "https://i.pinimg.com/originals/b4/75/00/b4750046d94fed05d00dd849aa5f0ab7.jpg"
}

interface props {
    navigation: any,
    setModalVisible: () => void,
    updateHome: (boolean) => void,
    setHomepage: (homepage: home[]) => void,
    handleMenuClick: () => void
}

export const AddPost = (props: props) => {
    const [openMenu, setOpenMenu] = useState(false);
    const navigation = props.navigation
    const appInfo = useContext(AppContext)
    const [currentSong, setCurrentSong] = useState<home>()

    navigation.addListener('focus', () => {
        // reset marker state
        setOpenMenu(false)
    });

    function handleAddPost() {
        props.setModalVisible()
        setTimeout(async () => {
            try {
                await fetch(
                    `${BASE_URL}/addPost?randomNumber=${appInfo.randomNumb}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    }
                );
                let info = await fetch(
                    `${BASE_URL}/homepage?randomNumber=${appInfo.randomNumb}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    }
                );
                let newHomepage = await info.json();
                props.setHomepage(newHomepage.posts)
                props.updateHome(true)
            } catch (err) {
                console.error(err)
            }
        }, 300);
    }

    function handleMenuClick() {
        props.handleMenuClick()
    }

    function getCurrentSong() {
        setTimeout(async () => {
            try {
                const result = await fetch(
                    `${BASE_URL}/getCurrentSong?randomNumber=${appInfo.randomNumb}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    }
                );
                let info = await result.json()
                setCurrentSong(info)
            } catch (err) {
                console.error(err)
            }
        }, 300);
    }

    useEffect(() => {
        // to close menu if open
        handleMenuClick()
        getCurrentSong()
    })
    // function handleSwipeDown(e: PanResponderGestureState) {

    // }

    //! add option to search through songs to post instead
    return (
        <>
            {/* <View style={header.container}>
                <Text style={header.appName} onPress={() => navigation.navigate('Home Page')}>MusicReal</Text>
                <Text style={header.icon_menu} onPress={() => setOpenMenu(!openMenu)}>
                    <FontAwesomeIcon style={header.icon} icon={faBars} />
                </Text>
                {openMenu &&
                    <Menu options={['Profile', 'Friends', 'Settings']} setOpenMenu={() => setOpenMenu(!openMenu)} />
                }
            </View> */}
            <View style={styles.centeredView}>
                <GestureRecognizer style={styles.modalView} onSwipeDown={props.setModalVisible}>
                    <View style={styles.pullDownContainer}>
                        <View style={styles.pullDownBar}>
                            <View style={styles.bar} />
                        </View>
                    </View>
                    {currentSong ?
                        <View style={styles.albumContainer}>
                            <Image style={styles.album}
                                source={{ uri: currentSong.coverPic }} />
                        </View>
                        :
                        <View style={styles.albumContainer}>
                            <Text style={{color: 'white', width: '100vw', textAlign: 'center'}}>You are not currently listening to any song</Text>
                        </View>

                    }
                    {currentSong &&
                        <View style={styles.footer}>
                            <div style={songInfo.container}>
                                {/* the artist, songname, play/share/save buttons etc */}
                                <Text style={songInfo.title}>{currentSong.title}</Text>
                                <Text style={songInfo.artist}>{currentSong.artist}</Text>
                            </div>
                        </View>
                    }
                    <View style={styles.addContainer}>
                        <View style={styles.addPostContainer}>
                            <Pressable style={styles.post} onPress={handleAddPost} >
                                {/* <Pressable style={addPost.plus} onPress={() => navigation.navigate('Add Post')} > */}
                                <Text>Post</Text>
                            </Pressable>
                        </View>
                    </View>
                </GestureRecognizer>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    albumContainer: {
        width: "100%",
        display: 'flex',
        justifyContent: 'center',
    },
    album: {
        width: 350,
        height: 350,
        borderRadius: 15,
        margin: 0
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "#252525",
        borderRadius: 50,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 35,
        paddingBottom: 10,
        paddingTop: 0,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    addContainer: {
        width: '100%',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 5,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: -3.84,
        elevation: -5,
    },
    addPostContainer: {
        backgroundColor: 'white',
        width: '100px',
        padding: '5px',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        margin: 10
    },
    post: {
        borderRadius: 50,
        alignSelf: 'center',
    },
    pullDownBar: {
        position: 'absolute',
        top: 10
    },
    bar: {
        width: '120px',
        height: '5px',
        borderRadius: 3,
        backgroundColor: 'grey'
    },
    pullDownContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '35px'
    }
})