import { h, render, Component } from 'preact';

import New from './New';
import List from './List';
import demoData from './demo-data';

class Avo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFormSection: false,
      helpVisible: false,
      applications: demoData,
      filters: [],
      sortOptions: this.getSortOptions(),
      newRole: '',
      newCompany: '',
      newStage: 'initial',
      newDate: '',
      newLink: '',
      arrow1Visible: false,
      arrow2Visible: false,
    };

    this.handleNewChange = this.handleNewChange.bind(this);
    this.handleNewSubmit = this.handleNewSubmit.bind(this);

    this.activateFilter = this.activateFilter.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.getSortClasses = this.getSortClasses.bind(this);
    this.toggleAddForm = this.toggleAddForm.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.hideArrow2 = this.hideArrow2.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    if (!localStorage.avocadoTutorialStep1) {
      this.setState(() => {
        return {
          arrow1Visible: true,
        };
      });
    } else if (!localStorage.avocadoTutorialStep2) {
      this.setState(() => {
        return {
          arrow2Visible: true,
        };
      });
    }

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
    localStorage.avocadoTutorialStep1 = 'done';
    this.setState({
      arrow1Visible: false,
    });
    if (localStorage.avocadoTutorialStep2 !== 'done') {
      this.setState(() => {
        return {
          arrow2Visible: true,
        };
      });
    }

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

  toggleHelp() {
    this.setState((prevState) => {
      return {
        helpVisible: !prevState.helpVisible,
      };
    });
  }

  hideArrow2() {
    console.log('this run once');
    localStorage.avocadoTutorialStep2 = 'done';
    this.setState({
      arrow2Visible: false,
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
            <a href="/login/">Log in / Sign up</a>
          </div>
        </div>
        {this.state.arrow1Visible &&
          <div class="arrow-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" height="100">
              <path fill="none" d="M41.061 54.463c-2.005 2.793-2.185 5.972-1.786 9.193.376 3.031 2.03 4.096 4.938 3.307 1.071-.291 2.122-.796 3.062-1.392a13.39 13.39 0 0 0 2.582-2.176c3.839-4.125 2.859-9.66-2.161-12.243-.985-.507-2.059-.837-3.373-1.36-1.224 1.756-2.226 3.226-3.262 4.671z"/>
              <path fill="#fc5a5c" d="M93.961 31.623c-.371-.287-.828-.461-1.203-.744-2.593-1.962-5.857-2.596-8.56-4.359-1.657-1.082-3.431-1.985-5.154-2.966-.742-.422-1.496-.911-2.387-.699-.41.097-.946.385-1.082.724-.132.329.118.863.312 1.25.111.222.435.347.677.492 1.946 1.163 3.899 2.311 5.834 3.492.241.147.381.459.733.904-7.619.242-14.391 2.649-21.137 5.132-6.871 2.529-12.186 7.46-17.792 11.741-.324-.02-.518-.007-.699-.048-5.386-1.215-10.755-.857-16.003.587-8.175 2.247-13.618 7.905-17.614 15.062-1.513 2.711-2.571 5.677-3.793 8.546-.748 1.756-1.145 3.602-1.088 5.524.008.271.12.543.206.808.02.06.137.133.199.125.169-.021.411-.031.481-.139.147-.225.276-.507.284-.769.084-2.919 1.185-5.516 2.473-8.065 2.586-5.12 5.887-9.657 10.314-13.385 2.658-2.239 5.556-3.953 8.88-4.852 4.14-1.12 8.375-1.465 12.653-.985.408.045.789.314 1.333.542-.784 1.195-1.461 2.211-2.123 3.236-1.182 1.832-2.257 3.72-2.899 5.82-.738 2.418-.797 4.848.018 7.254 1.06 3.127 2.9 4.387 6.195 4.272 3.874-.136 6.736-2.212 9.258-4.91 2.374-2.54 2.958-5.609 2.659-8.952-.176-1.959-.936-3.641-2.248-5.09-1.029-1.136-2.27-1.976-3.61-2.71-.631-.346-1.47-.413-1.925-1.329.37-.355.723-.775 1.153-1.093 2.051-1.519 4.103-3.04 6.192-4.506 2.958-2.075 6.136-3.732 9.603-4.792 3.612-1.104 7.196-2.321 10.852-3.257 4.418-1.131 8.96-1.349 13.512-1.282.999.015 1.838.309 2.439 1.372-2.398 1.141-4.783 2.232-7.128 3.405a271.029 271.029 0 0 0-7.787 4.057c-1.073.58-2.024 1.351-2.804 2.75 1.936.085 1.915.045 3.419-.774 1.488-.811 2.961-1.731 4.555-2.254 3.78-1.241 7.376-2.917 11.054-4.395.609-.245 1.238-.51 1.754-.903 1.388-1.051 1.368-2.773-.006-3.837zm-46.265 19.53c5.02 2.583 6 8.117 2.161 12.243a13.425 13.425 0 0 1-2.582 2.176c-.94.596-1.99 1.102-3.062 1.392-2.908.788-4.562-.276-4.938-3.307-.399-3.221-.219-6.399 1.786-9.193 1.037-1.445 2.038-2.916 3.262-4.671 1.313.523 2.388.853 3.373 1.36zM34.676 31.926c-.011-.057-.005-.133-.039-.167-.04-.041-.116-.045-.177-.065.013.058.007.134.042.171.039.039.114.042.174.061z"/>
            </svg>
            <div class="arrow-1-text">
              // START HERE //<br />
              Add a new job application
            </div>
          </div>
        }

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

        <List state={this.state} onDelete={this.onDelete} arrow2Visible={this.state.arrow2Visible} hideArrow2={this.hideArrow2}
          activateFilter={this.activateFilter} sortBy={this.sortBy} getSortClasses={this.getSortClasses} />

        <footer>
          <div class="footer-body large">
            <div class="footer-body-content">
              {this.state.helpVisible &&
                <div class="footer-body-content-help" id="help">
                  <div class="footer-body-content-help-content">
                    <p>Although the 6 nterview stages are fairly self-explanatory here is some more info:</p>
                    <strong>&bull; To Do</strong>
                    <p>Listings that you plan to apply to.</p>
                    <strong>&bull; No initial response yet</strong>
                    <p>I sent my application and await response.</p>
                    <strong>&bull; I need to respond</strong>
                    <p>The company has responded and I need to response back. This option includes responding with a take-home project.</p>
                    <strong>&bull; Awaiting response</strong>
                    <p>Currently waiting for company response in order to continue with the next steps.</p>
                    <strong>&bull; Interview scheduled</strong>
                    <p>The next phase is a scheduled interview.</p>
                    <strong>&bull; Got offer</strong>
                    <p>I have received an offer from the company.</p>
                    <strong>&bull; Declined</strong>
                    <p>I have declined the company's offer.</p>
                    <strong>&bull; Got rejected</strong>
                    <p>I have been rejected by the company.</p>
                  </div>
                </div>
              }
              <a href="#help" title="Help" onClick={this.toggleHelp}>Help</a>
              &nbsp;| <a href="/about/" title="About">About</a>
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
