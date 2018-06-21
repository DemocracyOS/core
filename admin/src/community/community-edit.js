import React from 'react'
import Card from '@material-ui/core/Card'
import Snackbar from '@material-ui/core/Snackbar'
import {
  ViewTitle,
  GET_ONE,
  UPDATE,
  SimpleForm,
  TextInput
} from 'react-admin'
import restClient from '../utils/data-provider'
import CommunityColorPicker from './community-color-picker'

export class CommunityEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      community: {},
      open: false,
      status: ''
    }
  }

  componentDidMount () {
    restClient(GET_ONE, 'community')
      .then((req) => {
        this.setState({ community: req.data })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleSubmit = (newCommunity) => {
    restClient(UPDATE, 'community', { id: this.state.community._id, data: newCommunity })
      .then(() => {
        this.setState({
          open: true,
          status: 'success'
        })
      })
      .catch((e) => {
        console.error(e)
        this.setState({
          open: true,
          status: 'error'
        })
      })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
      status: ''
    })
  }

  render () {
    return (
      <Card>
        <SimpleForm record={this.state.community} save={this.handleSubmit}>
          <ViewTitle title='Community' />
          <TextInput source='communityName' label='Community name' />
          <CommunityColorPicker source='mainColor' addLabel label='Main color' />
        </SimpleForm>
        <Snackbar
          open={this.state.open}
          message={this.state.status === 'error' ? 'Error: Can not update. Please try again' : 'Community updated'}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose} />
      </Card>
    )
  }
}
