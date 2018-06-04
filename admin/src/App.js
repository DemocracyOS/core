import React from 'react'
import { Admin, Resource, Delete } from 'react-admin'
// Icons
import PostIcon from '@material-ui/icons/Book'
import UserIcon from '@material-ui/icons/AccountBox'

import { PostList, PostShow, PostCreate, PostEdit } from './resources/posts'
import { UserList, UserView } from './resources/users'
import dataProvider from './dataProvider'

const App = () => ( 
  <Admin dataProvider={dataProvider}>
    <Resource name='posts' list={PostList} show={PostShow} create={PostCreate} edit={PostEdit} remove={Delete} icon={PostIcon} />
    <Resource name='users' list={UserList} view={UserView} icon={UserIcon} />
  </Admin>
)
export default App
