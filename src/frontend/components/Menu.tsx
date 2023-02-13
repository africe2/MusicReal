import { faBars, faUser, faUsers, faGear, faChevronRight, faCircleExclamation, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { useNavigation } from '@react-navigation/native';

interface props {
    options: string[],
    setOpenMenu: () => void
}

export const Menu = (props: props) => {
    const route = useRoute();
    const navigation = useNavigation()
    const [openSettingsMenu, setOpenSettingsMenu] = useState(false)

    const options = !openSettingsMenu ? props.options : ['Account', 'Help', 'About']

    return (
        <View style={menu.container}>
            <View style={menu.menuHeader}>
                {openSettingsMenu &&
                    <Pressable style={menu.backContainer} onPress={() => setOpenSettingsMenu(false)}>
                        <View style={menu.iconContainer}>
                            <FontAwesomeIcon style={{ color: 'white', height: '25px', width: '25px' }} icon={faChevronLeft} />
                        </View>
                        <Text style={menu.back}>Back</Text>
                    </Pressable>
                }
                <Text style={menu.icon_menu} onPress={() => props.setOpenMenu()}>
                    <FontAwesomeIcon style={{ color: 'white', height: '25px', width: '25px', marginBottom: '15px' }} icon={faBars} />
                </Text>
            </View>
            {options && options.map((option, i) => {
                if (option === 'Settings') {
                    return (
                        <Pressable key={i} style={menu.row} onPress={() => setOpenSettingsMenu(!openSettingsMenu)}>
                            <FontAwesomeIcon style={menu.icon} icon={faGear} />
                            <Text style={menu.option}>{option}</Text>
                            <FontAwesomeIcon style={menu.icon} icon={faChevronRight} />
                        </Pressable>
                    )
                } else {
                    return (
                        <Pressable key={i} style={menu.row} onPress={() => navigation.navigate(option as never)}>
                            {option === 'Profile' && <FontAwesomeIcon style={menu.icon} icon={faUser} />}
                            {option === 'Friends' && <FontAwesomeIcon style={menu.icon} icon={faUsers} />}
                            {option === 'Account' && <FontAwesomeIcon style={menu.icon} icon={faGear} />}
                            {option === 'Help' && <FontAwesomeIcon style={menu.icon} icon={faCircleExclamation} />}
                            {option === 'About' && <FontAwesomeIcon style={menu.icon} icon={faCircleQuestion} />}
                            <Text style={menu.option}>{option}</Text>
                        </Pressable>
                    )
                }
            })}
        </View>
    )
}

const menu = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '70%',
        height: '25vh',
        backgroundColor: '#252525',
        zIndex: 10,
        marginLeft: '30%',
        flex: 1,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#252525'
    },
    menuHeader: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#252525',
        justifyContent: 'space-between'
    },
    option: {
        paddingVertical: '10px',
        color: 'white',
        fontSize: 25,
        flex: 2
    },
    icon_menu: {
        paddingHorizontal: '10px',
        top: '10px',
        position: 'relative',
    },
    icon: {
        paddingHorizontal: '10px',
        color: 'white',
        top: '20px',
        position: 'relative',
        height: '20px',
        width: '20px',
    },
    backContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    iconContainer: {
        color: 'white',
        marginLeft: '5px',
        marginTop: '10px'
    },
    back: {
        color: 'white',
        paddingHorizontal: '10px',
        fontSize: 23,
        paddingTop: '5px'
    }
})
