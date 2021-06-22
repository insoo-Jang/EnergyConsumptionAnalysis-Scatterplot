import React, { useRef, useEffect, useState } from 'react'
import { Row, Col, TimePicker } from 'antd'
import * as echarts from 'echarts'
import i18n from 'i18next'
import { numberFormatter } from '../components/utils/numberFormatter'
import moment from 'moment'
import { TimeRangeColor } from '../components/utils/TimeRangeColor'
import { debounce, isEmpty } from 'lodash-es'

const format = 'HH:mm'

const Chart = (props) => {
    const { value, onClickTimeRange } = props
    const [startTimeOpenState, setStartTimeOpenState] = useState(false)
    const [endTimeOpenState, setEndTimeOpenState] = useState(false)
    const [startTimeState, setStartTimeState] = useState(moment('00:00', format))
    const [endTimeState, setEndTimeState] = useState(moment('23:59', format))

    const chartRef = useRef(null)
    const getChartInstance = (instance) => {
        if (instance) {
            return echarts.getInstanceByDom(instance) || echarts.init(instance)
        }
    }

    const onClickStartTime = () => {
        setStartTimeOpenState(false)
        onClickTimeRange(startTimeState, endTimeState)
    }

    const onClickEndTime = () => {
        setEndTimeOpenState(false)
        onClickTimeRange(startTimeState, endTimeState)
    }

    const severanceSeriesList = (param) => {
        if (isEmpty(param)) {
            return []
        }
        const newParam = param.reduce(
            (acc, datum) => {
                const newValue = Object.keys(datum).map((keys) => datum[keys])
                const shift = newValue.shift()
                newValue.push(shift)
                const result = {
                    name: TimeRangeColor(moment(datum.time).format('MM')),
                    value: newValue,
                }
                acc[result.name].push(result)
                return acc
            },
            {
                red: [],
                blue: [],
                yellow: [],
            },
        )
        // 에너지량 첫배열 프로퍼티 객수가  맞지않음
        // newParam.shift();
        return [
            {
                data: newParam.red,
                type: 'scatter',
                name: '냉방',
                itemStyle: {
                    color: '#f74e57',
                    opacity: 0.5,
                },
            },
            {
                data: newParam.blue,
                type: 'scatter',
                name: '난방',
                itemStyle: {
                    color: '#357df6',
                    opacity: 0.5,
                },
            },
            {
                data: newParam.yellow,
                type: 'scatter',
                name: '냉난방X',
                itemStyle: {
                    color: '#ffd052',
                    opacity: 0.5,
                },
            },
        ]
    }

    const getOption = () => {
        return {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'cross',
                    triggerOn: 'click',
                },
                backgroundColor: 'rgb(245, 245, 245)',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000',
                    fontSize: 8,
                },
                formatter: (params) =>
                    `${moment(params.value[3]).format('YYYY-MM-DD HH:mm')} <br />
                    ${i18n.t('chart.outside-air-temperature')} : ${params.value[0].toFixed(2)}<br />
                    ${i18n.t('chart.total-energy-consumption')} : ${numberFormatter(params.value[1])}<br />
                    ${i18n.t('chart.outside-air-humidity')} : ${params.value[2].toFixed(2)}<br />`,
            },
            xAxis: {
                name: `${i18n.t('chart.outside-air-temperature')}`,
                nameLocation: 'center',
                nameGap: 23,
                nameTextStyle: {
                    color: '#999',
                    fontSize: 12,
                },
                type: 'value',
                splitLine: {
                    type: 'value',
                    lineStyle: {
                        color: '#d9d9d9',
                    },
                },
                gridIndex: 0,
                // min: -11,
                // max: 4,
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#d9d9d9',
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#333',
                    show: true,
                    formatter: (param) => numberFormatter(param),
                },
                scale: true,
            },
            legend: {
                show: true,
                textStyle: {
                    color: '#333',
                },
                right: '2%',
                itemWidth: 20,
                itemHeight: 8,
            },
            yAxis: {
                name: `${i18n.t('chart.total-energy-consumption')}`,
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: {
                    color: '#999',
                    fontSize: 12,
                },
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: '#d9d9d9',
                    },
                },
                gridIndex: 0,
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: '#d9d9d9',
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#333',
                    show: true,
                    formatter: (param) => numberFormatter(param),
                },
                scale: true,
            },
            grid: {
                top: 33,
                bottom: 15,
                left: 25,
                right: 15,
                containLabel: true,
            },
            // xAxis: {},
            // yAxis: {},
            series: severanceSeriesList(value),
        }
    }

    useEffect(() => {
        if (chartRef.current && value) {
            const chart = getChartInstance(chartRef.current)
            chart.setOption(getOption(value))
            window.addEventListener(
                'resize',
                debounce(() => {
                    chart.resize()
                }, 500),
            )
        }
        return () => {
            // cleanup
            window.removeEventListener('resize', () => {})
        }
    }, [value])

    return (
        <>
            <Row type="flex" justify="space-between">
                <Col span={12}>
                    <Row type="flex" style={{ marginLeft: '20px' }}>
                        <h3> {i18n.t('chart.title')}</h3>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row type="flex" justify="end">
                        <Col span={4} style={{ marginRight: 5, width: '75px' }}>
                            <TimePicker
                                defaultValue={moment('00:00', format)}
                                format={format}
                                size="small"
                                style={{ width: '75px' }}
                                open={startTimeOpenState}
                                onOpenChange={setStartTimeOpenState}
                                onSelect={setStartTimeState}
                                onOk={onClickStartTime}
                            />
                        </Col>
                        <Col span={2} style={{ width: '20px', textAlign: 'center' }}>
                            ~
                        </Col>
                        <Col span={4} style={{ marginRight: 12, width: '75px' }}>
                            <TimePicker
                                defaultValue={moment('23:59', format)}
                                format={format}
                                size="small"
                                style={{ width: '75px' }}
                                open={endTimeOpenState}
                                onOpenChange={setEndTimeOpenState}
                                onSelect={setEndTimeState}
                                onOk={onClickEndTime}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div id="main" style={{ width: '100%', height: '500px' }} ref={chartRef} />
        </>
    )
}

export default Chart
