import React from 'react'
import { Layout } from 'antd'

const SubContainer = props => {
    const { leftSider, children, content, rightSider } = props

    return (
        <Layout className="ant-content-layout">
            <>
                {leftSider}
                <Layout
                    style={{
                        overflow: 'hidden',
                        minHeight: 'calc(100vh - 87px)',
                        height: 'calc(100vh - 87px)',
                        padding: 0,
                    }}
                    className="ant-content-layout-main"
                >
                    {children || content}
                </Layout>
                {rightSider}
            </>
        </Layout>
    )
}

export default SubContainer
