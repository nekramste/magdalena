import FetchData from 'components/fetch-data'
import HomePage from 'components/home-page'
import About from 'components/about'

export const routes = [
  { name: 'home', path: '/', component: HomePage, display: 'Home', icon: 'home' },
  { name: 'about', path: '/about', component: About, display: 'About', icon: 'info' }, 
  { name: 'fetch-data', path: '/fetch-data', component: FetchData, display: 'Data', icon: 'list' }
]
