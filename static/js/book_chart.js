//统计不同分类出现次数
const typeStat = function (data,type) {
    let obj = {}
    for (const element of data) {
        let key = element[type]
        if (obj.hasOwnProperty(key)) {
            obj[key]++
        } else {
            obj[key] = 1
        }
    }
    return obj
}

const getAxis = function (data) {
    let obj = typeStat(data,'type')
    let xAxis = []
    let yAxis = []
    for (let key in obj) {
        xAxis.push(key)
        yAxis.push(obj[key])
    }
    return { xAxis, yAxis }
}

const getValueName = function (data) {
    let obj = typeStat(data,'status')
    let arr = []
    for (let key in obj) {
        let o = {
            value: obj[key],
            name:key
        }
        arr.push(o)
    }
    return arr
}

const pieChart = function (data) {
    let dataSource = getValueName(data)
    var myChart = echarts.init(document.getElementById('pie'));

    var option = {
        color: ['#60acfc','#5bc49f'],
        title: {
            text: '当前状态',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
            {
                name: '当前状态',
                type: 'pie',
                data: dataSource,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    myChart.setOption(option);
}

const barChart = function (data) {
    let { xAxis, yAxis } = getAxis(data)
    var myChart = echarts.init(document.getElementById('bar'));

    var option = {
        color: ['#60acfc'],
        title: {
            text: '起点小说收藏榜 TOP100'
        },
        tooltip: {},
        legend: {
            data:['数量']
        },
        xAxis: {
            data: xAxis,
            name: '类型'
        },
        yAxis: {},
        series: [{
            name: '数量',
            type: 'bar',
            data: yAxis
        }]
    };

    myChart.setOption(option);
}
