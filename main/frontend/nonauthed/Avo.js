import { h, render, Component } from 'preact';

import New from './New';
import List from './List';
import demoData from './demo-data';

class Avo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFormSection: false,
      applications: demoData,
      filters: [],
      sortOptions: this.getSortOptions(),
      newRole: '',
      newCompany: '',
      newStage: 'initial',
      newDate: '',
      newLink: '',
    };

    this.handleNewChange = this.handleNewChange.bind(this);
    this.handleNewSubmit = this.handleNewSubmit.bind(this);

    this.activateFilter = this.activateFilter.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.getSortClasses = this.getSortClasses.bind(this);
    this.toggleAddForm = this.toggleAddForm.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const sortOptions = this.state.sortOptions;
    this.sortBy(null, sortOptions);

    if (document.location.pathname === '/' && document.location.hash === '#add') {
      this.setState({
        addFormSection: true,
      });
    }
  }

  handleNewChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleNewSubmit(event) {
    event.preventDefault();

    // role and company are required
    if (!this.state.newRole || !this.state.newCompany) {
      return;
    }

    this.setState((prevState) => {
      const newApplications = prevState.applications.slice();
      newApplications.push({
        role: this.state.newRole,
        company: this.state.newCompany,
        salary: this.state.newSalary,
        stage: this.state.newStage,
        date: this.state.newDate,
        link: this.state.newLink,
      });

      return {
        newRole: '',
        newCompany: '',
        newStage: 'initial',
        newSalary: '',
        newDate: '',
        newLink: '',
        applications: newApplications,
      };
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

  toggleAddForm() {
    if (document.location.pathname === '/') {
      if (document.location.hash === '') {
        history.pushState('add', document.title, window.location.pathname + '#add');
      } else if (document.location.hash === '#add') {
        history.pushState('index', document.title, window.location.pathname);
      }
    } else {
      document.location.replace('/#add');
    }

    this.setState((prevState) => {
      return {
        addFormSection: !prevState.addFormSection,
      };
    });
  }

  onDelete(listingId) {
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
  }

  render() {
    return (
      <div class="app">
        <div class="nav">
          <div class="nav-header">
            <a href="/" class="nav-header-link">
              <img class="nav-header-link-icon" src="/staticfiles/main/android-chrome-192x192.png" alt="logo" />
              <div class="nav-header-link-brand">Avocado Jobs</div>
            </a>
          </div>
          <div class="nav-links">
            <button onClick={this.toggleAddForm} class="nav-links-btn">Add application</button>
            <a href="/logout/">Log out</a>
          </div>
        </div>

        {this.state.addFormSection &&
          <New state={this.state} handleNewChange={this.handleNewChange} handleNewSubmit={this.handleNewSubmit} />
        }

        {this.state.addFormSection ||
          <div class="header">
            <div class="header-copy large">
              <h1>Keep track of your job applications</h1>
            </div>
          </div>
        }

        <List state={this.state} onDelete={this.onDelete}
          activateFilter={this.activateFilter} sortBy={this.sortBy} getSortClasses={this.getSortClasses} />

        <footer>
          <div class="footer-body large">
            <div class="footer-body-content">
              <a href="/about/" title="About">About</a>
              &nbsp;| <a href="mailto:hi@avocadojobs.com" title="Say hi!" target="_blank" rel="noopener noreferrer">Contact</a>
              &nbsp;| <a href="https://twitter.com/AvocadoJobs" title="Or maybe hello?" target="_blank" rel="noopener noreferrer">Tweet</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

render(<Avo />, document.body);

require('preact/devtools');
