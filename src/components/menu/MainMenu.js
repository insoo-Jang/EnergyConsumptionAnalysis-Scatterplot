import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import sortBy from 'lodash/sortBy'
import { withRouter } from 'react-router-dom'

import i18n from 'i18next'

const MainMenu = props => {
    const { location, routes } = props
    const { pathname } = location
    const onePathname = pathname.split('/')[1]
    const [menus, setMenus] = useState([])

    const buildMenus = param => {
        const menu = () => {
            const newMenus = param.reduce((prev, curr) => {
                if (!curr.isMenu) {
                    return prev
                }
                const obj = {
                    key: curr.path,
                    icon: curr.icon,
                    title: curr.title,
                    order: curr.order,
                    subMenus: curr.subRoutes ? menu(curr.subRoutes) : null,
                }
                prev.push(obj)
                return prev
            }, [])
            return sortBy(newMenus, ['order'])
        }
        setMenus(menu)
    }
    useEffect(() => {
        buildMenus(routes)
    }, [])

    const handleLink = path => {
        props.history.push(path)
    }
    const renderTitle = menu => {
        const { key, title, icon } = menu
        return (
            <>
                <MenuUnfoldOutlined />
                <span>{i18n.t(menu.title) || key}</span>
            </>
        )
    }

    const renderMenus = param => {
        return param.map(values => {
            const { key, subMenus } = values
            if (subMenus && subMenus.length) {
                const newMenus = subMenus.map(subMenu => (
                    <Menu.Item
                        key={subMenu.key}
                        onClick={() => handleLink(subMenu.key)}
                    >
                        {renderTitle(subMenu)}
                    </Menu.Item>
                ))
                return (
                    <Menu.SubMenu key={key} title={renderTitle(values)}>
                        {newMenus}
                    </Menu.SubMenu>
                )
            }
            return (
                <Menu.Item key={key} onClick={() => handleLink(values.key)}>
                    {renderTitle(values)}
                </Menu.Item>
            )
        })
    }
    return (
        <Menu
            // theme="dark"
            mode="horizontal"
            theme="light"
            defaultSelectedKeys={[`/${onePathname}`]}
            selectedKeys={[`/${onePathname}`]}
            className="ant-layout-navbar-nav"
        >
            {renderMenus(menus)}
        </Menu>
    )
}

export default withRouter(MainMenu)
