interface Friend {
    name: string,
    userName: string,
    pfp: string
}
interface Profile {
    userName: string,
    name: string,
    email: string
}
export const friendSampleData: Friend[] = []
export const profileSampleData: Profile = {
    userName: "Peppa0",
    name: "Peppa Pig",
    email: "peppapig@gmail.com"
}

const names = ['Zuzu Zebra', 'Suzy Sheep', 'Peppa Pig', 'Candy Cat', 'Miss Rabbit']
const userNames = ['zuzu_zebra', 'suzy_sheep', 'peppa_pig', 'candy_cat', 'miss_rabbit']
const pfp = [
    'https://static.wikia.nocookie.net/peppapedia/images/4/4a/Zoe.png',
    'http://pm1.narvii.com/7601/c0be5178c0e1f0cd82a0adb04172de892cb19681r1-768-768v2_00.jpg',
    'https://i.guim.co.uk/img/media/97ef1652ca36d1c2e553628ffca8cf95e6d01c03/732_829_3993_2395/master/3993.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=a60fde4ed2c7dad7561fa3c1fc6b9ab4',
    'https://cdn.thetealmango.com/wp-content/uploads/2022/10/maxresdefault-8.jpg','https://static.wikia.nocookie.net/peppapedia/images/b/b7/MissRabbit.jpg'
]

for (let i = 0; i < 20; i++) {
    friendSampleData.push({
        name: names[i % 5],
        userName: userNames[i % 5],
        pfp: pfp[i % 5]
    })
}

