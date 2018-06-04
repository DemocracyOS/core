import React from 'react'
import { Admin, Resource } from 'react-admin'
// Icons
import PostIcon from '@material-ui/icons/Book'

import { PostList } from './resources/posts'
import dataProvider from './dataProvider'

const App = () => ( 
  <Admin dataProvider={dataProvider}>
    <Resource name='posts' list={PostList}icon={PostIcon} />
  </Admin>
)
export default App
