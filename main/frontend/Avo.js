import { h, render, Component } from 'preact';

import New from './New';
import List from './List';
import Loading from './Loading';

class Avo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFormSection: false,
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

  componentDidMount() {
    if (document.location.pathname === '/' && document.location.hash === '#add') {
      this.setState({
        addFormSection: true,
      });
    }
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
            <button onClick={this.toggleAddForm} class="nav-links-btn" id="tutorial-trigger">Add application</button>
            <a href="/login" title="Log in to keep your data in the cloud and access them from everywhere">Log in / Sign up</a>
            <a href="/logout">Log out</a>
          </div>
        </div>

        {this.state.addFormSection ||
          <div class="container-content-header">
            <div class="container-content-header-content">
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
          <div class="footer-content">
            <div class="footer-content-para">
              Avocado Jobs.&nbsp;
              <a href="mailto:hi@avocadojobs.com" title="Say hi!" target="_blank">Email</a>&nbsp;
              or <a href="https://twitter.com/AvocadoJobs" title="Or maybe hello?" target="_blank">tweet</a> at us.
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

render(<Avo />, document.body);
