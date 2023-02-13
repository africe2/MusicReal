#!/usr/bin/env python
# encoding: utf-8

# [START gae_flex_quickstart]
import json
from flask import Flask, jsonify, request, redirect, session

import requests

import urllib

import mysql.connector
from mysql.connector.constants import ClientFlag
from flask_cors import CORS

import helper
import sys

from datetime import datetime

"""
try:
    url = 'http://192.168.1.70:5000/input' #need to change
    data = {'id':self.id, 'actions': self.timer.get_all_relay_actions()}
    
    req = requests.post(url, json=data)
    json = req.json()
    
    if json['clear'] == 'True':
        self.clear_actions()
    
    self.actions = json['actions']
    self.set_actions(self.actions)
    print('retrieved ', json)
except:
    print('server offline')


"""


"""
Function to grab USER_ID

"""


app = Flask(__name__)
CORS(app)
app.secret_key = 'the random string'
spotify_base_url = 'https://api.spotify.com/v1'
token = {} #random number to access token
base_url = 'https://cosmic-talent-364620.uc.r.appspot.com'



@app.route('/')
def index():
    return jsonify({'service_name': 'MusicReal', 'version': 1.7,
                    'description': 'app that lets you do BeReal but for music instead of pictures!'})
    
config = {
    'user': 'root',
    'password': 'cs411',
    'host': '34.170.81.182',
    'client_flags': [ClientFlag.SSL],
    'ssl_ca': 'ssl/server-ca.pem',
    'ssl_cert': 'ssl/client-cert.pem',
    'ssl_key': 'ssl/client-key.pem'
}


"""
deprecated :((
this is just for testing dont actually use this for the demo
"""
@app.route('/sql')
def sql():
    config['database'] = 'testdb'
    cnxn = mysql.connector.connect(**config)

    cursor = cnxn.cursor()  # initialize connection cursor
    cursor.execute('SELECT * FROM test') #sql query
    for row in cursor.fetchall():
        print(row)
    cnxn.close()  # close connection 

    # print('hi')
    return "TEST IMPLMENTATION COMPLETE"
    #sql here


"""
/profile
input: userName

output:
{
    "userName": adsfadsf,
    "email":adsfadsf@gmail.com,

}
"""
@app.route('/profile')
def profile():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    
    cursor = cnxn.cursor()
    cursor.execute('SELECT email FROM Profile where userName = \"' + request.args['userName'] + '\"')
    
    ret = ""
    for row in cursor.fetchall():
        ret += str(row[0])
    cnxn.close()
    return jsonify({"userName": request.args['userName'], "email": ret, "name": "mynameisjeff", "profile_pic": "https://simg.nicepng.com/png/small/51-515416_weed-clipart-mlg-peppa-y-george-png.png"})
"""
input: randomNumber
"""
@app.route('/profileNew')
def profileNew():
    
    url = spotify_base_url + '/me'
    params = {}
    json =  helper.makeGetRequest(token[request.args['randomNumber']], url, params)
    
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    cursor.execute("select userName from UserRef where userToken = '{}';".format(json['id']))
    userName = ""
    
    for row in cursor.fetchall():
        print(row)
        userName = row[0]
    cursor.execute('SELECT email FROM Profile where userName = \"' + userName + '\"')
    ret = ""
    for row in cursor.fetchall():
        ret += str(row[0])

    cnxn.close()
    
    return jsonify({"userName": userName, "email": ret, "name": json['display_name'], "profile_pic": json['images'][0]['url']})

