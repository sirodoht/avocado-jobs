import { h, render, Component } from 'preact';
import axios from 'axios';

import New from './New';
import List from './List';
import NewReminder from './NewReminder';
import ListReminders from './ListReminders';
import Loading from './Loading';
import { getCsrf } from './util';

class Avo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFormSection: false,
      helpVisible: false,
      reminderVisible: false,
      feedbackVisible: false,
    };

    this.toggleAddForm = this.toggleAddForm.bind(this);
    this.toggleReminder = this.toggleReminder.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.toggleFeedback = this.toggleFeedback.bind(this);
    this.sendFeedback = this.sendFeedback.bind(this);
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
      const newState = {
        helpVisible: !prevState.helpVisible,
      };
      if (newState.helpVisible) {
        newState.feedbackVisible = false;
      }
      return newState;
    });
  }

  toggleFeedback() {
    this.setState((prevState) => {
      const newState = {
        feedbackVisible: !prevState.feedbackVisible,
      };
      if (newState.feedbackVisible) {
        newState.helpVisible = false;
      }
      return newState;
    });
  }

  sendFeedback() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('feedback-button').innerText = 'Sending...';
    const message = document.getElementById('feedback-message').value;
    axios.post('/feedback/', {
      message,
    }, {
      headers: {
        'X-CSRFToken': getCsrf(),
      }
    })
    .then(() => {
      document.getElementById('feedback-message').value = '';
      document.getElementById('loading').style.display = 'none';
      document.getElementById('feedback-button').innerText = 'Message sent';
    })
    .catch((err) => {
      document.getElementById('loading').style.display = 'none';
      console.log('Failed to send feedback :(. Error:', err);
      throw err;
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
        reminderVisible: false,
      };
    });
  }

  toggleReminder() {
    this.setState((prevState) => {
      return {
        addFormSection: false,
        reminderVisible: !prevState.reminderVisible,
      };
    });
  }

  render() {
    return (
      <div class="app">
        <div class="nav">
          <div class="nav-header">
            <a href="/" class="nav-header-link">
              <img class="nav-header-link-icon" src="https://assets.avocadojobs.com/main/android-chrome-192x192.png" alt="logo" />
              <div class="nav-header-link-brand">Avocado Jobs</div>
            </a>
          </div>
          <div class="nav-center">
            <a href="/" class="nav-center-item active">My applications</a>
            <div class="nav-center-separator"></div>
            <a href="/board/" class="nav-center-item">Job Board</a><sup>beta</sup>
          </div>
          <div class="nav-links">
            <button onClick={this.toggleReminder} class="nav-links-lite">Set reminder</button>
            <button onClick={this.toggleAddForm} class="nav-links-btn">Add application</button>
            <a href="/logout/">Log out</a>
          </div>
        </div>

        {this.state.addFormSection &&
          <New />
        }

        {this.state.reminderVisible &&
          <NewReminder />
        }

        <List />

        <Loading />

        <ListReminders />

        <footer>
          <div class="footer-body large">
            <div class="footer-body-content">
              {this.state.feedbackVisible &&
                <div class="footer-body-content-feedback" id="feedback">
                  <div class="footer-body-content-feedback-content">
                    <p>
                      Need help? Have feedback?
                      <svg xmlns="http://www.w3.org/2000/svg" onClick={this.toggleFeedback} width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </p>
                    <textarea placeholder="Write your message" rows="3" id="feedback-message"></textarea>
                    <button onClick={this.sendFeedback} id="feedback-button">Send</button>
                  </div>
                </div>
              }
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
              <a href="#feedback" title="Give feedback" onClick={this.toggleFeedback}>Feedback</a>
              &nbsp;| <a href="#help" title="Help" onClick={this.toggleHelp}>Help</a>
              &nbsp;| <a href="/about/" title="About">About</a>
              &nbsp;| <a href="https://medium.com/avocado-jobs" title="Blog" target="_blank" rel="noopener noreferrer">Blog</a>
              &nbsp;| <a href="mailto:hi@avocadojobs.com" title="Say hi!" target="_blank" rel="noopener noreferrer">Email</a>
              &nbsp;| <a href="https://twitter.com/AvocadoJobs" title="Or maybe hello?" target="_blank" rel="noopener noreferrer">Tweet</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

render(<Avo />, document.body);
