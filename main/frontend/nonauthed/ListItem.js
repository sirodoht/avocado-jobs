import { h, Component } from 'preact';

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
      dropVisible: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleDropSection = this.toggleDropSection.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleDelete() {
    if (!window.confirm('Are you sure you want to remove this application?')) {
      return;
    }

    this.props.onDelete(this.state.id);
  }

  toggleDropSection() {
    const newDropVisible = !this.state.dropVisible;
    this.setState({
      dropVisible: newDropVisible,
    }, () => {
      if (localStorage.avocadoTutorialStep2 !== 'done') {
        this.props.hideArrow2();
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
                <div class="list-body-entry-line-control-remove" title="Remove job application" onClick={this.handleDelete}>
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
