import { h, render, Component } from 'preact';


export default class New extends Component {
  render() {
    return (
      <div class="container-content-add">
        <div class="container-content-add-content">
          <div class="container-content-add-content-title">
            Add new job application
          </div>
          <div class="container-content-add-content-body">
            <div class="container-content-add-content-body-row">
              <input type="text" name="role" id="add-role" placeholder="Frontend Developer" />
              <span>at</span>
              <input type="text" name="company" id="add-company" placeholder="Avocado Jobs, Inc." />
            </div>
            <div class="container-content-add-content-body-row">
              <input type="text" name="salary" id="add-salary" placeholder="$100k" />
              <select name="stage" id="add-stage">
                <option value="initial">No initial response yet</option>
                <option value="need">I need to respond</option>
                <option value="await">Awaiting response</option>
                <option value="scheduled">Interview scheduled</option>
                <option value="offer">Got offer</option>
                <option value="declined">Declined</option>
                <option value="rejected">Got Rejected</option>
              </select>
              <input type="date" id="add-date" value="{{ today }}" />
            </div>
            <div class="container-content-add-content-body-row">
              <input type="text" name="link" id="add-link" placeholder="https://careers.avocadojobs.com/frontend-dev-8dbgf8" />
            </div>
            <div class="container-content-add-content-body-row">
              <button class="btn-negative" onclick="addApplication()">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
