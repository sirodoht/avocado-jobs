// get csrf from the html
function getCsrf() {
  var inputElems = document.querySelectorAll('input');
  var csrfToken = '';
  for (i = 0; i < inputElems.length; ++i) {
    if (inputElems[i].name === 'csrfmiddlewaretoken') {
      csrfToken = inputElems[i].value;
      break;
    }
  }
  return csrfToken;
};

// confirm exit when sending data
function confirmExit() {
  return 'Some changes you have made have not been saved. Are you sure you want to leave?';
}

function showLoading() {
  window.onbeforeunload = confirmExit;
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  function hideLoadingNow() {
    window.onbeforeunload = null;
    document.getElementById('loading').style.display = 'none';
  }

  setTimeout(hideLoadingNow, 700);
}

// remove application from user's
function removeApplication(event) {
  event.preventDefault();
  if (!window.confirm('Are you sure you want to remove this application?')) {
    return;
  }

  var inputElems = document.querySelectorAll('input');
  var csrfToken = getCsrf();

  var idForDeletion = event.target.parentElement.dataset.id;
  superagent.del('/applications/' + idForDeletion + '/')
    .set('X-CSRFToken', csrfToken)
    .end(function (err, res) {
      if (err) {
        console.log('Error at deletion:', err);
      } else {
        document.location.reload();
      }
    });
}

function changeStageListen(event) {
  var csrfToken = getCsrf();
  var applicationId = event.target.parentElement.dataset.id;
  var newStage = event.target.value;

  showLoading();

  superagent.patch('/applications/')
    .send({
      'id': applicationId,
      'stage': newStage,
    })
    .set('X-CSRFToken', csrfToken)
    .end(function superagentEndCallback(err, res) {
      hideLoading();
      if (err) {
        console.log('Failed to update application stage. Error:', err);
        throw err;
      }
    });
}

function changeSalaryListen(event) {
  var csrfToken = getCsrf();
  var applicationId = event.target.dataset.id;
  var newSalary = event.target.innerText;

  showLoading();

  superagent.patch('/applications/')
    .send({
      'id': applicationId,
      'salary': newSalary,
    })
    .set('X-CSRFToken', csrfToken)
    .end(function superagentEndCallback(err, res) {
      hideLoading();
      if (err) {
        console.log('Failed to update application salary. Error:', err);
        throw err;
      }
    });
}

function changeNotesListen(event) {
  var csrfToken = getCsrf();
  var applicationId = event.target.dataset.id;
  var newNotes = event.target.innerText;

  showLoading();

  superagent.patch('/applications/')
    .send({
      'id': applicationId,
      'notes': newNotes,
    })
    .set('X-CSRFToken', csrfToken)
    .end(function superagentEndCallback(err, res) {
      hideLoading();
      if (err) {
        console.log('Failed to update application notes. Error:', err);
        throw err;
      }
    });
}

function initApplicationStage() {
  // add event listeners to select elems
  var stageSelectElems = document.getElementsByClassName('submission-stage');
  var i = 0;
  for (i = 0; i < stageSelectElems.length; i++) {
    stageSelectElems[i].addEventListener('change', changeStageListen);
  }

  // add event listeners to salary contenteditable
  var salaryDivElems = document.getElementsByClassName('listings-entry-detail-info-salary');
  var i = 0;
  for (i = 0; i < salaryDivElems.length; i++) {
    salaryDivElems[i].addEventListener('keyup', changeSalaryListen);
    salaryDivElems[i].addEventListener('onblur', changeSalaryListen);
  }

  // add event listeners for delete
  var listingsEntryControlRmElems = document.getElementsByClassName('listings-entry-control-rm');
  var i = 0;
  for (i = 0; i < listingsEntryControlRmElems.length; i++) {
    listingsEntryControlRmElems[i].childNodes[1].onclick = removeApplication;
  }

  // add event listeners for notes
  var listingsEntryDetailNotesElems = document.getElementsByClassName('listings-entry-detail-info-notes');
  var i = 0;
  for (i = 0; i < listingsEntryDetailNotesElems.length; i++) {
    listingsEntryDetailNotesElems[i].addEventListener('keyup', changeNotesListen);
    listingsEntryDetailNotesElems[i].addEventListener('onblur', changeNotesListen);
  }
}

function addApplication() {
  var newRole = document.getElementById('add-role');
  var newCompany = document.getElementById('add-company');
  var newSalary = document.getElementById('add-salary');
  var newStage = document.getElementById('add-stage');
  var newDate = document.getElementById('add-date');
  var newLink = document.getElementById('add-link');

  if (!newRole.value || !newCompany.value) {
    return;
  }

  var csrfToken = getCsrf();
  superagent.post('/applications/')
    .send({
      role: newRole.value,
      company: newCompany.value,
      salary: newSalary.value,
      stage: newStage.value,
      date: newDate.value,
      link: newLink.value,
    })
    .set('X-CSRFToken', csrfToken)
    .end(function superagentEndCallback(err, res) {
      if (err) {
        console.log('Failed to create new application. Error:', err);
        throw err;
      }

      newRole.value = '';
      newCompany.value = '';
      newSalary.value = '';
      newStage.value = '';
      newLink.value = '';

      window.location.reload();
    });
}

function toggleAddForm(event) {
  if (document.location.pathname === '/') {
    if (document.location.hash === '') {
      document.getElementById('header-normal').style.display = 'none';
      document.getElementById('header-add').style.display = 'block';
      history.pushState('add', document.title, window.location.pathname + '#add');
    } else if (document.location.hash === '#add') {
      document.getElementById('header-normal').style.display = 'block';
      document.getElementById('header-add').style.display = 'none';
      history.pushState('index', document.title, window.location.pathname);
    }
  } else {
    document.location.replace('/#add');
  }
}

function listenHash() {
  if (document.location.pathname === '/') {
    if (document.location.hash === '') {
      document.getElementById('header-normal').style.display = 'block';
      document.getElementById('header-add').style.display = 'none';
    } else if (document.location.hash === '#add') {
      document.getElementById('header-normal').style.display = 'none';
      document.getElementById('header-add').style.display = 'block';
    }
  }
}

// init main app
initApplicationStage()

// init hash and history manipulation for add form
listenHash();
window.addEventListener('hashchange', function () {
  listenHash();
})
