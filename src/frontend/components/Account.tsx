import React, { useState, useContext } from "react";
import { profileSampleData } from "../util/sampleData"
import { StyleSheet, TextInput, View, Text } from 'react-native';
// import { defaultUserInfo } from "./Profile";
import { AppContext } from "../App";
import { ProfileInfo } from "../util/types";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { body, header } from "./HomePage";
import { Menu } from "./Menu";

export const Account = ({ navigation }) => {
    // use this sample data for the profile
    // const profileData = profileSampleData;
    const userInfo = useContext(AppContext).userInfo
    const [updatedInfo, setUpdatedInfo] = useState<ProfileInfo>(userInfo)
    const BASE_URL = "https://cosmic-talent-364620.uc.r.appspot.com"
    const [openMenu, setOpenMenu] = useState(false);
    const [badEmail, setBadEmail] = useState(false);

    const updateEmail = async (newEmail: string, user: string) => {
        try {
            await fetch(
                `${BASE_URL}/updateEmail?newEmail=${newEmail}&userName=${user}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
            // obtainProfile()
        } catch (err) {
            console.error(err)
        }
    }

    async function handleEmailChange(newEmail: string) {
        try {
            const info = await fetch(
                `${BASE_URL}/emailInUse?email=${newEmail}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
            const result = await info.json()
            if (result.emailInUse) {
                setBadEmail(true)
            } else {
                updateEmail(newEmail, userInfo.userName)
            }
            // obtainProfile()
        } catch (err) {
            console.error(err)
        }
    }

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
            <div style={account.container}>
                <div style={account.picContainer}>
                    <img style={account.accountPic} src={userInfo.profile_pic} />
                </div>
                <table style={account.table}>
                    <tbody>
                        <tr>
                            <td style={account.userName}>{userInfo.userName}</td>
                        </tr>
                        <tr>
                            <td style={account.row}>Name: </td>
                            <td>{userInfo.name}</td>
                        </tr>
                        <tr>
                            <td style={account.row}>Email: </td>
                            <td>
                                <TextInput
                                    style={account.info}
                                    placeholder={userInfo.email}
                                    onChangeText={email => setUpdatedInfo({ ...userInfo, email: email })}
                                    onBlur={() => handleEmailChange(updatedInfo.email)}
                                />
                            </td>
                        </tr>
                        {badEmail && 
                        <tr>
                            <td style={account.row}> </td>
                            <td>
                            <Text style={{color: 'red', fontSize: 16, paddingLeft: '30px',}}>Email already in use</Text>
                            </td>
                        </tr>
                        }
                    </tbody>
                </table>
                {/* <h2>Change Password</h2>
                <table style={account.table}>
                    <tbody>
                        <tr>
                            <td style={account.row}>Current Password: </td>
                            <td>
                                <TextInput
                                    style={account.password}
                                    placeholder="Input old password"
                                    onChangeText={password => console.log(password)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={account.row}>New Password: </td>
                            <td>
                                <TextInput
                                    style={account.password}
                                    placeholder="Input new password"
                                    onChangeText={password => console.log(password)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={account.row}>Confirm Password: </td>
                            <td>
                                <TextInput
                                    style={account.password}
                                    placeholder="Re-input new password"
                                    onChangeText={password => console.log(password)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={account.footer}>
                    <button>Confirm</button>
                </div> */}
            </div>
        </View>
    )

};

export const account = StyleSheet.create({
    container: {
        color: 'white',
    },
    table: {
        padding: "30px",
        width: "100%",
        fontSize: 20
    },
    picContainer: {
        display: 'flex',
        justifyContent: 'center',
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
        fontWeight: 'bold'
    },
    info: {
        color: 'white',
        fontSize: 20,
        paddingLeft: '30px',
    },
    password: {
        color: 'grey',
        fontSize: 20,
        paddingLeft: '30px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        paddingRight: '20px'
    },
});

