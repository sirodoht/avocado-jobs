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

// remove application from user's
function removeApplication(event) {
  event.preventDefault();

  if (!window.confirm('Are you sure you want to remove listing application?')) {
    return;
  }

  var inputElems = document.querySelectorAll('input');
  var csrfToken = getCsrf();

  var idForDeletion = event.target.dataset.id;
  superagent.post('/applications/' + idForDeletion + '/delete/')
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
  var listingId = event.target.parentElement.dataset.id;
  var newStage = event.target.value;
  superagent.patch('/applications/')
    .send({
      'listing_id': listingId,
      'stage': newStage,
    })
    .set('X-CSRFToken', csrfToken)
    .end(function superagentEndCallback(err, res) {
      if (err) {
        console.log('Failed to update application stage. Error:', err);
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
}

initApplicationStage()

function showAddApplication() {
  var headerNormalDisplay = document.getElementById('header-normal').style.display;
  if (headerNormalDisplay !== 'none') {
    document.getElementById('header-normal').style.display = 'none';
    document.getElementById('header-add').style.display = 'block';
  } else {
    document.getElementById('header-normal').style.display = 'block';
    document.getElementById('header-add').style.display = 'none';
  }
}

function addApplication() {
  var newRole = document.getElementById('add-role');
  var newCompany = document.getElementById('add-company');
  var newSalary = document.getElementById('add-salary');
  var newStage = document.getElementById('add-stage');
  var newLink = document.getElementById('add-link');

  var csrfToken = getCsrf();
  superagent.post('/applications/')
    .send({
      role: newRole.value,
      company: newCompany.value,
      salary: newSalary.value,
      stage: newStage.value,
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
    });

}
