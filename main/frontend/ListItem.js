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
      dropVisible: false,
    }
    this.timeout = null;

    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleDropSection = this.toggleDropSection.bind(this);
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
        }, 300);
      });
  }

  handleDelete(event) {
    if (!window.confirm('Are you sure you want to remove this application?')) {
      return;
    }

    this.props.onDelete(this.state.id);
  }

  toggleDropSection() {
    this.setState((prevState) => {
      return {
        dropVisible: !prevState.dropVisible,
      }
    });
  }

  render() {
    return (
      <div>
        {this.props.visible ||
          <div class="list-body-entry">
            <div class="list-body-entry-line">
              <div class="list-body-entry-line-detail">
                <div class="list-body-entry-line-detail-info">
                  <div class="list-body-entry-line-detail-info-title" onClick={this.toggleDropSection}>
                    <div class={`list-body-entry-line-detail-info-title-arrow ${this.state.dropVisible ? 'active' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 27.36 44.95" fill="currentColor">
                        <path d="M0 40l4.95 4.95 22.41-22.47L4.95 0 0 4.95l17.54 17.53L0 40z"/>
                      </svg>
                    </div>
                    <strong>{this.props.data.role}</strong>
                    <span class="list-body-entry-line-detail-info-title-muted">at</span>
                    <span class="list-body-entry-line-detail-info-title-company">{this.props.data.company}</span>
                    <span class="list-body-entry-line-detail-info-title-date" title="Date applied">
                      <div class="list-body-entry-line-detail-info-title-date-body">
                        {this.props.data.date}
                      </div>
                    </span>
                  </div>
                  <input type="text" name="salary" class="list-body-entry-line-detail-info-salary"
                    title="Salary" onInput={this.handleChange} value={this.state.salary} />
                  <div class="list-body-entry-line-detail-info-stage" title="Current interview stage">
                    <select name="stage" class="submission-stage" value={this.state.stage} onChange={this.handleChange}>
                      <option value="todo">To Do</option>
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
              <div class="list-body-entry-line-control">
                <div class="list-body-entry-line-control-rm" title="Remove job application" onClick={this.handleDelete}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>
            {this.state.dropVisible &&
              <div class="list-body-entry-drop">
                <div class="list-body-entry-drop-link">
                  <a href={this.props.data.link} target="_blank">
                    {this.props.data.link}
                  </a>
                  {this.props.data.link &&
                    <div class="list-body-entry-drop-link-icon" title="Opens external link">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="15" height="15">
                        <path d="M16 11v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6M13 1h6v6M8 12L19 1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      </svg>
                    </div>
                  }
                </div>
                <textarea rows="5" cols="70">
                  {this.state.notes}
                </textarea>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}
