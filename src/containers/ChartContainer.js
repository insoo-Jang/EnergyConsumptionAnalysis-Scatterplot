import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Spin } from 'antd'
import Chart from './Chart'
import scatterData from '../../public/assets/sample/scatterData.json'
import metricStatusData from '../../public/assets/sample/metricStatusData.js'
import { isEmpty } from 'lodash-es'
import moment from 'moment'

const getScatterData = () =>
    new Promise((resolve) => {
        resolve({ data: scatterData })
    })

const preprocessing = (param) => [
    ...Object.entries(param)
        .reduce((acc, [key, datum]) => {
            datum.forEach(({ time, value }) => {
                const val = acc.get(time) || {}
                val.time = time
                val[key] = value
                acc.set(time, val)
            })
            return acc
        }, new Map())
        .values(),
]

const isTimeBetween = (startTime, endTime, serverTime) => {
    let start = moment(startTime, 'H:mm')
    let end = moment(endTime, 'H:mm')
    const server = moment(serverTime, 'H:mm')

    start > end && ([start, end] = [end, start])
    return server >= start && server < end
}

const ChartContainer = () => {
    const [value, setValue] = useState({})
    const [loading, setLoading] = useState(true)
    const [filteredValue, setFilteredValue] = useState()

    const getMetricHandler = () => {
        getScatterData()
            .then((response) => {
                const metricData = {}
                const metricStatus = metricStatusData
                let key = []

                const { data } = response
                metricStatus.forEach((m, i) => {
                    metricData[m.definitionKey] = data[i]
                })
                metricStatus.forEach((m) => {
                    key.push(m.definitionKey)
                })
                setValue(preprocessing(metricData))
                setFilteredValue(preprocessing(metricData))
                setLoading(false)
            })
            .catch((error) => {
                console.error(`[ERROR] ChartContainer.js - getMetricHandler()`, error)
                setLoading(false)
            })
    }

    const onClickTimeRange = (startTime, endTime) => {
        const getTimeRange = (param) =>
            param.filter((v) => isTimeBetween(startTime, endTime, moment(v.time).format('HH:mm')))
        if (!isEmpty(value) && !isEmpty(getTimeRange(value))) {
            setFilteredValue(getTimeRange(value))
        }
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            getMetricHandler()
        }, 1000)
    }, [])
    return (
        <Row justify="center" align="middle" style={{ height: '100%' }}>
            <Col span={12}>
                <Card style={{ width: '100%', height: '100%' }}>
                    <Spin spinning={loading}>
                        <Chart value={filteredValue} onClickTimeRange={onClickTimeRange} />
                    </Spin>
                </Card>
            </Col>
        </Row>
    )
}

export default ChartContainer
