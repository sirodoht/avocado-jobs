import { h, Component } from 'preact';

export default class New extends Component {
  render() {
    return (
      <div class="header">
        <div class="header-add">
          <div class="header-add-title">
            Add new job application
          </div>
          <div class="header-add-body">
            <form onSubmit={this.props.handleNewSubmit}>
              <div class="header-add-body-row">
                <input type="text" name="newRole" id="add-role" placeholder="Frontend Developer"
                  value={this.props.state.newRole} onChange={this.props.handleNewChange} />
                <span>at</span>
                <input type="text" name="newCompany" id="add-company" placeholder="Avocado Jobs, Inc."
                  value={this.props.state.newCompany} onChange={this.props.handleNewChange} />
              </div>
              <div class="header-add-body-row">
                <input type="text" name="newSalary" id="add-salary" placeholder="$100k - $120k"
                  value={this.props.state.newSalary} onChange={this.props.handleNewChange} />
                <select name="newStage" id="add-stage" value={this.props.state.newStage} onChange={this.props.handleNewChange}>
                  <option value="todo">To Do</option>
                  <option value="initial">No initial response yet</option>
                  <option value="need">I need to respond</option>
                  <option value="await">Awaiting response</option>
                  <option value="scheduled">Interview scheduled</option>
                  <option value="offer">Got offer</option>
                  <option value="declined">Declined</option>
                  <option value="rejected">Got Rejected</option>
                </select>
                <input type="date" id="add-date" name="newDate" value={this.props.state.newDate} onChange={this.props.handleNewChange} />
              </div>
              <div class="header-add-body-row">
                <input type="text" name="newLink" id="add-link" placeholder="https://careers.avocadojobs.com/frontend-dev-8dbgf8"
                  value={this.props.state.newLink} onChange={this.props.handleNewChange} />
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
