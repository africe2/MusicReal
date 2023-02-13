import { faBookmark, faCirclePlay, faPaperPlane, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Image, View, Pressable } from 'react-native';

interface post {
    username: string,
    time: string,
    songTitle: string,
    songArtist: string,
    albumCover: string,
    profilePic: string,
    preview_url: string,
}

export const Post = (props: post) => {
    const [audioStatus, setAudioStatus] = useState(true)
    // const audio = new Audio(props.preview_url)
    const [audio, setAudio] = useState(new Audio(props.preview_url));

    function startAudio() {
        audio.play();
        setAudioStatus(false)
    }
    function pauseAudio() {
        audio.pause();
        setAudioStatus(true)
    }

    useEffect(() => {
        setAudio(new Audio(props.preview_url))
    }, [props.preview_url])

    return (
        <View style={post.container}>
            <div style={post.header}>
                {/* post header w user and profile*/}
                <Image style={post.profilePic}
                    source={{ uri: props.profilePic }} />
                <div style={post.userInfo}>
                    <Text style={post.username}>{props.username}</Text>
                    <Text style={post.time}>{props.time}</Text>
                </div>
            </div>
            <div style={post.albumContainer}>
                {/* actual post */}
                <Image style={post.album}
                    source={{ uri: props.albumCover }} />
            </div>
            <div style={post.footer}>
                <div style={songInfo.container}>
                    {/* the artist, songname, play/share/save buttons etc */}
                    <Text style={songInfo.title}>{props.songTitle}</Text>
                    <Text style={songInfo.artist}>{props.songArtist}</Text>
                </div>
                <div style={buttons.container}>
                    {audioStatus ?
                        <Pressable onPress={startAudio}>
                            <FontAwesomeIcon style={buttons.button} icon={faCirclePlay} />
                        </Pressable>
                        :
                        <Pressable onPress={pauseAudio}>
                            <FontAwesomeIcon style={buttons.button} icon={faPauseCircle} />
                        </Pressable>
                    }
                    {/* <FontAwesomeIcon style={buttons.button} icon={faPlay}/> */}
                    {/* <FontAwesomeIcon style={buttons.button} icon={faBookmark} />
                    <FontAwesomeIcon style={buttons.button} icon={faPaperPlane} /> */}
                </div>
            </div>
        </View>
    )
};

export const post = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginVertical: '20px'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '15px'
    },
    profilePic: {
        width: '40px',
        height: '40px',
        borderRadius: 50,
        marginLeft: '10px',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    username: {
        color: 'white',
        paddingHorizontal: '10px',
        fontSize: 15,
        fontWeight: 'bold',
    },
    time: {
        color: 'white',
        fontSize: 12,
        paddingHorizontal: '10px',
    },
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
    footer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    }
});
export const songInfo = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '10px',
        flex: 2
    },
    title: {
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '20px',
        fontWeight: 'bold',
        fontSize: 16,
    },
    artist: {
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '20px',
    }
});
export const buttons = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginRight: '20px',
    },
    button: {
        height: '25px',
        width: '25px',
        color: 'white',
        paddingHorizontal: '5px',
    }
});
