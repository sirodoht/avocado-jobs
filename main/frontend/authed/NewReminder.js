import { h, Component } from 'preact';
import axios from 'axios';

import { getCsrf } from './util';

export default class NewReminder extends Component {
  constructor(props) {
    super(props);
    this.today = (new Date()).toISOString().substring(0, 10);
    this.state = {
      subject: '',
      body: '',
      day: this.today,
      hour: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // all fields required
    if (!this.state.subject || !this.state.body || !this.state.day || !this.state.hour) {
      return;
    }

    axios.post('/reminders/', {
        subject: this.state.subject,
        body: this.state.body,
        day: this.state.day,
        hour: this.state.hour,
      }, {
        headers: {
          'X-CSRFToken': getCsrf(),
        }
      })
      .then(() => {
        document.location.reload();
      })
      .catch((err) => {
        console.log('Failed to set new reminder. Error:', err);
        throw err;
      });
  }

  render() {
    return (
      <div class="header">
        <div class="header-add">
          <div class="header-add-title">
            Set a reminder
          </div>
          <div class="header-add-body">
            <p class="header-add-body-para">
              We will email you when the time has come
            </p>
            <form onSubmit={this.handleSubmit}>
              <div class="header-add-body-row">
                <input type="text" name="subject" id="add-subject" placeholder="Subject"
                  value={this.state.subject} onChange={this.handleChange} />
                <span>on</span>
                <input type="date" id="add-day" name="day" value={this.state.day} onChange={this.handleChange} />
                <input type="text" id="add-hour" name="hour" value={this.state.hour} placeholder="14:00"
                  onChange={this.handleChange} />
              </div>
              <div class="header-add-body-row">
                <textarea type="text" name="body" id="add-body" placeholder="Enter the reminder message" rows="3"
                  value={this.state.body} onChange={this.handleChange} />
              </div>
              <div class="header-add-body-row">
                <button type="submit" class="btn-negative">Set</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
