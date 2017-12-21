import { h, render, Component } from 'preact';

import New from './New';
import List from './List';
import Loading from './Loading';

class Avo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFormSection: false,
      helpVisible: false,
    };

    this.toggleAddForm = this.toggleAddForm.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
  }

  componentDidMount() {
    if (document.location.pathname === '/' && document.location.hash === '#add') {
      this.setState({
        addFormSection: true,
      });
    }
  }

  toggleHelp() {
    this.setState((prevState) => {
      return {
        helpVisible: !prevState.helpVisible,
      };
    });
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
      };
    });
  }

  render() {
    return (
      <div class="app">
        <div class="nav">
          <div class="nav-header">
            <a href="/" class="nav-header-link">
                <img class="nav-header-link-icon" src="https://assets.avocadojobs.com/android-chrome-192x192.png" alt="logo" />
                <div class="nav-header-link-brand">Avocado Jobs</div>
            </a>
          </div>
          {this.state.addFormSection ||
            <div class="nav-center">
              Hi.
            </div>
          }
          <div class="nav-links">
            <button onClick={this.toggleAddForm} class="nav-links-btn">Add application</button>
            <a href="/logout/">Log out</a>
          </div>
        </div>

        {this.state.addFormSection &&
          <New />
        }

        <List />

        <Loading />

        <footer>
          <div class="footer-body large">
            <div class="footer-body-content">
              {this.state.helpVisible &&
                <div class="footer-body-content-help" id="help">
                  <div class="footer-body-content-help-content">
                    <p>Although the 6 nterview stages are fairly self-explanatory here is some more info:</p>
                    <strong>&bull; To Do</strong>
                    <p>Listings that you plan to apply to.</p>
                    <strong>&bull; No initial response yet</strong>
                    <p>I sent my application and await response.</p>
                    <strong>&bull; I need to respond</strong>
                    <p>The company has responded and I need to response back. This option includes responding with a take-home project.</p>
                    <strong>&bull; Awaiting response</strong>
                    <p>Currently waiting for company response in order to continue with the next steps.</p>
                    <strong>&bull; Interview scheduled</strong>
                    <p>The next phase is a scheduled interview.</p>
                    <strong>&bull; Got offer</strong>
                    <p>I have received an offer from the company.</p>
                    <strong>&bull; Declined</strong>
                    <p>I have declined the company's offer.</p>
                    <strong>&bull; Got rejected</strong>
                    <p>I have been rejected by the company.</p>
                  </div>
                </div>
              }
              <a href="#help" title="Help" onClick={this.toggleHelp}>Help</a>
              &nbsp;| <a href="/about/" title="About">About</a>
              &nbsp;| <a href="https://medium.com/avocado-jobs" title="Blog" target="_blank" rel="noopener noreferrer">Blog</a>
              &nbsp;| <a href="mailto:hi@avocadojobs.com" title="Say hi!" target="_blank" rel="noopener noreferrer">Contact</a>
              &nbsp;| <a href="https://twitter.com/AvocadoJobs" title="Or maybe hello?" target="_blank" rel="noopener noreferrer">Tweet</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

render(<Avo />, document.body);
