
// ##### Top-level React Router App ##### //

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory, applyRouterMiddleware } from 'react-router'
import { Broadcast } from 'react-broadcast'

import HomePage from './pages/HomePage.jsx'
import BrowsePage from './pages/BrowsePage.jsx'
import ItemPage from './pages/ItemPage.jsx'
import UnitPage from './pages/UnitPage.jsx'
import { SearchPage } from './pages/SearchPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import LoginSuccessPage from './pages/LoginSuccessPage.jsx'
import LogoutPage from './pages/LogoutPage.jsx'
import LogoutSuccessPage from './pages/LogoutSuccessPage.jsx'

// array-include polyfill for older browsers (and node.js)
Array.prototype.includes = require('array-includes').shim()

class App extends React.Component 
{
  render() { return this.props.children }

  // The logout and login pages need to be able to return the user whence they
  // came. To do that, we need to keep a record when page transitions occur.
  componentWillReceiveProps(nextProps) {
    nextProps.location.prevPathname = this.props.location.pathname
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/campuses" component={BrowsePage} />
    <Route path="/journals" component={BrowsePage} />
    <Route path="/:campusID/units" component={BrowsePage} />
    <Route path="/:campusID/journals" component={BrowsePage} />
    <Route path="/uc/item/:itemID" component={ItemPage} />
    <Route path="/uc/:unitID" component={UnitPage} />
    <Route path="/uc/:unitID/:pageName" component={UnitPage} />
    <Route path="/uc/:unitID/:pageName/**" component={UnitPage} />
    <Route path="/search" component={SearchPage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/loginSuccess/**" component={LoginSuccessPage} />
    <Route path="/loginSuccess" component={LoginSuccessPage} />
    <Route path="/logout" component={LogoutPage} />
    <Route path="/logoutSuccess/**" component={LogoutSuccessPage} />
    <Route path="/logoutSuccess" component={LogoutSuccessPage} />
    <Route path="*" component={NotFoundPage}/>
  </Route>
)

// When running in the browser, render with React (vs. server-side where iso runs it for us)
if (!(typeof document === "undefined")) {
  ReactDOM.render((
    <Router history={browserHistory}>
      {routes}
    </Router>
  ), document.getElementById('main'))
}

module.exports = routes
