var demoData = [{
    id: 1,
    role: 'Frontend Developer',
    company: 'Avocado Jobs',
    stage: 'scheduled',
    salary: '$100k',
    link: 'https://careers.avocadojobs.com/frontend-dev-8basd8',
    date: 'Oct 10',
  },
  {
    id: 2,
    role: 'Backend Engineeer',
    company: 'Acme Corporation',
    stage: 'need',
    salary: '$80k',
    link: 'https://careers.acme.corporation/backend-dev-jd975d',
    date: 'Oct 22',
  },
  {
    id: 3,
    role: 'Security Engineer',
    company: 'E Corp',
    stage: 'initial',
    salary: '$135k',
    link: 'https://careers.e.corp/security-eng-5as7dn',
    date: 'Nov 2',
  },
];

function getData() {
  var data = demoData;
  if (window.localStorage.avocadoLocalData) {
    data = JSON.parse(window.localStorage.avocadoLocalData);
  } else {
    window.localStorage.avocadoLocalData = JSON.stringify(demoData);
  }

  checkEmpty();

  return data;
}

function setNewData(newData) {
  window.localStorage.avocadoLocalData = JSON.stringify(newData);
  checkEmpty();
}

function checkEmpty() {
  var length = JSON.parse(window.localStorage.avocadoLocalData).length;
  if (window.localStorage.avocadoLocalData && length === 0) {
    var listingsElem = document.getElementsByClassName('listings')[0];
    var listingsEmptyElem = document.createElement('div');
    listingsEmptyElem.classList.add('empty');
    listingsElem.appendChild(listingsEmptyElem);
    listingsEmptyElem.appendChild(document.createTextNode('There are no job applications.'));
    listingsEmptyElem.appendChild(document.createElement('br'));
    listingsEmptyElem.appendChild(document.createTextNode('You can add a new one by click clicking the button at the top.'));
  }
}

function resetApplications() {
  window.localStorage.avocadoLocalData = JSON.stringify(demoData);
  window.location.reload();
}

function removeApplication(event) {
  event.preventDefault();
  if (!window.confirm('Are you sure you want to remove this application?')) {
    return;
  }

  var idForDeletion = parseInt(event.target.parentElement.dataset.id);
  var newData = getData();
  newData.forEach(function findRecord(record, index) {
    if (record.id === idForDeletion) {
      newData.splice(index, 1);
      event.target.parentNode.parentNode.parentNode.remove();
      setNewData(newData);
    }
  })
}

function changeStageListen(event) {
  // tutorial
  if (localStorage.avocadoTutorialStep2 !== 'done') {
    document.getElementById('tutorial-text-2').style.display = 'none';
    localStorage.avocadoTutorialStep2 = 'done';
  }

  var applicationId = parseInt(event.target.parentElement.dataset.id);
  var newStage = event.target.value;
  var newData = getData();
  newData.forEach(function findRecord(record, index) {
    if (record.id === applicationId) {
      record.stage = newStage;
      setNewData(newData);
    }
  })
}

function changeSalaryListen(event) {
  var applicationId = parseInt(event.target.dataset.id);
  var newSalary = event.target.innerText;
  var newData = getData();
  newData.forEach(function findRecord(record, index) {
    if (record.id === applicationId) {
      record.salary = newSalary;
      setNewData(newData);
    }
  })
}

