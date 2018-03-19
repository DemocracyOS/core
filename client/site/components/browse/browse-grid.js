import React from 'react'
import createHistory from 'history/createBrowserHistory'
import { stringify, parse } from 'query-string'
import BrowseFilter from './browse-filter'
import BrowseCard from './browse-card'

export default class BrowseGrid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      posts: null,
      count: null
    }
  }

  componentDidMount () {
    this.history = createHistory()
    window.addEventListener('scroll', this.onScroll, false)
    let query = this.props.query
    fetch(`/api/v1.0/posts?${stringify(query)}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          count: res.pagination.count,
          posts: res.results
        })
      })
      .catch((err) => console.error(err))
  }

  handleFetch = (filters) => {
    const query = {
      sort: filters.sort,
      page: 1,
      filter: JSON.stringify(filters.filter)
    }
    fetch(`/api/v1.0/posts?${stringify(query)}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          count: res.pagination.count,
          page: 1,
          posts: res.results
        }, () => this.history.push({ search: `?${stringify(query)}` }))
      })
      .catch((err) => console.error(err))
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll, false)
  }

  onScroll = () => {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight) &&
        this.state.posts
    ) {
      this.handlePagination()
    }
  }

  handlePagination = () => {
    let query = parse(location.search)
    query.page = this.state.page + 1
    console.log(query)
    const url = `/api/v1.0/posts?${stringify(query)}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          posts: this.state.posts.concat(res.results),
          page: query.page
        })
      })
      .catch((err) => console.log(err))
  }

  render () {
    return (
      <section className='browse-grid'>
        <div className='browse-grid-header'>
          <h2>Browse</h2>
        </div>
        <div className='browse-grid-body'>
          <BrowseFilter handleFetch={this.handleFetch} />
          {this.state.posts &&
            <div className='browse-grid-card-container'>
              {this.state.posts.map((p, i) =>
                <BrowseCard post={p}
                  key={i} />
              )}
            </div>
          }
          { this.state.posts && this.state.posts.length >= this.state.count &&
            <div className='browse-grid-footer'>
              <h5>{this.state.count > 0 ? 'You have reached all the posts' : 'Sorry, no posts matched your criteria'}</h5>
            </div>
          }
        </div>
        <style jsx>{`
          .browse-grid {
            padding: 0 20px;
          }
          .browse-grid-body {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 40px;
          }
          .browse-grid-card-container {
            width: 75%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          h5 {
            margin: 40px 0;
            text-align: center;
          }
          @media screen and (max-width: 767px) {
            .browse-grid-card-container {
              justify-content: center;
            }
          }
        `}</style>
      </section>
    )
  }
}
