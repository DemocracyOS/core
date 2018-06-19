import React from 'react'
import { Admin, Resource, Delete } from 'react-admin'
// Icons
import PostIcon from '@material-ui/icons/Book'
import UserIcon from '@material-ui/icons/AccountBox'
import { PostList, PostShow, PostCreate, PostEdit } from './posts/posts'
import { UserList, UserView } from './users/users'
import NotFound from './utils/not-found'
import Menu from './utils/menu'
import dataProvider from './utils/data-provider'
import customRoutes from './utils/custom-routes'

const App = () => (
  <Admin customRoutes={customRoutes} catchAll={NotFound} dataProvider={dataProvider} menu={Menu}>
    {/* <Resource name='posts' list={PostList} show={PostShow} create={PostCreate} edit={PostEdit} remove={Delete} icon={PostIcon} /> */}
    {/* <Resource name='users' list={UserList} view={UserView} icon={UserIcon} /> */}
  </Admin>
)
export default App
