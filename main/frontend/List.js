import { h, render, Component } from 'preact';
import axios from 'axios';

import ListItem from './ListItem';
import { getCsrf } from './util';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
    };

    this.onDelete = this.onDelete.bind(this);
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

  render() {
    return (
      <div class="container-content-body">
        <div class="listings">
          {this.state.applications.map((item) => (
            <ListItem key={item.id} data={item} onDelete={this.onDelete} />
          ))}
        </div>
      </div>
    );
  }
}