@app.route('/callback')
def callback():
    code = request.args['code']
    randomNumber = request.args['state']
    token_url = 'https://accounts.spotify.com/api/token'
    authorization = "Basic ZGM3MDNlOGRlNzJlNDU2YzgwOWFiZDg1MDBmMDBlNmI6YzhlNzc4MWZhNmRjNDIwZGE5OWE1YTFlZGU1NGMxMmQ="
    
    #has to be the first redirect URI
    redirect_uri = base_url + "/callback" #"https://cosmic-talent-364620.uc.r.appspot.com/callback"
    
    headers = {'Authorization': authorization, 
             'Accept': 'application/json', 
             'Content-Type': 'application/x-www-form-urlencoded'}
    body = {'code': code, 
            'redirect_uri': redirect_uri, 
          'grant_type': 'authorization_code'}
    
    post_response = requests.post(token_url,headers=headers,data=body)
    
    print(post_response.json())
    
    session['token'] = post_response.json()['access_token']
    print('access token:')
    print(token)
    session['refresh_token'] = post_response.json()['refresh_token']
    
    token[randomNumber] = session['token']
    
    
    print(post_response.json())
    
    html =  """
    <!DOCTYPE html>
    <html>
    <head>
    <script> window.close(); </script>
    </head>
    <body>
    Logged in! Please close the current tab.
    </body>
    </html>
        """
    return html

"""
App should redirect to /authorize in order to login
this is fine

Run this link with /authorize?randomNumber=(number here)
"""
@app.route('/authorize')
def auth():
    client_id = 'dc703e8de72e456c809abd8500f00e6b'
    redirect_uri = base_url + "/callback" #'https://cosmic-talent-364620.uc.r.appspot.com/callback'
    
    scope = 'ugc-image-upload user-read-playback-state app-remote-control user-modify-playback-state playlist-read-private user-follow-modify playlist-read-collaborative user-follow-read user-read-currently-playing user-read-playback-position user-library-modify playlist-modify-private playlist-modify-public user-read-email user-top-read streaming user-read-recently-played user-read-private user-library-read'
    # see list of scopes: https://developer.spotify.com/documentation/general/guides/authorization/scopes/
    
    try:
        url = 'https://accounts.spotify.com/authorize?'
        params = {
            'response_type': 'code', 
            'client_id': client_id, 
            'redirect_uri': redirect_uri,
            'scope': scope,
            'state': request.args['randomNumber']
        }
        
        query_params = urllib.parse.urlencode(params)
        return redirect(url + query_params)
    except:
        print('Spotify login error')
        return 'Spotify login error. oops!'

"""
    /homepage
    Input: randomNumber, userName
    Output: 
    {
        posts: [
            {
            count:
            userName:
            songId:
            title:
            artist:
            time:
        }, 
        {
            count:
            userName:
            songId:
            title:
            artist:
            time:
        }
        ]
    }
"""
@app.route('/homepage')
def homepage():
    tempDict = {}
    count = 0
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    count = 0
    tempDict["posts"] = []
    userToken = token[request.args['randomNumber']]

    cursor = cnxn.cursor()
    userToken = token[request.args['randomNumber']]
    userProfile = helper.makeGetRequest(userToken, spotify_base_url + "/me")
    cursor.execute("select userName from UserRef where userToken = '{}';".format(userProfile['id']))
    
    userName = ""
    
    for row in cursor.fetchall():
        print(row)
        userName = row[0]
    # cursor.execute("SELECT po2.userName, s.songId, s.title, s.artist, t.time FROM Post po2 NATURAL JOIN Song s NATURAL JOIN (SELECT po.time as time FROM Post po NATURAL JOIN Profile pr NATURAL JOIN Song s GROUP BY po.time HAVING po.time = CAST(CURDATE() as Date)) as t ORDER BY t.time DESC;")
    cursor.execute("(SELECT userPost.userName, s.songId, s.title, s.artist, t.time FROM (SELECT * FROM test.Post  WHERE userName = 'leo') as userPost NATURAL JOIN Friends NATURAL JOIN Song s NATURAL JOIN (SELECT po.time as time FROM Post po NATURAL JOIN Profile pr NATURAL JOIN Song s GROUP BY po.time HAVING po.time = CAST(CURDATE() as Date)) as t) UNION (SELECT userPost.userName, s.songId, s.title, s.artist, t.time FROM (SELECT * FROM Post) as userPost JOIN (SELECT friendUser FROM Friends WHERE userName='{}') as friend ON (userPost.userName = friend.friendUser) NATURAL JOIN Song s NATURAL JOIN (SELECT po.time as time FROM Post po NATURAL JOIN Profile pr NATURAL JOIN Song s GROUP BY po.time HAVING po.time = CAST(CURDATE() as Date)) as t) ORDER BY time DESC;".format(userName))
    for row in cursor.fetchall():
        tempDict["posts"].append(dict())
        tempDict["posts"][-1]["count"] = count
        tempDict["posts"][-1]["userName"] = str(row[0])
        tempDict["posts"][-1]["songId"] = str(row[1])
        tempDict["posts"][-1]["title"] = str(row[2])
        tempDict["posts"][-1]["artist"] = str(row[3])
        tempDict["posts"][-1]["time"] = str(row[4])
        tempDict["posts"][-1]["coverPic"] = "https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg"
        count += 1

        if 'Peppa' not in row[0]:
            json = helper.makeGetRequest(userToken, spotify_base_url + "/tracks" + "/{}".format(row[1]))
            albumId = json["album"]["id"]
            albumCoverUrl =  helper.makeGetRequest(userToken, spotify_base_url + "/albums" + "/{}".format(albumId))["images"][0]["url"]

            tempDict['posts'][-1]['coverPic'] = albumCoverUrl
            tempDict['posts'][-1]['preview_url'] = json["preview_url"]
        else:
            tempDict['posts'][-1]['coverPic'] = 'https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg'
            tempDict['posts'][-1]['preview_url'] = "https://p.scdn.co/mp3-preview/b03b6b277fa0c0e7ebe29d36ec22fada6d22e7e7?cid=e8c9a07787d24221b33a8bdb722dcf34"
    cnxn.close()
    return jsonify(tempDict)


