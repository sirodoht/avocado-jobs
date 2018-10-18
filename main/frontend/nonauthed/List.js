import { h, Component } from 'preact';

import ListItem from './ListItem';

export default class List extends Component {
  render() {
    return (
      <div class="list">
        <div class="list-filters">
          <div class="list-filters-title">Filters:</div>
          <div onClick={this.props.activateFilter} data-id="todo" class="list-filters-item">To Do</div>
          <div onClick={this.props.activateFilter} data-id="initial" class="list-filters-item">No initial response yet</div>
          <div onClick={this.props.activateFilter} data-id="need" class="list-filters-item">I need to respond</div>
          <div onClick={this.props.activateFilter} data-id="await" class="list-filters-item">Awaiting response</div>
          <div onClick={this.props.activateFilter} data-id="scheduled" class="list-filters-item">Interview scheduled</div>
          <div onClick={this.props.activateFilter} data-id="offer" class="list-filters-item">Got offer</div>
          <div onClick={this.props.activateFilter} data-id="declined" class="list-filters-item">Declined</div>
          <div onClick={this.props.activateFilter} data-id="rejected" class="list-filters-item">Got rejected</div>
        </div>
        <div class="list-sort">
          <div class="list-sort-title">Sort by:</div>
          <div onClick={this.props.sortBy} data-id="role" class={this.props.getSortClasses('role')}>Role</div>
          <div onClick={this.props.sortBy} data-id="company" class={this.props.getSortClasses('company')}>Company</div>
          <div onClick={this.props.sortBy} data-id="date" class={this.props.getSortClasses('date')}>Date</div>
          <div onClick={this.props.sortBy} data-id="salary" class={this.props.getSortClasses('salary')}>Salary</div>
          <div onClick={this.props.sortBy} data-id="stage" class={this.props.getSortClasses('stage')}>Stage</div>
        </div>

        {this.props.arrow2Visible &&
          <div class="arrow-2">
            <div class="arrow-2-content">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 195.6 759" width="60">
                <path fill="#fc5a5c" d="M186.3 226c-.6 1.6-1.3 3.2-1.9 4.7-1.2 2.5-2.8 3.9-5.1 4.2-3.4-1.4-7-2.6-10.2-4.8-2.5-1.8-4.9-3.6-7.3-5.6-4.1-3.5-8.1-7.1-12-10.8-9.1-8.8-18-17.7-26.8-26.7-8.5-8.6-16.8-17.8-25.2-26.7-4.7-5-9.2-10.3-13.6-15.6-4.8-5.6-9.5-11.4-14.1-17.3 9.2 25 18.1 50.1 26.2 75.6 8.1 25.3 16.2 50.5 23 76.4 2 7.5 3.9 15.1 5.9 22.6 1.4 5.4 2.4 10.9 3.7 16.4 1.6 7.2 3.2 14.3 4.8 21.5 1.9 8.3 3.2 16.8 4.8 25.3 1.1 6.1 2.4 12.3 3.4 18.4 1.1 7.8 2.3 15.6 3.4 23.4 2 13.4 3.3 26.8 4.8 40.2.7 6.4 1.1 13 1.6 19.4.7 8.4 1.3 16.8 1.7 25.2.7 14.9 1.3 29.9 1.7 44.8.4 12.2.5 24.5.5 36.7 0 13.3.2 26.7-.6 39.9-.6 9.8-.9 19.7-1.9 29.5-.7 7.1-1.4 14.2-2.4 21.3-1.8 13.1-4.3 26-6.9 38.9-2.8 14-4.9 29.7-11.8 41.6-1.5 3.3-3.7 5.1-6.6 5.5-2.9-.4-5.1-2.2-6.6-5.5-2.1-4.3-3.5-9-4-14-.9-7.1-.6-13.8.6-20.5.3-1.8.6-3.6 1-5.4.1-.4.2-.9.3-1.3 2.1-10.8 4.4-21.6 6.7-32.4 1.4-7.1 2.8-14.3 3.9-21.5 1.3-9.1 2.3-18.2 3.2-27.4l.6-10.9c.3-6.3.3-12.8.4-19.1.2-10.8.1-21.6-.1-32.4-.4-23.9-1.1-47.8-2.1-71.7-.5-7.5-.9-15.1-1.7-22.5-1.1-10.7-1.9-21.5-3.4-32.1-1.5-10.8-2.6-21.7-4.4-32.3-1.9-10.9-3.8-21.9-5.7-32.8-2.2-10.6-4.2-21.3-6.8-31.8-1.7-7.1-3.5-14.1-5.2-21.2-1.3-5.4-2.5-10.9-3.9-16.2-3.4-12.4-6.6-24.9-10.3-37.1-4.2-13.8-8.1-27.8-12.6-41.4-4-12.2-8.2-24.3-12.2-36.5-2.7-8-5.3-16-8.2-23.8-5-13.3-9.9-26.6-14.8-39.9 1.1 9.2 1.9 18.6 2.6 27.9 1.1 14.5 2.2 29.1 2.6 43.6.3 10.4.6 20.6.6 31-.1 10.3-.4 20.6-.8 30.9-.4 10.7-1.1 21.4-1.9 32.1-.3 4.9-.7 9.9-1.1 14.8-.9 11-2.1 22.4-6.9 31.9-1.3 2.6-3 4.1-5.4 4.5-2.4-.3-4.2-1.8-5.4-4.5-1.7-3.5-2.8-7.3-3.2-11.3-.8-5.8-.5-11.2.5-16.7l-.2.8c2.1-10.4 2.8-21.4 3.9-32 .8-8 1.5-16.1 2.2-24.2.4-6.5.9-12.9 1-19.4.3-10.3.6-20.5.6-30.8 0-17.6-.8-35.2-1.7-52.8-1.3-16.4-2.8-32.7-5-49-3.1-21.8-6.5-43.5-10.1-65.2a40.28 40.28 0 0 1 0-9.8c.5-3.2 1.4-8 3.9-9.9 4.8-3.6 7.1 5.9 7.8 9.9.3 1.9.7 3.8 1 5.7.9-.6 1.8-1 2.9-1.2.3 0 .6.1.8.1.3-.3.6-.7.9-1 3.4-2.6 5.8-.1 8 3.2 11 17.6 22.6 35.4 35.2 52.1 12.1 15.6 25 30.1 38.5 43.9 7.5 7.7 14.9 15.4 22.6 22.8 7.6 7.2 15.1 14.4 22.9 21.3 8.6 7.6 17.2 14.9 25.3 23.4 4.7 5 5.9 13.5 5.9 20.8 0 4.3-.7 8.6-1.8 12.8z"/>
              </svg>
              <div class="arrow-2-content-text">
                Click to expand
              </div>
            </div>
          </div>
        }

        <div class="demo-seal">
          <img src="https://avocadojobs.com/staticfiles/main/images/demo-data.png" alt="demo data" />
        </div>

        <div class="list-body">
          {this.props.state.applications.map((item) => (
            <ListItem key={item.id} data={item} onDelete={this.props.onDelete} hideArrow2={this.props.hideArrow2}
              visible={this.props.state.filters.length !== 0 && this.props.state.filters.indexOf(item.stage) === -1 ? true : false} />
          ))}
        </div>
      </div>
    );
  }
}
