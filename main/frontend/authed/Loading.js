import { h, Component } from 'preact';

export default class New extends Component {
  render() {
    return (
      <div class="container-content-spinner">
        <div class="spinner" id="loading" title="Saving..."></div>
      </div>
    );
  }
}