"""
/getPost

input: randomNumber, month, day, year
output: {
    "artist": "George",
    "songId": "1HeXLaKEbO",
    "time": "Wed, 19 Oct 2022 00:00:00 GMT",
    "title": "ecgkamifxu",
    "userName": "Peppa145",
    "preview_url": "something.com",
    "coverPic": "www.picture.com"
}
"""
@app.route('/getPost')
def getPost():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    userToken = token[request.args['randomNumber']]
    userProfile = helper.makeGetRequest(userToken, spotify_base_url + "/me")
    cursor.execute("select userName from UserRef where userToken = '{}';".format(userProfile['id']))
    
    userName = ""

    for row in cursor.fetchall():
        print(row)
        userName = row[0]
    print(userName)

    cursor.execute("SELECT userPost.userName, s.songId, s.title, s.artist, userPost.time FROM (SELECT * FROM test.Post  WHERE userName = '{}') as userPost NATURAL JOIN test.Song s WHERE MONTH(userPost.time) = '{}' AND DAY(userPost.time) = '{}' AND YEAR(userPost.time) = '{}'".format(userName, request.args['month'], request.args['day'], request.args['year']))

    count = 0
    ret = {}
    for row in cursor.fetchall():
        ret['userName'] = row[0]
        ret['songId'] = row[1]
        ret['title'] = row[2]
        ret['artist'] = row[3]
        ret['time'] = row[4]
        count += 1
    if count == 0:
        return {"error": "No posts found", "success": False}
    
    json = helper.makeGetRequest(userToken, spotify_base_url + "/tracks/{}".format(ret['songId']))
    albumId = json["album"]["id"]
    albumCoverUrl =  helper.makeGetRequest(userToken, spotify_base_url + "/albums" + "/{}".format(albumId))["images"][0]["url"]
    ret['coverPic'] = albumCoverUrl
    ret['preview_url'] = json["preview_url"]
    
    cnxn.close()
    # po2.userName, s.songId, s.title, s.artist, t.time
    return ret


