import { h, render, Component } from 'preact';
import axios from 'axios';

import { getCsrf } from './util';


export default class New extends Component {
  constructor(props) {
    super(props);
    this.today = (new Date()).toISOString().substring(0, 10);
    this.state = {
      role: '',
      company: '',
      stage: 'initial',
      date: '',
      link: '',
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

    // role and company are required
    if (!this.state.role || !this.state.company) {
      return;
    }

    // get date manually because preact makes native date picker unusable
    const newDate = document.getElementById('add-date').value;

    axios.post('/applications/', {
        role: this.state.role,
        company: this.state.company,
        salary: this.state.salary,
        stage: this.state.stage,
        date: newDate,
        link: this.state.link,
      }, {
        headers: {
          'X-CSRFToken': getCsrf(),
        }
      })
      .then(() => {
        document.location.reload();
      })
      .catch((error) => {
        console.log('Failed to create new application. Error:', err);
        throw err;
      });
  }

  render() {
    return (
      <div class="header">
        <div class="header-add">
          <div class="header-add-title">
            Add new job application
          </div>
          <div class="header-add-body">
            <form onSubmit={this.handleSubmit}>
              <div class="header-add-body-row">
                <input
                  type="text" name="role" id="add-role" placeholder="Frontend Developer"
                  value={this.state.role} onChange={this.handleChange} />
                <span>at</span>
                <input type="text" name="company" id="add-company" placeholder="Avocado Jobs, Inc."
                  value={this.state.company} onChange={this.handleChange} />
              </div>
              <div class="header-add-body-row">
                <input type="text" name="salary" id="add-salary" placeholder="$100k"
                  value={this.state.salary} onChange={this.handleChange} />
                <select name="stage" id="add-stage" value={this.state.stage} onChange={this.handleChange}>
                  <option value="todo">To Do</option>
                  <option value="initial">No initial response yet</option>
                  <option value="need">I need to respond</option>
                  <option value="await">Awaiting response</option>
                  <option value="scheduled">Interview scheduled</option>
                  <option value="offer">Got offer</option>
                  <option value="declined">Declined</option>
                  <option value="rejected">Got Rejected</option>
                </select>
                <input type="date" id="add-date" value={this.today} />
              </div>
              <div class="header-add-body-row">
                <input type="text" name="link" id="add-link" placeholder="https://careers.avocadojobs.com/frontend-dev-8dbgf8"
                  value={this.state.link} onChange={this.handleChange} />
              </div>
              <div class="header-add-body-row">
                <button type="submit" class="btn-negative">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
