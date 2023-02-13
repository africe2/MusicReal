import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, ScrollView, Dimensions, Modal } from 'react-native';
import { Menu } from './Menu';
import { Post } from './Post';
import { AddPost } from './AddPost';
import { home } from '../util/types';
import { AppContext } from '../App';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react"; 

const post = {
  userName: "test",
  songId: "test songId",
  title: "test song title",
  artist: "test artist",
  coverPic: "",
  time: "11/29/2022"
}

export const HomePage = ({ navigation }) => {
  const [homepage, setHomepage] = useState<home[]>([])
  const [openMenu, setOpenMenu] = useState(false);
  const [updateHome, setUpdateHome] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const BASE_URL = "https://cosmic-talent-364620.uc.r.appspot.com"
  const appInfo = useContext(AppContext)

  const obtainHome = () => {
    setUpdateHome(false)
    setTimeout(async () => {
        try {
          let info = await fetch(
            `${BASE_URL}/homepage?randomNumber=${appInfo.randomNumb}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" }
            }
          );
          let result = await info.json();
          setHomepage(result.posts)
        } catch (err) {
          console.error(err)
        }
    }, 300);
  }

  // to use when api down
  const samplePosts = []
  for (let i = 0; i < 4; i++) {
    samplePosts.push(post)
  }


  function handleMenuClick() {
    setOpenMenu(!openMenu)
  }

  function handleModal() {
    setModalVisible(!modalVisible)
    setOpenMenu(false)
  }

  useEffect(() => {
    obtainHome()
    // setHomepage(samplePosts)
  }, [])

  useEffect(() => {
    if (updateHome) obtainHome()
    // setHomepage(samplePosts)
  }, [updateHome])

  useFocusEffect(useCallback(() => {
    obtainHome()
  }, []))

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
        {(openMenu && !modalVisible) &&
          <Menu options={['Profile', 'Friends', 'Settings']} setOpenMenu={handleMenuClick} />
        }
      </View>
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={body.posts}
        >
          {homepage.map((post, i) => (
            <Post key={i} username={post.userName} time={post.time} songTitle={post.title} songArtist={post.artist} albumCover={post.coverPic} profilePic={"https://static.wikia.nocookie.net/peppapedia/images/4/4a/Zoe.png"} preview_url={post.preview_url} />
          ))}
        </ScrollView>
      </View>
      <View style={body.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            handleModal;
          }}
        >
          <AddPost navigation={navigation} setModalVisible={() => setModalVisible(!modalVisible)} updateHome={setUpdateHome} setHomepage={() => setHomepage} handleMenuClick={() => setOpenMenu(false)} />
        </Modal>
      </View>
      <View style={footer.container}>
        <View style={addPost.container}>
          <Pressable style={addPost.plus} onPress={() => setModalVisible(!modalVisible)} >
            <FontAwesomeIcon icon={faPlus} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export const body = StyleSheet.create({
  container: {
    backgroundColor: "#252525",
    flex: 1,
    display: 'flex',
    width: '100%'
  },
  posts: {
    height: Dimensions.get('window').height - 113
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
})

export const header = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    height: '50px',
    display: 'flex',
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5
  },
  appName: {
    fontSize: 25,
    paddingHorizontal: '10px',
    fontWeight: 'bold',
    flex: 2,
    color: 'white'
  },
  icon_menu: {
    paddingHorizontal: '10px',
    top: '10px',
    position: 'relative',
  },
  //! fix back arrow icon
  icon: {
    color: 'white',
    height: '25px',
    width: '25px'
  }
})
export const footer = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    height: '55px',
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    zIndex: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: -3.84,
    elevation: -5,
  },
})

export const addPost = StyleSheet.create({
  plus: {
    borderRadius: 50,
    marginLeft: '15px',
  },
  container: {
    backgroundColor: 'white',
    marginRight: '25px',
    width: '50px',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center'
  }
})