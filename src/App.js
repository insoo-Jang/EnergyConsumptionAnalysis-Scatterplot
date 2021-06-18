import React, { Component } from 'react'
import { Layout } from 'antd'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { routes as mainRoutes } from './routes'
import { hot } from 'react-hot-loader'

import { Container } from './components/commons'

class App extends Component {
    renderRoute = route => {
        return (
            <Route
                key={route.path}
                exact
                strict
                path={route.path}
                component={route.component}
            />
        )
    }

    renderRoutes = routes =>
        routes.reduce(
            (prev, route) =>
                prev.concat(
                    <React.Fragment key={route.path}>
                        {this.renderRoute(route)}
                    </React.Fragment>,
                ),
            [],
        )

    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Helmet>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <meta
                        name="description"
                        content="React Design Editor has started to developed direct manipulation of editable design tools like Powerpoint, We've developed it with react.js, ant.design, fabric.js "
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/earlyaccess/notosanskr.css"
                    />
                    <title></title>
                </Helmet>
                <BrowserRouter>
                    <Switch>
                        <Container routes={mainRoutes}>
                            <React.Suspense fallback={<div>loading...</div>}>
                                <Route
                                    exact
                                    path="/"
                                    render={() => {
                                        return <Redirect to={'/Dashboard'} />
                                    }}
                                />
                                {this.renderRoutes(mainRoutes)}
                            </React.Suspense>
                        </Container>
                    </Switch>
                </BrowserRouter>
            </Layout>
        )
    }
}
export default hot(module)(App);

