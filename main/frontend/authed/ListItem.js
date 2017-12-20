import { h, Component } from 'preact';
import axios from 'axios';

import { getCsrf } from './util';

export default class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.key,
      role: this.props.data.role,
      company: this.props.data.company,
      date: this.props.data.date,
      link: this.props.data.link,
      stage: this.props.data.stage,
      notes: this.props.data.notes,
      salary: this.props.data.salary,
      updateRole: this.props.data.role,
      updateCompany: this.props.data.company,
      updateDate: this.props.data.date,
      updateLink: this.props.data.link,
      dropVisible: false,
      modalVisible: false,
    };
    this.timeout = null;

    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.toggleDropSection = this.toggleDropSection.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', (event) => {
      const escapeKeyCode = 27;
      if (event.keyCode === escapeKeyCode) {
        this.setState({
          modalVisible: false,
        });
      }
    });
  }

  componentDidUpdate() {
    if (this.state.modalVisible) {
      const modal = document.getElementById(this.state.id);
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          this.setState({
            modalVisible: false,
          });
        }
      });
    }
  }

  handleChange(event) {
    window.onbeforeunload = function confirmExit() {
      return 'Some changes you have made have not been saved. Are you sure you want to leave?';
    };

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
          .catch((err) => {
            window.onbeforeunload = null;
            document.getElementById('loading').style.display = 'none';
            console.log('Failed to edit application. Error:', err);
            throw err;
          });
        }, 300);
    });
  }

  handleDelete() {
    if (!window.confirm('Are you sure you want to remove this application?')) {
      return;
    }

    this.props.onDelete(this.state.id);
  }

  toggleEdit() {
    this.setState((prevState) => {
      return {
        modalVisible: !prevState.modalVisible,
      };
    });
  }

  handleFormChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value,
    });
  }

  handleUpdate(event) {
    event.preventDefault();

    axios.patch('/applications/', {
      id: this.state.id,
      role: this.state.updateRole,
      company: this.state.updateCompany,
      date: this.state.updateDate,
      link: this.state.updateLink,
    }, {
      headers: {
        'X-CSRFToken': getCsrf(),
      }
    })
    .then((res, err) => {
      if (err) {
        console.log('Failed to update application. Error:', err);
        throw err;
      } else {
        this.setState((prevState) => {
          return {
            modalVisible: !prevState.modalVisible,
          };
        });
      }
    })
    .catch((err) => {
      console.log('Failed to update application. Error:', err);
      throw err;
    });
  }

  toggleDropSection() {
    this.setState((prevState) => {
      return {
        dropVisible: !prevState.dropVisible,
      };
    });
  }

  render() {
    return (
      <div>
        {this.state.modalVisible &&
          <div class="modal" id={this.state.id}>
            <div class="modal-content">
              <div class="modal-content-title">
                Update application
              </div>
              <form onSubmit={this.handleUpdate}>
                <div class="modal-content-item">
                  <label for="update-role">Role</label>
                  <input type="text" name="updateRole" id="update-role" placeholder={this.state.updateRole}
                    value={this.state.updateRole} onChange={this.handleFormChange} />
                </div>
                <div class="modal-content-item">
                  <label for="update-company">Company</label>
                  <input type="text" name="updateCompany" id="update-company" placeholder={this.state.updateCompany}
                    value={this.state.updateCompany} onChange={this.handleFormChange} />
                </div>
                <div class="modal-content-item">
                  <label for="update-date">Date</label>
                  <input type="date" id="update-date" name="updateDate" value={this.state.updateDate}
                    onChange={this.handleFormChange} />
                </div>
                <div class="modal-content-item">
                  <label for="update-link">Link</label>
                  <input type="text" name="updateLink" id="update-link" placeholder={this.state.updateLink}
                    value={this.state.updateLink} onChange={this.handleFormChange} />
                </div>
                <div class="modal-content-controls">
                  <button type="submit" class="btn-primary">Save</button>
                  <button type="button" class="btn-cancel" onClick={this.toggleEdit}>Cancel</button>
                  <button type="button" class="btn-danger" onClick={this.handleDelete}>Delete application</button>
                </div>
              </form>
            </div>
          </div>
        }
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
                {this.state.dropVisible ||
                  <div class="list-body-entry-line-control-remove" title="Remove job application" onClick={this.handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                }
                {this.state.dropVisible &&
                  <div class="list-body-entry-line-control-settings" title="Edit application" onClick={this.toggleEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 86.4" width="24" height="24" fill="currentColor">
                      <path d="M0 45.9h15.1a13.47 13.47 0 0 0 26.4 0H81v-5.4H41.6a13.47 13.47 0 0 0-26.4 0H0v5.4zm28.3-10.8a8.1 8.1 0 1 1-8.1 8.1 8.07 8.07 0 0 1 8.1-8.1zM39.4 10.8H0v5.4h39.5a13.47 13.47 0 0 0 26.4 0H81v-5.4H65.9a13.53 13.53 0 0 0-26.5 0zm21.4 2.7a8.1 8.1 0 1 1-8.1-8.1 8.07 8.07 0 0 1 8.1 8.1zM65.9 75.6H81v-5.4H65.9a13.47 13.47 0 0 0-26.4 0H0v5.4h39.5a13.47 13.47 0 0 0 26.4 0zm-21.3-2.7a8.1 8.1 0 1 1 8.1 8.1 8.07 8.07 0 0 1-8.1-8.1z"/>
                    </svg>
                  </div>
                }
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
                <textarea name="notes" rows="5" cols="70" onKeyUp={this.handleChange} placeholder="Write notes here">
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
