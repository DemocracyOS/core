
let React = require('react')

class Error extends React.Component {
  render () {
    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <title>Can't continue with setup</title>
          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css' />
          <script defer='defer' src='https://use.fontawesome.com/releases/v5.0.7/js/all.js' />
        </head>
        <body>
          <div className='hero is-dark is-fullheight'>
            <div className='hero-body'>
              <div className='container'>
                <img src='/assets/logo-header.svg' alt='' style={{ marginBottom: '10px' }} />
                <h1 className='title'>
                  Error
                </h1>
                <p className='subtitle'>
                 Can't continue with setup
                </p>
                <p>{this.props.message}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    )
  }
}

module.exports = Error
