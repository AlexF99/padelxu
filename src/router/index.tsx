import { createBrowserRouter } from 'react-router-dom'

import App from '../App'
import Home from '../views/Home/Home'
import NotFound from '../views/NotFound/NotFound'
import Players from '../views/Players/Players'
import NewMatch from '../views/NewMatch/NewMatch'
import Leaderboard from '../views/Leaderboard/Leaderboard'
import Login from '../views/Login/Login'
import Matches from '../views/Matches/Matches'
import Teams from '../views/Teams/Teams'
import Profile from '../views/Profile/Profile'
import PlayerInfo from '../views/Players/PlayerInfo'
import Groups from '../views/Groups/Groups'
import Group from '../views/Groups/Group'

enum Route {
    ROOT = '/',
    HOME = '/home',
    MATCHES = '/matches',
    TEAMS = '/teams',
    LOGIN = '/login',
    FAVORITES = '/favorites',
    PLAYERS = '/players',
    GROUPS = '/groups',
    PROFILE = '/profile',
    NEW_MATCH = '/newmatch',
    LEADERBOARD = '/leaderboard',
    NOTFOUND = '*',
}

const publicRoutes = [
    {
        path: Route.HOME,
        element: <Home />,
    },
    {
        path: Route.MATCHES,
        element: <Matches />,
    },
    {
        path: Route.TEAMS,
        element: <Teams />,
    },
    {
        path: Route.LOGIN,
        element: <Login />,
    },
    {
        path: Route.PLAYERS,
        element: <Players />,
    },
    {
        path: Route.PLAYERS + "/:id",
        element: <PlayerInfo />,
    },
    {
        path: Route.GROUPS,
        element: <Groups />,
    },
    {
        path: Route.GROUPS + "/:id",
        element: <Group />,
    },
    {
        path: Route.PROFILE,
        element: <Profile />,
    },
    {
        path: Route.NEW_MATCH,
        element: <NewMatch />,
    },
    {
        path: Route.LEADERBOARD,
        element: <Leaderboard />,
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

export { router, Route }
