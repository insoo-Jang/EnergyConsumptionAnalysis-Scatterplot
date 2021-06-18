import React from 'react'
import { Layout } from 'antd'
import { withRouter } from 'react-router-dom'

import { Header } from '../../layout'
import Context from './Context'

const Container = props => {
    const { children, routes, history } = props
    const footerStyle = {
        height: '30px',
        lineHeight: '30px',
        textAlign: 'right',
        fontSize: '12px',
        opacity: '.6',
        padding: '0 16px 0 0',
    }

    const onSelectResource = (resourceId, method = 'push') => {
        if (method === 'replace') {
            // 메인 메뉴 선택시 /resources 라우팅을 탈 경우
            history.replace(`/Dashboard/${resourceId}`)
        } else if (method === 'push') {
            // 리소스 링크 등을 통하여 /resources/:id 라우팅을 탈 경우
            history.push(`/Dashboard/${resourceId}`)
        }
    }
    const context = {
        onSelectResource,
    }
    return (
        <React.Fragment>
            <Context.Provider value={context}>
                <Layout.Header>
                    <Header routes={routes} />
                </Layout.Header>
                <Layout.Content style={{ display: 'flex' }}>
                    {children}
                </Layout.Content>
                <Layout.Footer style={footerStyle}>
                    <React.Fragment>
                        Copyright 2020. Insoo-Jang all rights reserved.
                    </React.Fragment>
                </Layout.Footer>
            </Context.Provider>
        </React.Fragment>
    )
}

export default withRouter(Container)
