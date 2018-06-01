import React from 'react'
import { Admin, Resource } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import { PostList } from './resources/posts'

const dataProvider = jsonServerProvider('http://jsonplaceholder.typicode.com')
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name='posts' list={PostList} />
  </Admin>
)
export default App
