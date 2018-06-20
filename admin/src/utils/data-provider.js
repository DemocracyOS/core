import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
  fetchUtils
} from 'react-admin'
import { stringify } from 'query-string'

const API_URL = '/api/v1'

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertDataProviderRequestToHTTP = (type, resource, params) => {
  switch (type) {
    case GET_LIST: {
      console.log('GET_LIST')
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const query = {
        sort: JSON.stringify([field, order]),
        page: JSON.stringify(page),
        limit: JSON.stringify(perPage),
        // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify(params.filter)
      }
      return { url: `${API_URL}/${resource}?${stringify(query)}` }
    }
    case GET_ONE:
      console.log('GET_ONE')
      if (resource === 'community' && params === undefined) {
        return { url: `${API_URL}/${resource}` }
      } else {
        return { url: `${API_URL}/${resource}/${params.id}` }
      }
    case GET_MANY: {
      console.log('GET_MANY')
      const query = {
        filter: JSON.stringify({ ids: params.ids })
      }
      return { url: `${API_URL}/${resource}?${stringify(query)}` }
    }
    case GET_MANY_REFERENCE: {
      console.log('GET_MANY_REFERENCE')
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
        filter: JSON.stringify({ ...params.filter, [params.target]: params.id })
      }
      return { url: `${API_URL}/${resource}?${stringify(query)}` }
    }
    case UPDATE:
      console.log('UPDATE')
      return {
        url: `${API_URL}/${resource}/${params.id}`,
        options: { method: 'PUT', body: JSON.stringify(params.data) }
        // Add CRSF Tokens (?)
        // options.body = params.data
        // options.body['_csrf'] = JSON.parse(localStorage.getItem('session')).csrfToken
        // options.body = JSON.stringify(options.body)
      }
    case CREATE:
      console.log('CREATE')
      return {
        url: `${API_URL}/${resource}`,
        options: { method: 'POST', body: JSON.stringify(params.data) }
        // Add CRSF Tokens (?)
        // options.body = params.data
        // options.body['_csrf'] = JSON.parse(localStorage.getItem('session')).csrfToken
        // options.body = JSON.stringify(options.body)
      }
    case DELETE:
      console.log('DELETE')
      return {
        url: `${API_URL}/${resource}/${params.id}`,
        options: { method: 'DELETE' }
      }
      // Add CRSF Tokens (?)
      // options.body = {
      //     '_csrf': JSON.parse(localStorage.getItem('session')).csrfToken
      //   }
      // options.body = JSON.stringify(options.body)
    default:
      throw new Error(`Unsupported fetch action type ${type}`)
  }
}

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} Data Provider response
 */
const convertHTTPResponseToDataProvider = (response, type, resource, params) => {
  const { headers, json } = response
  switch (type) {
    case GET_LIST:
      // return {
      //   data: json.map((x) => x),
      //   total: parseInt(headers.get('content-range').split('/').pop(), 10)
      // }
      return {
        data: json.results.map((x) => {
          Object.defineProperty(x, 'id', {
            value: x._id
          })
          return x
        }),
        total: parseInt(json.pagination.count)
      }
    case CREATE:
      return { data: { ...params.data, id: json._id } }
    case UPDATE:
      return { data: { ...params.data, id: json._id } }
    case DELETE:
      return { data: { id: json.id } }
    case GET_ONE:
      return { data: json }
    case GET_MANY:
      return {
        data: json.results.map((x) => {
          Object.defineProperty(x, 'id', {
            value: x._id
          })
          return x
        }),
        total: parseInt(json.pagination.count)
      }
    default:
      return { data: { json } }
    // case CREATE:
    //   return { data: { ...params.data, id: json.id } }
    // default:
    //   return { data: json }
  }
}

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for response
 */
export default (type, resource, params) => {
  const { fetchJson } = fetchUtils
  const { url, options } = convertDataProviderRequestToHTTP(type, resource, params)
  return fetchJson(url, options)
    .then((response) => convertHTTPResponseToDataProvider(response, type, resource, params))
}
