import { h, render, Component } from 'preact';


export default class List extends Component {
  render() {
    return (
      <div class="container-content-body">
        <div class="listings">
          <div class="listings-entry">
            <div class="listings-entry-detail">
              <div class="listings-entry-detail-info">
                <a class="listings-entry-detail-info-title" href="{{ link }}" target="_blank">
                  <strong>Role</strong>
                  <span class="muted">at</span>
                  <span class="listings-entry-detail-info-title-company">Company</span>
                  <span class="listings-entry-detail-info-title-date" title="Date applied">
                    <div class="listings-entry-detail-info-title-date-body">
                      date
                    </div>
                  </span>
                </a>
                <div class="listings-entry-detail-info-notes" data-id="{{ id }}" contenteditable="true" title="Notes">Notes</div>
                <div class="listings-entry-detail-info-spacer"></div>
                <div class="listings-entry-detail-info-salary" data-id="{{ id }}" contenteditable="true" title="Salary">$100k</div>
                <div class="listings-entry-detail-info-stage" data-id="{{ id }}" title="Current interview stage">
                  <select name="stage" class="submission-stage">
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
            <div class="listings-entry-control">
              <div class="listings-entry-control-rm" title="Remove job application" data-id="{{ id }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="reset">
          <div class="reset-tutorial" title="Start over the small tutorial" onclick="resetTutorial()">Reset intro</div>
          /
          <div class="reset-content" title="Reset demo data to their initial values" onclick="resetApplications()">Reset demo data</div>
        </div>
      </div>
    );
  }
}
