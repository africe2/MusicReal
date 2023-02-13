import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { Text, View, StyleSheet, Pressable, ImageBackground, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { AppContext, BASE_URL } from '../App'
import { daysOfWeek, currMonthNumber, getAllDatesOfYear, monthNumber, currYear, monthNames } from '../util/helpers'
import { PostInfo } from '../util/types'
import { body, header } from './HomePage'
import { Menu } from './Menu'
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component'
import { image } from './Profile'
import { PastPost } from './PastPost'

export const AllHistory = ({ navigation }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const appInfo = useContext(AppContext)
    const [history, setHistory] = useState<PostInfo[]>()
    const [months, setMonths] = useState([])
    const allDates = getAllDatesOfYear()

    const pastPost = (data, index, post) => (
        <PastPost data={data} index={index} post={post} />
    )

    const emptyPost = (data, index) => (
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

    function handleMenuClick() {
        setOpenMenu(!openMenu)
    }

    navigation.addListener('focus', () => {
        // reset marker state
        setOpenMenu(false)
    });

    const getUserHistory = async () => {
        try {
            const info = await fetch(
                `${BASE_URL}/getUserPostHistory?userName=${appInfo.userInfo.userName}&randomNumber=${appInfo.randomNumb}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );
            const result = await info.json();
            setHistory(result.history)
            const tempMonths = []
            result.history.forEach(post => {
                if (!tempMonths.includes(new Date(post.time).getMonth())) {
                    tempMonths.push(new Date(post.time).getMonth())
                }
            })
            setMonths(tempMonths.sort((a, b) => a - b))
        } catch (err) {
            console.error(err)
        }
    }

    function getPost(month, day) {
        const pastPost = history.filter((post) => {
            return (
                new Date(post.time).getMonth() == month && new Date(post.time).getDate() + 1 == day
            )
        }
        )
        return pastPost
    }

    useEffect(() => {
        getUserHistory()
    }, [])

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
            <View style={{ paddingHorizontal: '15px' }}>
                <Pressable onPress={() => navigation.navigate('Profile')}>
                    <Text style={{ color: 'white' }}>Go Back</Text>
                </Pressable>
            </View>
            <ScrollView style={styles.container}>
                {months.map((month, i) => (
                    <View style={styles.tableContainer} key={i}>
                        <Text style={styles.month}>{monthNames[month] + ' ' + currYear}</Text>
                        <Table style={styles.table}>
                            <Row style={styles.header} data={daysOfWeek} textStyle={styles.text} />
                            {allDates &&
                                allDates[month].map((rowData, index) => (
                                    <TableWrapper key={index} style={styles.wrapper}>
                                        {
                                            rowData.map((cellData, cellIndex) => (<Cell style={styles.cell} key={cellIndex} data={datesFilled(month).includes(cellData) ? pastPost(cellData, index, getPost(month, cellData)) : emptyPost(cellData, index)} textStyle={styles.text} />))
                                        }
                                    </TableWrapper>
                                ))
                            }
                        </Table>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    table: {
        width: '100%'
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
    month: {
        color: 'white',
        textAlign: 'center',
        paddingLeft: '15px',
        fontWeight: 'normal',
        fontSize: 15,
    },
    tableContainer: {
    }
})