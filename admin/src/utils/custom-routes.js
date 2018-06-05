import React from 'react'
import { Route } from 'react-router-dom'
import SettingsRoutes from '../settings/settings-routes'
import Dashboard from './dashboard'

export default [
  <Route exact path='/' component={Dashboard} />
].concat(SettingsRoutes)
