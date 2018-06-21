
let React = require('react')

class Success extends React.Component {
  render () {
    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <title>Success</title>
          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css' />
          <script defer='defer' src='https://use.fontawesome.com/releases/v5.0.7/js/all.js' />
        </head>
        <body>
          <div className='hero is-link is-fullheight'>
            <div className='hero-body'>
              <div className='container'>
                <img src='/assets/logo-header.png' alt='' style={{ marginBottom: '10px', maxWidth: '300px' }} />
                <h1 className='title'>
                  Your app is ready!
                </h1>
                <p className='subtitle'>
                  Your are ready to go!
                </p>
                <p>Please, restart the server in production mode</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    )
  }
}

module.exports = Success
