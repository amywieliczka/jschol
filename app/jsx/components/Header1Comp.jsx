// ##### Header1 Component ##### //

import React from 'react'
import { Link } from 'react-router'
import { Subscriber } from 'react-broadcast'

import Search1Comp from '../components/Search1Comp.jsx'
import Breakpoints from '../../js/breakpoints.json'

class HeaderComp1 extends React.Component {
  state = {searchActive: false}
  render() {
    return (
    <div>
      <header className="c-header">
        <Link className="c-header__logo1" to="/">
          <picture>
            <source srcSet="/images/logo_escholarship.svg" media={"(min-width: "+Breakpoints.screen3+")"}/>
            <img src="/images/logo_eschol-mobile.svg" alt="eScholarship"/>
          </picture>
        </Link>
        <div className={this.state.searchActive ? "c-header__search--active" : "c-header__search"}>
          <Search1Comp onClose = {()=>this.setState({searchActive: false})} />
        </div>
        <button className="c-header__search-open-button" aria-label="open search field" onClick = {()=> this.setState({searchActive: true})}></button>
      </header>
    </div>
    )
  }
}

module.exports = HeaderComp1;
