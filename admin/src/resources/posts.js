import React from 'react'
import {
  List,
  Datagrid,
  ShowButton,
  EditButton,
  DeleteButton,
  TextField,
  DateField,
  ReferenceField,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  Edit,
  SimpleForm,
  DateInput,
  LongTextInput,
  Create
} from 'react-admin'
import { ContentField } from './post-content-field'
import { ContentInput } from './post-content-input'

const PostTitle = ({ record }) => (
  <span>Post {record ? `"${record.title}"` : ''}</span>
)

const PostFilters = (props) => (
  <Filter {...props}>
    <TextInput label='Search' source='title' alwaysOn />
    <ReferenceInput label='Author' source='author' reference='users'>
      <SelectInput optionText='username' />
    </ReferenceInput>
  </Filter>
)

export const PostList = (props) => (
  <List {...props} filters={<PostFilters />} resource='posts'>
    <Datagrid>
      <TextField source='title' label='Title' />
      <TextField source='description' label='Description' />
      <DateField source='openingDate' label='Opening date' />
      <DateField source='closingDate' label='Closing date' />
      <ReferenceField label='Author' source='author._id' reference='users' linkType='edit'>
        <TextField source='name' />
      </ReferenceField>
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const PostCreate = (props) => (
  <Create title={<PostTitle />} {...props}>
    <SimpleForm redirect='/reaction-instance/create?fromCreation=true'>
      <TextInput source='title' />
      <TextInput source='description' options={{ multiLine: true }} />
      <ContentInput label='Content' source='content' addLabel />
      <DateInput label='Opening date' source='openingDate' defaultValue={new Date()} />
      <DateInput label='Closing date' source='closingDate' defaultValue={new Date()} />
    </SimpleForm>
  </Create>
)

export const PostEdit = (props) => (
  <Edit title={<PostTitle />} {...props}>
    <SimpleForm>
      <TextInput source='title' />
      <LongTextInput source='description' />
      <ContentInput label='Content' source='content' addLabel label='Content' />
      <DateInput label='Opening date' source='openingDate' />
      <DateInput label='Closing date' source='closingDate' />
    </SimpleForm>
  </Edit>
)

export const PostShow = (props) => (
  <Show title={<PostTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source='title' label='Title' />
      <TextField source='description' label='Description' />
      <ContentField source='content' label='Content' addLabel />
      <DateField source='openingDate' label='Opening date' />
      <DateField source='closingDate' label='Closing date' />
      <ReferenceField label='Author' source='author' reference='users' linkType='edit'>
        <TextField source='name' />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
)
