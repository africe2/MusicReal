export interface ProfileInfo {
    userName: string,
    name: string,
    email: string,
    profile_pic: string,
  }

export interface appInfo {
    randomNumb: number,
    userInfo: ProfileInfo,
}

export interface UserInfo {
    num: number,
    userName: string
}

export interface PostInfo {
    artist: string,
    num: number,
    songId: string,
    time: string,
    title: string,
    userName: string,
    previewURL: string
}
export interface home {
    userName: string,
    songId: string,
    title: string,
    artist: string,
    coverPic: string,
    time: string,
    preview_url: string
  }
