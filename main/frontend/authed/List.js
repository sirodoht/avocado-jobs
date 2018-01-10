import { h, Component } from 'preact';
import axios from 'axios';

import ListItem from './ListItem';
import { getCsrf } from './util';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      filters: [],
      sortOptions: this.getSortOptions(),
    };

    this.onDelete = this.onDelete.bind(this);
    this.activateFilter = this.activateFilter.bind(this);
    this.sortBy = this.sortBy.bind(this);
  }

  componentDidMount() {
    document.getElementById('loading').style.display = 'block';
    axios.get('/applications/')
      .then((res) => {
        window.onbeforeunload = null;
        document.getElementById('loading').style.display = 'none';
        this.setState({
          applications: res.data,
        }, () => {
          const sortOptions = this.state.sortOptions;
          this.sortBy(null, sortOptions);
        });
      })
      .catch((err) => {
        document.getElementById('loading').style.display = 'none';
        console.log('Failed to fetch user applications. Error:', err);
        throw err;
      });
  }

  onDelete(listingId) {
    document.getElementById('loading').style.display = 'block';
    axios.delete(`/applications/${listingId}/`, {
        headers   : {
          'X-CSRFToken': getCsrf(),
        }
      })
      .then(() => {
        document.getElementById('loading').style.display = 'none';
        this.setState((prevState) => {
          const newApplications = prevState.applications.slice();
          for (let i = 0; i <= newApplications.length; i++) {
            if (newApplications[i].id === listingId) {
              newApplications.splice(i, 1);
              break;
            }
          }
          return {
            applications: newApplications,
          };
        });
      })
      .catch((err) => {
        document.getElementById('loading').style.display = 'none';
        console.log('Failed to delete application. Error:', err);
        throw err;
      });
  }

  activateFilter(event) {
    const filterId = event.target.dataset.id;

    this.setState((prevState) => {
      const newFilters = prevState.filters.slice();

      // filter inactive, we add it
      if (prevState.filters.indexOf(filterId) === -1) {
        newFilters.push(filterId);
        event.target.classList.add('list-filters-item-active');
      } else {  // filter is active, we remove it
        prevState.filters.forEach((single, index) => {
          if (single === filterId) {
            newFilters.splice(index, 1);
          }
        });
        event.target.classList.remove('list-filters-item-active');
      }

      return {
        filters: newFilters,
      };
    });
  }

  getSortOptions() {
    const sortOptions = window.localStorage.getItem('avocadoSortOptions') || 'date:DESC';
    return sortOptions;
  }

  sortBy(event, sortOptions) {
    const newSortField = sortOptions ? sortOptions.split(':')[0] : event.target.dataset.id;
    this.setState((prevState) => {
      const newApplications = prevState.applications.slice();
      const [ sortField, sortOrder ] = prevState.sortOptions.split(':');
      let newSortOrder = 'ASC';
      if (sortField === newSortField) {
        if (sortOrder === 'ASC') {
          newSortOrder = 'DESC';
        } else {
          newSortOrder = 'ASC';
        }
      }

      // override if sortOptions is given
      newSortOrder = sortOptions ? sortOptions.split(':')[1] : newSortOrder;

      const newSortOptions = `${newSortField}:${newSortOrder}`;
      window.localStorage.setItem('avocadoSortOptions', newSortOptions);
      newApplications.sort((a, b) => {
        let aRegex = null;
        let bRegex = null;
        let aField = a[newSortField] ? a[newSortField].toLowerCase() : '';
        let bField = b[newSortField] ? b[newSortField].toLowerCase() : '';
        if (newSortField === 'salary') {
          aRegex = a[newSortField] ? a[newSortField].match(/\d+/) : null;
          bRegex = b[newSortField] ? b[newSortField].match(/\d+/) : null;
          aField = aRegex ? parseInt(aRegex[0]) : null;
          bField = bRegex ? parseInt(bRegex[0]) : null;
        }
        if (aField < bField) {
          if (newSortOrder === 'ASC') {
            return -1;
          } else {
            return 1;
          }
        }
        if (aField > bField) {
          if (newSortOrder === 'ASC') {
            return 1;
          } else {
            return -1;
          }
        }

        // a must be equal to b
        return 0;
      });

      return {
        sortOptions: newSortOptions,
        applications: newApplications,
      };
    });
  }

  getSortClasses(field) {
    const sortField = this.state.sortOptions.split(':')[0];
    if (sortField === field) {
      return 'list-sort-item list-sort-item-active';
    } else {
      return 'list-sort-item';
    }
  }

  render() {
    return (
      <div class="list">
        {this.state.applications.length === 0 ||
          <div class="list-filters">
            <div class="list-filters-title">Filters:</div>
            <div onClick={this.activateFilter} data-id="todo" class="list-filters-item">To Do</div>
            <div onClick={this.activateFilter} data-id="initial" class="list-filters-item">No initial response yet</div>
            <div onClick={this.activateFilter} data-id="need" class="list-filters-item">I need to respond</div>
            <div onClick={this.activateFilter} data-id="await" class="list-filters-item">Awaiting response</div>
            <div onClick={this.activateFilter} data-id="scheduled" class="list-filters-item">Interview scheduled</div>
            <div onClick={this.activateFilter} data-id="offer" class="list-filters-item">Got offer</div>
            <div onClick={this.activateFilter} data-id="declined" class="list-filters-item">Declined</div>
            <div onClick={this.activateFilter} data-id="rejected" class="list-filters-item">Got rejected</div>
          </div>
        }
        {this.state.applications.length === 0 ||
          <div class="list-sort">
            <div class="list-sort-title">Sort by:</div>
            <div onClick={this.sortBy} data-id="role" class={this.getSortClasses('role')}>Role</div>
            <div onClick={this.sortBy} data-id="company" class={this.getSortClasses('company')}>Company</div>
            <div onClick={this.sortBy} data-id="date" class={this.getSortClasses('date')}>Date</div>
            <div onClick={this.sortBy} data-id="salary" class={this.getSortClasses('salary')}>Salary</div>
            <div onClick={this.sortBy} data-id="stage" class={this.getSortClasses('stage')}>Stage</div>
          </div>
        }
        <div class="list-body">
          {this.state.applications.length === 0 &&
            <div class="list-body-empty">
              You have no applications yet! Click the <code>#f2982c</code> button above to add one.
            </div>
          }
          {this.state.applications.map((item) => (
            <ListItem key={item.id} data={item} onDelete={this.onDelete}
              visible={this.state.filters.length !== 0 && this.state.filters.indexOf(item.stage) === -1 ? true : false} />
          ))}
        </div>
      </div>
    );
  }
}