// Do not read this code!
function renderData(demoData) {
  demoData.forEach(function renderRecord(applicationRecord) {
    var listingsElem = document.getElementsByClassName('listings')[0];
    var listingsEntryElem = document.createElement('div');
    listingsEntryElem.classList.add('listings-entry');
    listingsElem.appendChild(listingsEntryElem);

    var listingsEntryDetailElem = document.createElement('div');
    listingsEntryDetailElem.classList.add('listings-entry-detail');
    listingsEntryElem.appendChild(listingsEntryDetailElem);

    var listingsEntryDetailInfoElem = document.createElement('div');
    listingsEntryDetailInfoElem.classList.add('listings-entry-detail-info');
    listingsEntryDetailElem.appendChild(listingsEntryDetailInfoElem);

    var listingsEntryDetailInfoTitleElem = document.createElement('a');
    listingsEntryDetailInfoTitleElem.classList.add('listings-entry-detail-info-title');
    listingsEntryDetailInfoTitleElem.href = applicationRecord.link;
    listingsEntryDetailInfoElem.appendChild(listingsEntryDetailInfoTitleElem);

    var listingsEntryDetailInfoTitleStrongElem = document.createElement('strong');
    listingsEntryDetailInfoTitleStrongElem.appendChild(document.createTextNode(applicationRecord.role));
    listingsEntryDetailInfoTitleElem.appendChild(listingsEntryDetailInfoTitleStrongElem);

    var listingsEntryDetailInfoTitleSpanElem = document.createElement('span');
    listingsEntryDetailInfoTitleSpanElem.classList.add('muted');
    listingsEntryDetailInfoTitleSpanElem.appendChild(document.createTextNode(' at '));
    listingsEntryDetailInfoTitleElem.appendChild(listingsEntryDetailInfoTitleSpanElem);

    var listingsEntryDetailInfoTitleCompanyElem = document.createElement('span');
    listingsEntryDetailInfoTitleCompanyElem.classList.add('listings-entry-detail-info-title-company');
    listingsEntryDetailInfoTitleCompanyElem.appendChild(document.createTextNode(applicationRecord.company));
    listingsEntryDetailInfoTitleElem.appendChild(listingsEntryDetailInfoTitleCompanyElem);

    if (applicationRecord.date) {
      var listingsEntryDetailInfoTitleDateElem = document.createElement('span');
      listingsEntryDetailInfoTitleDateElem.classList.add('listings-entry-detail-info-title-date');
      listingsEntryDetailInfoTitleDateElem.title = 'Date applied';
      listingsEntryDetailInfoTitleDateElem.appendChild(document.createTextNode(applicationRecord.date));
      listingsEntryDetailInfoTitleElem.appendChild(listingsEntryDetailInfoTitleDateElem);
    }

    if (applicationRecord.salary) {
      var listingsEntryDetailInfoSalaryElem = document.createElement('div');
      listingsEntryDetailInfoSalaryElem.classList.add('listings-entry-detail-info-salary');
      listingsEntryDetailInfoSalaryElem.dataset.id = applicationRecord.id;
      listingsEntryDetailInfoSalaryElem.appendChild(document.createTextNode(applicationRecord.salary));
      listingsEntryDetailInfoSalaryElem.contentEditable = true;
      listingsEntryDetailInfoSalaryElem.onkeyup = changeSalaryListen;
      listingsEntryDetailInfoSalaryElem.onblur = changeSalaryListen;
      listingsEntryDetailInfoSalaryElem.title = 'Salary';
      listingsEntryDetailInfoElem.appendChild(listingsEntryDetailInfoSalaryElem);
    }

    var listingsEntryDetailInfoStageElem = document.createElement('div');
    listingsEntryDetailInfoStageElem.classList.add('listings-entry-detail-info-stage');
    listingsEntryDetailInfoStageElem.dataset.id = applicationRecord.id;
    listingsEntryDetailInfoStageElem.title = 'Current interview stage';
    listingsEntryDetailInfoElem.appendChild(listingsEntryDetailInfoStageElem);

    var listingsEntryDetailInfoStageSelectElem = document.createElement('select');
    listingsEntryDetailInfoStageSelectElem.classList.add('submission-stage');
    listingsEntryDetailInfoStageSelectElem.name = 'stage';
    listingsEntryDetailInfoStageSelectElem.onchange = changeStageListen;
    listingsEntryDetailInfoStageElem.appendChild(listingsEntryDetailInfoStageSelectElem);

    var selectOptions = [{
        value: 'initial',
        text: 'No initial response yet',
      },
      {
        value: 'need',
        text: 'I need to response',
      },
      {
        value: 'await',
        text: 'Awaiting response',
      },
      {
        value: 'scheduled',
        text: 'Interview schedule',
      },
      {
        value: 'offer',
        text: 'Got offer',
      },
      {
        value: 'declined',
        text: 'Declined',
      },
      {
        value: 'rejected',
        text: 'Got rejected',
      },
    ]

    selectOptions.forEach(function renderSelectOption(optionItem) {
      var listingsEntryDetailInfoStageSelectOptionElem = document.createElement('option');
      listingsEntryDetailInfoStageSelectOptionElem.value = optionItem.value;
      if (applicationRecord.stage === optionItem.value) {
        listingsEntryDetailInfoStageSelectOptionElem.selected = true;
      }
      listingsEntryDetailInfoStageSelectOptionElem.appendChild(document.createTextNode(optionItem.text));
      listingsEntryDetailInfoStageSelectElem.appendChild(listingsEntryDetailInfoStageSelectOptionElem);
    })

    var listingsEntryControlElem = document.createElement('div');
    listingsEntryControlElem.classList.add('listings-entry-control');
    listingsEntryElem.appendChild(listingsEntryControlElem);

    var listingsEntryControlRmElem = document.createElement('div');
    listingsEntryControlRmElem.classList.add('listings-entry-control-rm');
    listingsEntryControlRmElem.title = 'Remove job application';
    listingsEntryControlRmElem.dataset.id = applicationRecord.id;

    var svgXIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgXIcon.onclick = removeApplication;
    svgXIcon.setAttribute('width', '24');
    svgXIcon.setAttribute('height', '24');
    svgXIcon.setAttribute('viewBox', '0 0 24 24');
    svgXIcon.setAttribute('stroke', 'currentColor');
    svgXIcon.setAttribute('stroke-width', '2px');
    svgXIcon.setAttribute('stroke-linecap', 'round');
    var lineOne = document.createElementNS('http://www.w3.org/2000/svg','line');
    lineOne.setAttribute('x1','18');
    lineOne.setAttribute('y1','6');
    lineOne.setAttribute('x2','6');
    lineOne.setAttribute('y2','18');
    var lineTwo = document.createElementNS('http://www.w3.org/2000/svg','line');
    lineTwo.setAttribute('x1','6');
    lineTwo.setAttribute('y1','6');
    lineTwo.setAttribute('x2','18');
    lineTwo.setAttribute('y2','18');
    svgXIcon.append(lineOne);
    svgXIcon.append(lineTwo);

    listingsEntryControlRmElem.appendChild(svgXIcon);
    listingsEntryControlElem.appendChild(listingsEntryControlRmElem);
  });

}

