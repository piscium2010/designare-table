const list = [
    {
        name: 'The Global Dow',
        prev_close: '3,064.79',
        percent: 0,
        time: '06:24:04 PM',
        three_month: '-0.55%',
        six_month: '0.6%',
        ytd: '12.27%'
    },
    {
        name: 'Dow Jones',
        prev_close: '26,935.07',
        percent: 1,
        time: '05:15:04 PM',
        three_month: '0.68%',
        six_month: '4.6%',
        ytd: '15.37%'
    },
    {
        name: 'NASDAQ 100',
        prev_close: '7,823.55',
        percent: 5,
        time: '05:16:01 PM',
        three_month: '1.1%',
        six_month: '6%',
        ytd: '22.99%'
    }
]
export function data(n = 100) {
    const r = []
    for (let i = 0; i < n; i++) {
        const one = list[i % list.length]
        r.push({
            id: i,
            ...one
        })
    }
    return r
}
