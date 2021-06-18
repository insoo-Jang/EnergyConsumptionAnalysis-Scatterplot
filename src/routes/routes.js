import React, { lazy } from 'react'
const Dashboard = lazy(() => import('../components/dashboard/Dashboard'))
const routes = [
    {
        path: '/Dashboard',
        component: Dashboard,
        isMenu: true,
        icon: 'DesktopOutlined',
        title: 'title.main.dashboard',
    },
    {
        path: '/Dashboard/:id',
        component: Dashboard,
        isMenu: false,
        icon: 'DesktopOutlined',
        title: 'title.main.dashboard',
    },
]

export default routes
