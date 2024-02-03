import {createBrowserRouter} from 'react-router-dom'

import App from '../App'
import Home from '../views/Home/Home'
import NotFound from '../views/NotFound/NotFound'
import Players from '../views/Players/Players'
import NewMatch from '../views/NewMatch/NewMatch'

enum Route {
    ROOT = '/',
    HOME = '/home',
    FAVORITES = '/favorites',
    PLAYERS = '/players',
    NEW_MATCH = '/newmatch',
    ACCOUNT = '/account',
    NOTFOUND = '*',
}

const publicRoutes = [
    {
        path: Route.HOME,
        element: <Home />,
    },
    {
        path: Route.PLAYERS,
        element: <Players />,
    },
    {
        path: Route.NEW_MATCH,
        element: <NewMatch />,
    },
    {
        path: Route.NOTFOUND,
        element: <NotFound />,
    },
]

const routes = [
    {
        path: Route.ROOT,
        element: <App />,
        children: [...publicRoutes],
    },
]

const router = createBrowserRouter(routes)

export {router, Route}
