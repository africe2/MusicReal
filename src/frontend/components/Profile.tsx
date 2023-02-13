import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Pressable } from 'react-native';
import { BASE_URL, AppContext } from "../App";
import { home, PostInfo } from '../util/types';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { body, header } from './HomePage';
import { Menu } from './Menu';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component'
import { currMonth, currMonthNumber, currYear, daysOfWeek, getAllDatesOfYear, monthNumber } from '../util/helpers';
import { PastPost } from './PastPost';

const sampleData = {
    userName: "anna",
    name: "anna",
    email: "gmail.com",
    profile_pic: "https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F01043344-4ed8-11ec-a89c-4bee41baeb9c.jpg?crop=1843%2C2304%2C806%2C0",
    password: "paskdjflj"
}


export const image = { uri: "https://deadline.com/wp-content/uploads/2020/01/7187236618f049ed3223173714a5cdd6.jpg?w=681&h=383&crop=1" }


// https://cosmic-talent-364620.uc.r.appspot.com/getPost?randomNumber=448699&month=12&day=6&year=2022

export const Profile = ({ navigation }) => {
    const appInfo = useContext(AppContext)
    const [history, setHistory] = useState<PostInfo[]>()
    const [openMenu, setOpenMenu] = useState(false);
    const allDates = getAllDatesOfYear()

    const pastPost = (data, index, post) => (
        <PastPost data={data} index={index} post={post} />
    )

    const emptyPost = (data, index) => {
        return (
            <TouchableOpacity onPress={() => console.log('clicked')} style={{ flex: 1 }}>
                <Text style={{
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "#252525",
                    height: '50px',
                    fontSize: 18,
                }}>
                    {data}
                </Text>
            </TouchableOpacity>
        )
    }

    const getUserHistory = async () => {
        try {
            const info = await fetch(
                `${BASE_URL}/getUserPostHistory?randomNumber=${appInfo.randomNumb}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
            const result = await info.json();
            setHistory(result.history)
        } catch (err) {
            console.error(err)
        }
    }

    function handleMenuClick() {
        setOpenMenu(!openMenu)
    }

    useEffect(() => {
        getUserHistory()
    }, [])

    navigation.addListener('focus', () => {
        // reset marker state
        setOpenMenu(false)
    });

    function getPost(month, day) {
        const pastPost = history.filter((post) => {
            return (
                new Date(post.time).getMonth() == month && new Date(post.time).getDate() + 1 == day
            )
        }
        )
        return pastPost
    }

    const datesFilled = (num: number) => {
        const datesFilled = []
        if (history) {
            history.forEach(post => {
                if (new Date(post.time).getMonth() === num) {
                    if (!datesFilled.includes((new Date(post.time).getDate() + 1))) {
                        datesFilled.push((new Date(post.time).getDate() + 1))
                    }
                }
            })
        }
        return datesFilled
    }

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
            <View style={profile.container}>
                <View style={profile.profileInfoContainer}>
                    <img style={profile.profilePic} src={appInfo.userInfo.profile_pic} />
                    <View style={profile.userInfo}>
                        <Text style={profile.userName}>{appInfo.userInfo.userName} </Text>
                        <Text style={profile.email}>{appInfo.userInfo.email} </Text>
                    </View>
                </View>
                <Text style={profile.songHistory}>Song History</Text>
                <Text style={profile.month}>{currMonth + ' ' + currYear}</Text>
                <View style={calendar.container}>
                    <Table style={calendar.table}>
                        <Row style={calendar.header} data={daysOfWeek} textStyle={calendar.text} />
                        {allDates &&
                            allDates[monthNumber].map((rowData, index) => (
                                <TableWrapper key={index} style={calendar.wrapper}>
                                    {
                                        rowData.map((cellData, cellIndex) => (<Cell style={calendar.cell} key={cellIndex} data={datesFilled(monthNumber).includes(cellData) ? pastPost(cellData, index, getPost(monthNumber, cellData)) : emptyPost(cellData, index)} textStyle={calendar.text} />))
                                    }
                                </TableWrapper>
                            ))
                        }
                    </Table>
                </View>
                <View>
                    <Text style={profile.footer} >Click an album cover to play a short snippet of the song!</Text>
                    <Pressable style={profile.allHistory} onPress={() => navigation.navigate('All History')}>
                        <Text style={{ color: 'white' }}>View All History</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
};

const profile = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    profileInfoContainer: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '15px'

    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '20px',
        textAlign: 'left'
        // more padding and increase font size, make username above name and bigger than name

    },
    profilePic: {
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
    },
    userName: {
        color: 'white',
        fontSize: 20,
    },
    email: {
        color: 'white',
        fontSize: 18,
    },
    text: {
        color: 'white'
    },
    songHistory: {
        color: 'white',
        textAlign: 'left',
        paddingLeft: '15px',
        paddingVertical: '15px',
        fontWeight: 'normal',
        fontSize: 18,
        margin: 0,
        textDecorationLine: 'underline'

    },
    month: {
        color: 'white',
        textAlign: 'center',
        paddingLeft: '15px',
        fontWeight: 'normal',
        fontSize: 15,
    },
    footer: {
        color: 'white',
        textAlign: 'center',
        fontSize: 12,

    },
    allHistory: {
        borderColor: 'white',
        borderWidth: 1,
        width: '150px',
        padding: '5px',
        borderRadius: 5,
        alignSelf: 'center',
        margin: 10
    }
});


const calendar = StyleSheet.create({
    table: {
        width: '100%'
    },
    container: {
        flex: 1
    },
    header: {
        height: '50px',
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    cell: {
        height: '50px',
        fontSize: 20,
        margin: 3,
        width: '50px'
    },
    text: {
        color: 'white'
    },
})