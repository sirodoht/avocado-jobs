import { h, render, Component } from 'preact';
import axios from 'axios';

import New from './New';
import List from './List';
import Loading from './Loading';

class Avo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFormSection: false,
      authed: false,
    }

    this.toggleAddForm = this.toggleAddForm.bind(this);
  }

  toggleAddForm() {
    if (document.location.pathname === '/') {
      if (document.location.hash === '') {
        history.pushState('add', document.title, window.location.pathname + '#add');
      } else if (document.location.hash === '#add') {
        history.pushState('index', document.title, window.location.pathname);
      }
    } else {
      document.location.replace('/#add');
    }

    this.setState((prevState) => {
      return {
        addFormSection: !prevState.addFormSection,
      }
    });
  }

  checkAuth() {
    axios.get('/applications/')
      .then((res, err) => {
        if (res.headers['content-type'] === 'text/html; charset=utf-8') {
          this.setState({
            authed: true,
          })
        }
      })
      .catch((err) => {
        console.log('Authentication check failed. Error:', err);
        throw err;
      })
  }

  componentDidMount() {
    if (document.location.pathname === '/' && document.location.hash === '#add') {
      this.setState({
        addFormSection: true,
      });
    }

    this.checkAuth();
  }

  render() {
    return (
      <div class="app">
        <div class="nav">
          <div class="nav-header">
            <a href="/" class="nav-header-link">
                <img class="nav-header-link-icon" src="/staticfiles/main/android-chrome-192x192.png" alt="logo" />
                <div class="nav-header-link-brand">Avocado Jobs</div>
            </a>
          </div>
          <div class="nav-links">
            <button onClick={this.toggleAddForm} class="nav-links-btn">Add application</button>
            {this.state.authed &&
              <a href="/login" title="Log in to keep your data in the cloud and access them from everywhere">Log in / Sign up</a>
            }
            {this.state.authed ||
              <a href="/logout">Log out</a>
            }
          </div>
        </div>

        {this.state.authed &&
          <div class="header">
            <div class="header-copy">
              <h1>Keep track of your job applications</h1>
            </div>
          </div>
        }

        {this.state.addFormSection &&
          <New />
        }

        <List />

        <Loading />

        <footer>
          <div class="footer-body">
            <div class="footer-body-content">
              <a href="/about/" title="About">About</a>
              &nbsp;| <a href="mailto:hi@avocadojobs.com" title="Say hi!" target="_blank">Contact</a>
              &nbsp;| <a href="https://twitter.com/AvocadoJobs" title="Or maybe hello?" target="_blank">Tweet</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

render(<Avo />, document.body);

// enable react dev tools
// require('preact/debug');