"""
/getUserPostHistory

input: randomNumber
output:
{
    "history": [
        {
            "artist": "George",
            "num": 0,
            "songId": "1HeXLaKEbO",
            "time": "Wed, 19 Oct 2022 00:00:00 GMT",
            "title": "ecgkamifxu",
            "userName": "Peppa145"
        }
    ]
}
"""
@app.route('/getUserPostHistory')
def getUserPostHistory():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    userToken = token[request.args['randomNumber']]
    userProfile = helper.makeGetRequest(userToken, spotify_base_url + "/me")
    cursor.execute("select userName from UserRef where userToken = '{}';".format(userProfile['id']))
    
    userName = ""
    
    for row in cursor.fetchall():
        print(row)
        userName = row[0]
    print(userName)
    
    cursor.execute("SELECT DISTINCT songList.userName, s.songId, s.title, s.artist, po.time FROM test.Post po NATURAL JOIN test.Song s NATURAL JOIN (SELECT po2.userName as userName FROM test.Post po2 WHERE ('{}' = po2.userName)) as songList ORDER BY po.time DESC;".format(userName))

    num = 0
    ret = {"history":[]}
    for row in cursor.fetchall():
        ret['history'].append({})
        ret['history'][-1]['userName'] = row[0]
        ret['history'][-1]['songId'] = row[1]
        ret['history'][-1]['title'] = row[2]
        ret['history'][-1]['artist'] = row[3]
        ret['history'][-1]['time'] = row[4]
        ret['history'][-1]['num'] = num
        
        if 'Peppa' not in row[0]:
            json = helper.makeGetRequest(userToken, spotify_base_url + "/tracks/{}".format(row[1]))
            albumId = json["album"]["id"]
            albumCoverUrl =  helper.makeGetRequest(userToken, spotify_base_url + "/albums" + "/{}".format(albumId))["images"][0]["url"]

            ret['history'][-1]['coverPic'] = albumCoverUrl
            ret['history'][-1]['preview_url'] = json["preview_url"]
        else:
            ret['history'][-1]['coverPic'] = 'https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg'
            ret['history'][-1]['preview_url'] = "https://p.scdn.co/mp3-preview/b03b6b277fa0c0e7ebe29d36ec22fada6d22e7e7?cid=e8c9a07787d24221b33a8bdb722dcf34"
        num += 1
    cnxn.close()
    return jsonify(ret)

"""
/getfriends

input: userName

output: 
{
    "friends": [
        {
            "num": 0,
            "userName": "peppa602"
        },
        {
            "num": 1,
            "userName": "peppa642"
        },
        {
            "num": 2,
            "userName": "peppa854"
        }
    ]
}
"""
@app.route('/getfriends')
def getfriends():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    cursor.execute("""
                   SELECT Friends.friendUser
                    FROM Friends
                    WHERE Friends.userName = \"""" + request.args['userName'] + "\";")
    ret = { "friends": []}
    num = 0
    for row in cursor.fetchall():
        ret['friends'].append({})
        ret['friends'][-1]["userName"] = str(row[0])
        ret['friends'][-1]["num"] = num
        num += 1
    cnxn.close()
    return jsonify(ret)

"""
/selectFriends

input: userName1, userName2 (http://127.0.0.1:8080/selectFriends?userName1=peppa0&userName2=peppa)
output: 
{
    "friends": [
        {
            "num": 0,
            "userName": "peppa602"
        },
        {
            "num": 1,
            "userName": "peppa642"
        },
        {
            "num": 2,
            "userName": "peppa854"
        }
    ]
}
"""
@app.route('/selectFriends')
def selectFriends():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    cursor.execute("SELECT friendUser FROM Friends WHERE userName = '{}' AND friendUser LIKE '%{}%'".format(request.args['userName1'], request.args['userName2']))
    ret = {"friends": []}
    num = 0
    for row in cursor.fetchall():
        ret['friends'].append({})
        ret['friends'][-1]["userName"] = str(row[0])
        ret['friends'][-1]["num"] = num
        num += 1
    cnxn.close()
    return jsonify(ret)

