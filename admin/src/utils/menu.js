import React from 'react'
import UserIcon from '@material-ui/icons/AccountBox'
import { connect } from 'react-redux'
import { MenuItemLink, getResources } from 'react-admin'

const Menu = ({ resources, onMenuClick, logout }) => (
  <nav>
    <MenuItemLink to='/' primaryText='Dashboard' onClick={onMenuClick} />
    {/* {resources.map((resource) => (
      <MenuItemLink to={`/${resource.name}`} primaryText={resource.name} onClick={onMenuClick} />
    ))} */}
    {/* <MenuItemLink to='/posts' primaryText='Posts' onClick={onMenuClick} /> */}
    {/* <MenuItemLink to='/reaction-rule' primaryText='Reaction Rules' onClick={onMenuClick} /> */}
    {/* <MenuItemLink to='/reaction-instance' primaryText='Reaction Instances' onClick={onMenuClick} /> */}
    <MenuItemLink to='/users' primaryText='Users' onClick={onMenuClick} />
    <MenuItemLink to='/community' primaryText='Community' onClick={onMenuClick} />
  </nav>
)

const mapStateToProps = (state) => ({
  resources: getResources(state)
})
export default connect(mapStateToProps)(Menu)
