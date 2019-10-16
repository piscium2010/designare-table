export const getData = (count = 100) => {
    const r = []
    for (let i = 0; i < count; i++) {
        r.push({
            name: i + 'The Global Dow',
            prev_close: '3,064.79',
            percent: i,
            time: '06:24:04 PM',
            three_month: '-0.55%',
            six_month: '0.6%',
            ytd: '12.27%'
        })
    }
    return r
}