"""
/getusers

input: userName (http://127.0.0.1:8080/getusers?userName=peppa1)

output: 
{
    "users": [
        {
            "num": 0,
            "userName": "peppa602"
        },
        {
            "num": 1,
            "userName": "peppa642"
        },
        {
            "num": 2,
            "userName": "peppa854"
        }
    ]
}
"""
@app.route('/getusers')
def getusers():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    cursor.execute("SELECT userName FROM Profile WHERE userName LIKE '%{}%'".format(request.args['userName']))
    ret = {"users": []}
    num = 0
    for row in cursor.fetchall():
        ret['users'].append({})
        ret['users'][-1]["userName"] = str(row[0])
        ret['users'][-1]["num"] = num
        num += 1
    cnxn.close()
    return jsonify(ret)

"""
    /addFriend
    Input: userName1, userName2 (http://127.0.0.1:8080/addFriend?userName1=peppa0&userName2=peppa1)
    Output: {success: true}
"""
@app.route('/addFriend')
def addFriend():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    cursor.execute("SELECT id FROM Friends ORDER BY id DESC LIMIT 1;")
    count = cursor.fetchall()[0][0]
    # print(count)
    cursor.execute("INSERT INTO Friends VALUES ('{}', '{}','{}');".format(count + 1, request.args['userName1'], request.args['userName2']))
    cursor.execute("INSERT INTO Friends VALUES ('{}', '{}','{}');".format(count + 2, request.args['userName2'], request.args['userName1']))
    cnxn.commit()
    cnxn.close()
    # return count
    return jsonify({"success":"true"})

"""
    /deleteFriend
    Input: userName1, userName2 (http://127.0.0.1:8080/deleteFriend?userName1=peppa0&userName2=peppa1)
    Output: {success: true}
"""
@app.route('/deleteFriend')
def deleteFriend():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    cursor.execute("DELETE FROM Friends WHERE userName = '{}' AND friendUser = '{}';".format(request.args['userName1'], request.args['userName2']))
    cursor = cnxn.cursor()
    cursor.execute("DELETE FROM Friends WHERE userName = '{}' AND friendUser = '{}';".format(request.args['userName2'], request.args['userName1']))
    cnxn.commit()
    cnxn.close()
    return jsonify({"success":"true"})


"""
/updateEmail
input: newEmail userName
output: {success: true}
"""
@app.route('/updateEmail')
def updateEmail():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    command = "UPDATE Profile SET email = '{}' WHERE userName = '{}'".format(request.args["newEmail"],request.args["userName"])
    cursor = cnxn.cursor()
    cursor.execute(command)
    cnxn.commit()
    cnxn.close()
    return jsonify({"success": True})

"""
/createAccount
input: userName randomNumber
output: {success: true}
"""
@app.route('/createAccount')
def createAccount():
    #TODO: check if account already exists and if yes, don't do anything
    
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    userToken = token[request.args['randomNumber']]
    userProfile = helper.makeGetRequest(userToken, spotify_base_url + "/me")
    userEmail = userProfile['email']
    userId = userProfile['id']
    print(userEmail, userId)
    command1 = "INSERT INTO Profile VALUES('{}', '{}');".format( request.args['userName'], userEmail)
    command2 = "INSERT INTO Login VALUES('{}', '');".format(request.args['userName'])
    command3 = "INSERT INTO UserRef VALUES('{}', '{}');".format(userId, request.args['userName'])

    cursor = cnxn.cursor()
    cursor.execute(command1)
    cursor.execute(command2)
    cursor.execute(command3)
    cnxn.commit()
    cnxn.close()
    return jsonify({"success": True})


