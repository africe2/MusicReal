import React, { useState } from "react";
import { TouchableOpacity, ImageBackground, Text } from "react-native";

interface props {
    data: any,
    index: any,
    post: any
}

export const PastPost = (props: props) => {
    const data = props.data
    const post = props.post
    const [audio] = useState(new Audio(post[0].preview_url));
    const [audioStatus, setAudioStatus] = useState(true);


    function startAudio() {
        audio.play();
        setAudioStatus(false)
    }
    function pauseAudio() {
        audio.pause();
        setAudioStatus(true)
    }

    function handleClickDate() {
        if (audioStatus) {
            startAudio()
        } else {
            pauseAudio()
        }
    }

    return (
        <TouchableOpacity onPress={handleClickDate} style={{ flex: 1 }}>
            <ImageBackground source={{uri: post[0].coverPic}} style={{
                flex: 1,
                justifyContent: "center",
            }}>
                <Text style={{
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "#000000a0",
                    height: '50px',
                    fontSize: 18,
                }}>
                    {data}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    )
};