import { h, render, Component } from 'preact';
import axios from 'axios';

import ListItem from './ListItem';
import { getCsrf } from './util';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      filters: [],
    };

    this.onDelete = this.onDelete.bind(this);
    this.activateFilter = this.activateFilter.bind(this);
  }

  componentDidMount() {
    document.getElementById('loading').style.display = 'block';
    axios.get('/applications/')
      .then((res) => {
        window.onbeforeunload = null;
        document.getElementById('loading').style.display = 'none';
        this.setState({
          applications: res.data,
        })
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
          const newApplications = prevState.applications.slice()
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
    const newFilters = this.state.filters.slice();

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
      }
    });
  }

  render() {
    return (
      <div class="list">
        <div class="list-title">
          Hi, this is Eva, the local AI here on Avocado. Feel free to ask me anything.
        </div>
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
        <div class="list-body">
          {this.state.applications.map((item) => (
            <ListItem key={item.id} data={item} onDelete={this.onDelete}
              visible={this.state.filters.length !== 0 && this.state.filters.indexOf(item.stage) === -1 ? true : false} />
          ))}
        </div>
      </div>
    );
  }
}