"""
inputs: randomNumber
"""
@app.route('/getCurrentSong')
def getCurrentSong():
    url = spotify_base_url + '/me'
    params = {}
    json =  helper.makeGetRequest(token[request.args['randomNumber']], url, params)
    userToken = json['id']
    
    #use userref to convert userToken (spotify username) to username (musicreal username)
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    #select userName from UserRef where userToken = 'nsdiehsjAh'
    cursor.execute("select userName from UserRef where userToken = '{}';".format(userToken))
    
    userName = ""
    
    for row in cursor.fetchall():
        print(row)
        userName = row[0]
    
    url = spotify_base_url + '/me/player/currently-playing'
    params = {}
    json =  helper.makeGetRequest(token[request.args['randomNumber']], url, params)
    
    ret = {}
    ret['userName'] = userName
    ret['songId'] = json['item']['id']
    ret['title'] = json['item']['name']
    ret['artist'] = json['item']['artists'][0]['name']
    ret['time'] = datetime.now().strftime('%Y-%m-%d')
    ret['coverPic'] = json['item']['album']['images'][0]['url']
    ret['preview_url'] = json["item"]["preview_url"]
    
    #po2.userName, s.songId, s.title, s.artist, t.time
    return ret
    

"""
inputs: randomNumber
"""
@app.route('/addPost')
def addPost():
    #TODO: check if post is already made by this user. if already made, then send response that you already posted
    
    #use the random number to get userToken
    url = spotify_base_url + '/me'
    params = {}
    json =  helper.makeGetRequest(token[request.args['randomNumber']], url, params)
    userToken = json['id']
    
    #use userref to convert userToken (spotify username) to username (musicreal username)
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    #select userName from UserRef where userToken = 'nsdiehsjAh'
    cursor.execute("select userName from UserRef where userToken = '{}';".format(userToken))
    
    userName = ""
    
    for row in cursor.fetchall():
        print(row)
        userName = row[0]
        
    print('userName: ', userName)
    
    #get song from /me spotify api
    url = spotify_base_url + '/me/player/currently-playing'
    params = {}
    
    headers = {"Authorization": "Bearer {}".format(token[request.args['randomNumber']])}
    songJson = requests.get(url, headers=headers, params=params)
    # TODO: change above^^
    
    if songJson.status_code != 200:
        cnxn.close()
        return {"error": "You do not have a song playing on spotify!", "success": False}
    
    songJson = songJson.json()
    
    #check if songid is already in Song database and add if not
    songID = songJson['item']['id']
    print('SEARCH FUNCTION')
    #TODO: check if song is alreayd in database
    cursor.execute("select * from Song where songId = '{}'".format(songID))
    if len(cursor.fetchall()) == 0:
        #add song to our database
        plays = 1
        title = songJson['item']['name']
        artist = songJson['item']['artists'][0]['name']
        cursor.execute("insert into Song values ('{}', '{}', '{}', {});".format(songID, title, artist, plays))
    else:
        #TODO: 
        #increase plays by 1 if we want to
        #update Song where songID = songID and increase plays by 
        pass
    #add row to Post
    
    cursor.execute("SELECT postId FROM Post ORDER BY postId DESC LIMIT 1;")
    postID = cursor.fetchall()[0][0] + 1
    
    print(postID)
    command = "insert into Post values ({}, {}, '{}', '{}')".format(postID, 'CAST(CURDATE() as Date)', songID, userName)
    print(command)
    cursor.execute(command)
    
    cnxn.commit()
    cnxn.close()
    #return success
    return {"success": True}

"""
input: randomNumber
output:
{
    "accountCreated": false/true
}
"""
@app.route('/checkAccountCreation')
def checkAccountCreation():
    url = spotify_base_url + '/me'
    params = {}
    json =  helper.makeGetRequest(token[request.args['randomNumber']], url, params)
    userToken = json['id']
    
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    
    cursor.execute("select * from UserRef where userToken = '{}';".format(userToken))
    if len(cursor.fetchall()) != 0:
        cnxn.close()
        return {"accountCreated" : True}
    cnxn.close()
    return {"accountCreated" : False}

"""
input: randomNumber
"""
@app.route('/test')
def test():
    url = spotify_base_url + '/me'
    params = {}
    return helper.makeGetRequest(token[request.args['randomNumber']], url, params)

