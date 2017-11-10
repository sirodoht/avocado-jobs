var demoData = [{
    id: 1,
    role: 'Frontend Developer',
    company: 'Avocado Jobs',
    stage: 'scheduled',
  },
  {
    id: 2,
    role: 'Backend Engineeer',
    company: 'Acme Corporation',
    stage: 'need',
  },
  {
    id: 3,
    role: 'Security Engineer',
    company: 'E Corp',
    stage: 'initial',
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

  var idForDeletion = parseInt(event.target.dataset.id);
  var newData = getData();
  newData.forEach(function findRecord(record, index) {
    if (record.id === idForDeletion) {
      newData.splice(index, 1);
      event.target.parentNode.parentNode.remove();
      setNewData(newData);
    }
  })
}

function changeStageListen(event) {
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

// I don't like this code, I need to use a lib, which means THOUSANDS of LOC boilerplate :(
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
    listingsEntryDetailInfoTitleElem.href = '#';
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

    var listingsEntryDetailInfoStageElem = document.createElement('div');
    listingsEntryDetailInfoStageElem.classList.add('listings-entry-detail-info-stage');
    listingsEntryDetailInfoStageElem.dataset.id = applicationRecord.id;
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
    listingsEntryControlRmElem.title = 'Remove listing from applications';
    listingsEntryControlRmElem.dataset.id = applicationRecord.id;
    listingsEntryControlRmElem.onclick = removeApplication;
    listingsEntryControlRmElem.appendChild(document.createTextNode('x'));
    listingsEntryControlElem.appendChild(listingsEntryControlRmElem);
  });

}

renderData(getData());


function cleanupListings() {
  var listingsElem = document.getElementsByClassName('listings')[0];
  while (listingsElem.hasChildNodes()) {
    listingsElem.removeChild(listingsElem.lastChild);
  }
}

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
  var newId = getId();

  var newData = getData();
  newData.push({
    id: newId,
    role: newRole,
    company: newCompany,
    stage: newStage,
    salary: newSalary,
  })
  setNewData(newData);

  cleanupListings();
  renderData(getData());
}
