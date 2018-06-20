
let React = require('react')

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = { colorVal: '#425cf4' }

    this.changeColor = this.changeColor.bind(this)
  }

  changeColor (event) {
    this.setState({ colorVal: event.target.value })
  }

  render () {
    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <title>DemocracyOS Setup</title>
          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css' />
          <script defer src='https://use.fontawesome.com/releases/v5.0.7/js/all.js' />
        </head>
        <body>
          <div className='hero is-dark'>
            <div className='hero-body'>
              <div className='container'>
                <img src='/assets/logo-header.svg' alt='' style={{ marginBottom: '10px' }} />
                <h1 className='title'>
                  Setup for DemocracyOs
                </h1>
                <p className='subtitle'>
                  Welcome {this.props.name}! Thanks for choosing DemocracyOS for your participation instances
                </p>
                <p>Please complete the following fields to start your DemocracyOS instance</p>
                <p>Not you? <a href='/logout' className='is-italic'>Logout</a></p>
              </div>
            </div>
          </div>
          <section className='section'>
            <div className='container'>
              <h1 className='title'>
                Community Info
              </h1>
              <h1 className='subtitle is-5'>
                You will be able to change it later in the admin panel
              </h1>
              <form action='/init' method='post' encType='application/x-www-form-urlencoded'>
                <div className='field'>
                  <label className='label'>Name of your community</label>
                  <div className='control'>
                    <input className='input' type='text' name='communityName' placeholder='Primary input' />
                    <span className='help'>For example: "Public consult for the goverment of AAAAA"</span>
                  </div>
                </div>
                <div className='field'>
                  <label className='label'>Primary color</label>
                  <div className='control'>
                    <input type='color' name='communityColor' value={this.state.colorVal} onChange={this.changeColor} />
                  </div>
                </div>
                <div className='field'>
                  <label className='label'>Logo</label>
                  <div className='control'>
                    <div className='file has-name is-fullwidth'>
                      <label className='file-label'>
                        <input id='file' className='file-input' type='file' name='communityFile' />
                        <span className='file-cta'>
                          <span className='file-icon'>
                            <i className='fas fa-upload' />
                          </span>
                          <span className='file-label'>
                              Choose a file...
                          </span>
                        </span>
                        <span id='filename' className='file-name'>
                            - No file selected -
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <hr />
                <h1 className='title'>
                Administrator
                </h1>
                <h1 className='subtitle is-5'>
                We will create the first user of the community. We have this info from Keycloak (The identity provider).
                </h1>
                <p>Later, you can complete your profile and add other users as administrators.</p>
                <div className='field is-horizontal'>
                  <div className='field-label is-normal'>
                    <label className='label'>Your name</label>
                  </div>
                  <div className='field-body'>
                    <div className='field'>
                      <p className='control'>
                        <input className='input is-static' type='email' value={this.props.name} readOnly />
                      </p>
                    </div>
                  </div>
                </div>
                <div className='field is-horizontal'>
                  <div className='field-label is-normal'>
                    <label className='label'>Your email</label>
                  </div>
                  <div className='field-body'>
                    <div className='field'>
                      <p className='control'>
                        <input className='input is-static' type='email' value={this.props.email} readOnly />
                      </p>
                    </div>
                  </div>
                </div>
                <div className='field is-horizontal'>
                  <div className='field-label is-normal'>
                    <label className='label'>Your roles</label>
                  </div>
                  <div className='field-body'>
                    <div className='field'>
                      <p className='control'>
                        <input className='input is-static' type='email' value={this.props.roles.toString()} readOnly />
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <h1 className='title'>
                Ready?
                </h1>
                <div className='field'>
                  <div className='control'>
                    <button type='submit' className='button is-primary is-medium'><i className='fas fa-paper-plane' />&nbsp;Yes! Install now</button>
                  </div>
                </div>
              </form>
            </div>
          </section>
          <script src='/assets/file-script.js' />
        </body>
      </html>
    )
  }
}

module.exports = Index
