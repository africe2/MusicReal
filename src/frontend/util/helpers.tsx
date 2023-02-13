export const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']

export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const monthNumber = new Date().getMonth()
export const currMonthNumber = monthNumber + 1
export const currMonth = monthNames[new Date().getMonth()]
export const currYear = new Date().getFullYear()


//contains calendar layout for the whole year

export const getAllDatesOfYear =() => {
    const allDates = []
    
    monthNames.forEach((month, i) => {
        let daysOfMonth = []
        const firstDayOfMonth = new Date(currYear, i, 1)
        const lastDayOfMonth = new Date(currYear, i + 1, 0).getDate()
        const firstDayOfWeek = new Date(firstDayOfMonth).getDay()
        const lastDayOfWeek = new Date(currYear, i + 1, 0).getDay()
        let temp = []
        for (let i = 0; i < firstDayOfWeek; i++) {
            temp.push(' ')
        }
        for (let i = 1; i < (lastDayOfMonth - lastDayOfWeek); i++) {
            temp.push(i)
            if (temp.length === 7) {
                daysOfMonth.push(temp)
                temp = []
            }
        }
        for (let i = lastDayOfMonth - lastDayOfWeek; i < lastDayOfMonth + (7 - lastDayOfWeek); i++) {
            if (i > lastDayOfMonth) {
                temp.push(' ')
            } else {
                temp.push(i)
            }
        }
        daysOfMonth.push(temp)
        allDates.push(daysOfMonth)
    })

    return allDates
}


