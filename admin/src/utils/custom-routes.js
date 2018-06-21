import React from 'react'
import { Route } from 'react-router-dom'
import CommunityRoutes from '../community/community-routes'
import Dashboard from './dashboard'

export default [
  <Route exact path='/' component={Dashboard} />
].concat(CommunityRoutes)
