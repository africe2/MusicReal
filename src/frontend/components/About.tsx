import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { body, header } from './HomePage';
import { Menu } from './Menu';

export const About = ({ navigation }) => {
    const [openMenu, setOpenMenu] = useState(false);

    function handleMenuClick() {
        setOpenMenu(!openMenu)
    }

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
            <div style={about.container}>
                <h2>About</h2>
                <div style={about.paragraph}>
                    <Text style={{ color: 'white' }}>MusicReal is a music sharing app that allows users to spontaneously share the song they are
                        listening to on Spotify at a random moment in time each day or share a song
                        recommendation if they are not listening to a song at that given moment.</Text>
                </div>
            </div>
        </View>
    )
};

const about = StyleSheet.create({
    container: {
        color: 'white',
        textAlign: 'center',

    },
    paragraph: {
        textAlign: 'left',
        paddingLeft: '10px',
    },

});