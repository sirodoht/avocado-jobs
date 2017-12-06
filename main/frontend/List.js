import { h, render, Component } from 'preact';
import axios from 'axios';

import ListItem from './ListItem';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
    };
  }

  componentDidMount() {
    document.getElementById('loading').style.display = 'block';
    axios.get('/applications/')
      .then((res) => {
        document.getElementById('loading').style.display = 'none';
        this.setState({
          applications: res.data,
        })
      })
      .catch((error) => {
        document.getElementById('loading').style.display = 'none';
        console.log('Failed to fetch user applications. Error:', err);
        throw err;
      });
  }

  render() {
    return (
      <div class="container-content-body">
        <div class="listings">
          {this.state.applications.map((item) => (
            <ListItem key={item.id} data={item} />
          ))}
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