"""
input: email
output: {"emailInUse": True/False}
"""
@app.route('/emailInUse')
def emailInUse():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    
    cursor.execute("select * from Profile where email = '{}';".format(request.args['email']))
    if len(cursor.fetchall()) != 0:
        cnxn.close()
        return {"emailInUse" : True}
    cnxn.close()
    return {"emailInUse" : False}


"""
input: userName, friendUser
output: {
    sharedSongs: [
        {
            songId: "",
            hits: 4
        },
        {
            songId: "",
            hits: 4
        }
    ]
}
"""
@app.route('/sharedSongs')
def sharedSongs():
    url = spotify_base_url + '/me'
    params = {}
    json =  helper.makeGetRequest(token[request.args['randomNumber']], url, params)
    
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    
    cursor.execute("select userName from UserRef where userToken = '{}';".format(json['id']))
    userName = ""
    
    for row in cursor.fetchall():
        print(row)
        userName = row[0]

    cursor.callproc('sharedSongs_procedure',args=[userName, request.args['friendUser']])

    ret = {"sharedSongs": []}
    for result in cursor.stored_results():
        for row in result.fetchall():
            ret['sharedSongs'].append({})
            ret['sharedSongs'][-1]["songId"] = str(row[0])
            ret['sharedSongs'][-1]["hits"] = str(row[1])

    cnxn.close()
    return jsonify(ret)
"""
input: randomNumber songId
output:
{
  "artist": "JEON SOYEON",
  "coverPic": "https://i.scdn.co/image/ab67616d0000b273276ccd3b144c9c0f9ba152b6",
  "preview_url": "https://p.scdn.co/mp3-preview/6d12c9c95827509c495fa6d1223f8c726e0f834e?cid=7d028289f4db42bea08c9466c127c224",
  "songId": "0MsE73sXgfqOpgzCATa0Wt",
  "time": "Tue, 06 Dec 2022 00:00:00 GMT",
  "title": "Jelly",
  "userName": "leo"
}
"""
@app.route('/getSongInfo')
def getSongInfo():
    config['database'] = 'test'
    cnxn = mysql.connector.connect(**config)
    cursor = cnxn.cursor()
    userToken = token[request.args['randomNumber']]
    #userProfile = helper.makeGetRequest(userToken, spotify_base_url + "/me")
    #spotifyUserId = userProfile['id']
    
    ret = {}
    cursor.execute("select * from Post where songId = '{}';".format(request.args['songId']))
    for row in cursor.fetchall():
        
        """
        postId
        time
        songId
        userName
        """
        ret['userName'] = row[3]
        ret['songId'] = row[2]
        #ret['title'] = row[2]
        #ret['artist'] = row[3]
        ret['time'] = row[1]
        
        if 'Peppa' not in row[3]:
            json = helper.makeGetRequest(userToken, spotify_base_url + "/tracks/{}".format(row[2]))
            albumId = json["album"]["id"]
            albumCoverUrl =  helper.makeGetRequest(userToken, spotify_base_url + "/albums" + "/{}".format(albumId))["images"][0]["url"]

            ret['coverPic'] = albumCoverUrl
            ret['preview_url'] = json["preview_url"]
        else:
            ret['coverPic'] = 'https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg'
            ret['preview_url'] = "https://p.scdn.co/mp3-preview/b03b6b277fa0c0e7ebe29d36ec22fada6d22e7e7?cid=e8c9a07787d24221b33a8bdb722dcf34"
    cursor.execute("select * from Song where songId = '{}';".format(request.args['songId']))
    
    for row in cursor.fetchall():
        ret['title'] = row[1]
        ret['artist'] = row[2]
    cnxn.close()
    return ret


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app.
    
    print('IF YOU WANT DO RUN THE SERVER LOCALLY')
    print("run this command: python3 main.py local")
    if len(sys.argv) == 2 and sys.argv[1] == 'local':
        base_url = 'http://127.0.0.1:8080'
    app.run(host='127.0.0.1', port=8080, debug=True)

# [END gae_flex_quickstart]
