import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { body, header } from './HomePage';
import { Menu } from './Menu';

export const Help = ({ navigation }) => {
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
                <Text style={header.icon_menu} onPress={() => setOpenMenu(!openMenu)}>
                    <FontAwesomeIcon style={header.icon} icon={faBars} />
                </Text>
                {openMenu &&
                    <Menu options={['Profile', 'Friends', 'Settings']} setOpenMenu={handleMenuClick} />
                }
            </View>
            <div style={help.container}>
                <h2>Contact Info</h2>
                <div style={help.contactInfo}>
                    <Text style={{ color: 'white' }}>For any questions, comments, and/or concerns, please email us at musicreal@gmail.com.</Text>
                </div>
            </div>
        </View>
    )
};

const help = StyleSheet.create({
    container: {
        color: 'white',
        textAlign: 'center',
    },

    contactInfo: {
        textAlign: 'left',
        paddingLeft: '10px'
    },

});