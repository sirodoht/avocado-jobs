import { h, Component } from 'preact';
import axios from 'axios';

import { getCsrf } from './util';

export default class ListReminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };

    this.onDelete = this.onDelete.bind(this);
    this.onHoverOn = this.onHoverOn.bind(this);
    this.onHoverOff = this.onHoverOff.bind(this);
  }

  componentDidMount() {
    document.getElementById('loading').style.display = 'block';
    axios.get('/reminders/', {
        transformResponse: axios.defaults.transformResponse.concat((data) => {
          data.forEach((item) => {
            item.dateDisplay = `Scheduled for ${item.date}`;
          });
          return data;
        }),
      })
      .then((res) => {
        window.onbeforeunload = null;
        document.getElementById('loading').style.display = 'none';
        this.setState({
          list: res.data,
        });
      })
      .catch((err) => {
        document.getElementById('loading').style.display = 'none';
        console.log('Failed to fetch user reminders. Error:', err);
        throw err;
      });
  }

  onHoverOn(event) {
    this.setState((prevState) => {
      const id = parseInt(event.target.dataset.id);
      const newList = prevState.list.slice();
      newList.forEach((item) => {
        if (item.id === id) {
          item.dateDisplay = 'DELETE';
        }
      });
      return {
        list: newList,
      };
    });
  }

  onHoverOff(event) {
    this.setState((prevState) => {
      const id = parseInt(event.target.dataset.id);
      const newList = prevState.list.slice();
      newList.forEach((item) => {
        if (item.id === id) {
          item.dateDisplay = `Scheduled for ${item.date}`;
        }
      });
      return {
        list: newList,
      };
    });
  }

  onDelete(event) {
    if (!window.confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    const reminderId = parseInt(event.target.dataset.id);
    document.getElementById('loading').style.display = 'block';
    axios.delete(`/reminders/${reminderId}/`, {
        headers: {
          'X-CSRFToken': getCsrf(),
        }
      })
      .then(() => {
        document.getElementById('loading').style.display = 'none';
        this.setState((prevState) => {
          const newReminders = prevState.list.slice();
          for (let i = 0; i < newReminders.length; i++) {
            if (newReminders[i].id === reminderId) {
              newReminders.splice(i, 1);
              break;
            }
          }
          return {
            list: newReminders,
          };
        });
      })
      .catch((err) => {
        document.getElementById('loading').style.display = 'none';
        console.log('Failed to delete reminder. Error:', err);
        throw err;
      });
  }

  render() {
    return (
      <div class="reminders" id="reminders">
        <div class="reminders-title">
          Reminders
        </div>
        <div class="reminders-content">
          {this.state.list.length === 0 &&
            <div class="reminders-content-empty">
              You have no reminders set. Use the button on the top bar to set one.
            </div>
          }
          {this.state.list.map((item) => (
            <div class="reminders-content-item" key={item.id}>
              <div class="reminders-content-item-header">
                <div class="reminders-content-item-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 85" width="25" fill="#f2982c">
                    <path d="M47.3 5.1H36.7v5.5H47V9.1h.3c16.5 0 29.9 13.4 29.9 29.9v15.1h4v-15c0-18.8-15.2-34-33.9-34z"/>
                    <path d="M41.5 13.6c-17.6 0-31.9 14.3-31.9 31.9s14.3 31.9 31.9 31.9 31.9-14.3 31.9-31.9c0-17.7-14.3-31.9-31.9-31.9zm0 36.2c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4 2 4.4 4.4-2 4.4-4.4 4.4z"/>
                  </svg>
                </div>
                <div class="reminders-content-item-header-subject">
                  {item.subject}
                </div>
              </div>
              <div class="reminders-content-item-body">
                {item.body}
              </div>
              <div class="reminders-content-item-date" data-id={item.id} onClick={this.onDelete}
                onMouseEnter={this.onHoverOn} onMouseLeave={this.onHoverOff} title="Scheduled date and time. Click to delete.">
                <strong>{item.dateDisplay}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