function cleanupListings() {
  var listingsElem = document.getElementsByClassName('listings')[0];
  while (listingsElem.hasChildNodes()) {
    listingsElem.removeChild(listingsElem.lastChild);
  }
}

function getId() {
  var data = getData();
  var limit = 1000;
  var success = true;
  var randomId = Math.floor(Math.random() * 1000);
  while (limit > 0) {
    limit -= 1;
    data.forEach(function (record) {
      if (record.id === randomId) {
        success = false;
      }
    });
    if (success) {
      break;
    } else {
      randomId = Math.floor(Math.random() * 1000);
    }
  }
  if (success) {
    return randomId;
  } else {
    throw new Error('No more.');
  }
}

function addApplication() {
  var newRole = document.getElementById('add-role').value;
  var newCompany = document.getElementById('add-company').value;
  var newSalary = document.getElementById('add-salary').value;
  var newStage = document.getElementById('add-stage').value;
  var newLink = document.getElementById('add-link').value;

  if (!newRole || !newCompany) {
    return;
  }

  var newId = getId();

  var newData = getData();
  newData.push({
    id: newId,
    role: newRole,
    company: newCompany,
    stage: newStage,
    salary: newSalary,
    link: newLink,
  })
  setNewData(newData);

  cleanupListings();
  renderData(getData());
}

function toggleAddForm(event) {
  if (document.location.pathname === '/') {
    if (document.location.hash === '') {
      document.getElementById('header-normal').style.display = 'none';
      document.getElementById('header-add').style.display = 'block';
      history.pushState('add', document.title, window.location.pathname + '#add');

      // tutorial
      if (localStorage.avocadoTutorialStep1 !== 'done') {
        document.getElementById('tutorial-arrow').style.display = 'none';
        document.getElementById('tutorial-text-1').style.display = 'none';
        localStorage.avocadoTutorialStep1 = 'done';
      }
      if (localStorage.avocadoTutorialStep2 !== 'done') {
        document.getElementById('tutorial-text-2').style.display = 'block';
      }

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

function resetTutorial() {
  delete localStorage.avocadoTutorialStep1;
  delete localStorage.avocadoTutorialStep2;
  window.location.reload();
}

function initTutorial() {
  if (localStorage.avocadoTutorialStep1 !== 'done') {
    document.getElementById('tutorial-arrow').style.display = 'block';
    document.getElementById('tutorial-text-1').style.display = 'block';
  }
}

// init hash and history manipulation for add form
listenHash();
window.addEventListener('hashchange', function () {
  listenHash();
})

// init rendering on index
if (document.location.pathname === '/') {
  renderData(getData());
}

// init tutorial
initTutorial();
