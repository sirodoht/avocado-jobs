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
        <div class="list-body">
          {this.props.state.applications.map((item) => (
            <ListItem key={item.id} data={item} onDelete={this.props.onDelete}
              visible={this.props.state.filters.length !== 0 && this.props.state.filters.indexOf(item.stage) === -1 ? true : false} />
          ))}
        </div>
      </div>
    );
  }
}
