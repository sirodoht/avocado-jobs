import { h, render, Component } from 'preact';
import axios from 'axios';

import { getCsrf } from './util';

export default class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.key,
      stage: this.props.data.stage,
      notes: this.props.data.notes,
      salary: this.props.data.salary,
    }
    this.timeout = null;

    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleChange(event) {
    window.onbeforeunload = function confirmExit() {
      return 'Some changes you have made have not been saved. Are you sure you want to leave?';
    }

    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value,
      }, () => {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          document.getElementById('loading').style.display = 'block';
          axios.patch('/applications/', {
            id: this.state.id,
            [name]: value,
          }, {
            headers: {
              'X-CSRFToken': getCsrf(),
            }
          })
          .then(() => {
            window.onbeforeunload = null;
            document.getElementById('loading').style.display = 'none';
          })
          .catch((error) => {
            window.onbeforeunload = null;
            document.getElementById('loading').style.display = 'none';
            console.log('Failed to edit application. Error:', err);
            throw err;
          });
        }, 500);
      });
  }

  handleDelete(event) {
    if (!window.confirm('Are you sure you want to remove this application?')) {
      return;
    }

    this.props.onDelete(this.state.id);
  }

  render() {
    return (
      <div class="list-body-entry">
        <div class="list-body-entry-detail">
          <div class="list-body-entry-detail-info">
            <a class="list-body-entry-detail-info-title" href={this.props.data.link} target="_blank">
              <strong>{this.props.data.role}</strong>
              <span class="muted">at</span>
              <span class="list-body-entry-detail-info-title-company">{this.props.data.company}</span>
              <span class="list-body-entry-detail-info-title-date" title="Date applied">
                <div class="list-body-entry-detail-info-title-date-body">
                  {this.props.data.date}
                </div>
              </span>
            </a>
            <input type="text" name="salary" class="list-body-entry-detail-info-salary"
              title="Salary" onInput={this.handleChange} value={this.state.salary} />
            <div class="list-body-entry-detail-info-stage" title="Current interview stage">
              <select name="stage" class="submission-stage" value={this.state.stage} onChange={this.handleChange}>
                <option value="initial">No initial response yet</option>
                <option value="need">I need to respond</option>
                <option value="await">Awaiting response</option>
                <option value="scheduled">Interview scheduled</option>
                <option value="offer">Got offer</option>
                <option value="declined">Declined</option>
                <option value="rejected">Got Rejected</option>
              </select>
            </div>
          </div>
        </div>
        <div class="list-body-entry-control">
          <div class="list-body-entry-control-rm" title="Remove job application" onClick={this.handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
