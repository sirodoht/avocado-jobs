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
    axios.get('/applications/')
      .then((res) => {
        this.setState({
          applications: res.data,
        })
      })
      .catch((error) => {
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
