import { h, render, Component } from 'preact';

import New from './New';
import List from './List';
import Loading from './Loading';


class Avo extends Component {
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
            <button onclick="toggleAddForm(event)" class="nav-links-btn" id="tutorial-trigger">Add application</button>
            <a href="{% url 'main:login' %}" title="Log in to keep your data in the cloud and access them from everywhere">Log in / Sign up</a>
            <a href="{% url 'main:logout' %}">Log out</a>
          </div>
        </div>

        {/* <div class="container-content-header">
          <div class="container-content-header-content">
            <h1>Keep track of your job applications</h1>
          </div>
        </div> */}

        <New />

        <List />

        <Loading />

        <footer>
          <div class="footer-content">
            <div class="footer-content-para">
              Avocado Jobs.&nbsp;
              <a href="mailto:hi@avocadojobs.com" title="Say hi!" target="_blank">Email</a>&nbsp;
              or <a href="https://twitter.com/AvocadoJobs" title="Or maybe hello?" target="_blank">tweet</a> at us.
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

render(<Avo />, document.body);
