'use strict'

//todo - change the contorller to render the modal only on click!!!!! 0 checkt Yotam's code


$(document).ready(initPage);

function initPage() {
  createProjcets();
  renderProjects();
}

function renderProjects() {
  var projects = getProjectsForRender()
  var strProjectsHtmls = projects.map(getProjectHTML)
  $('.projects-content').html(strProjectsHtmls.join(''))
}


function renderLabels(projects) {
  projects.forEach(project => {
    const labels = project.labels
    const id = project.id
    var strLabelsHtmls = labels.map(getLebelsHTML)
    $('.badges-content-').html('Tags: ' + strLabelsHtmls.join(''))
  })
}

function renderModal(itemID) {
  const item = getItemByID(itemID)
  const imgURL = 'img/portfolio/' + item.id + '.jpg'
  const strLabelsHtmls = item.labels.map(getLebelsHTML)
  const tagsStr = 'Tags: ' + strLabelsHtmls.join('')

  var strHTML = `
          <h2>${item.name}</h2>
                <p class="item-intro text-muted">${item.desc}</p>
                <img class="img-size img-fluid d-block mx-auto" src="${imgURL}" alt="${item.name}" title="${item.name}">
                <p>${item.longDesc}</p>
                <ul class="list-inline">
                  <li>Created on ${item.publishedAt}</li>
                  <li>${tagsStr}</li> 
                </ul>
                <div class="modal-footer">
                <a href="${item.url}" target="_blank" class="btn btn-primary stretched-link">Check it Out</a>
                <button class="btn btn-link" data-dismiss="modal" type="button">
                    <i class="fa fa-times"></i>
                    Close Project</button>`
 
  $('.modal-body').html(strHTML)
}

function getLebelsHTML(label) {
  return `<span class="badge-size badge badge-primary">${label}</span>`
}

function getProjectHTML(project) {
  const imgURL = 'img/portfolio/' + project.id + '.jpg'
  const projId = project.id
  const projName = project.title
  const projDesc = project.desc
  const url = project.url
  return `<div class="col-md-4 col-sm-6 portfolio-item flex-column">
    <a class="portfolio-link" data-toggle="modal" onclick="renderModal('${projId}')" href="#projModal">
      <div class="portfolio-hover">
        <div class="portfolio-hover-content">
          <i class="fa fa-plus fa-3x"></i>
        </div>
      </div>
      <img class="img-size img-fluid" src="${imgURL}" alt="">
    </a>
    <div class="portfolio-caption-size portfolio-caption flex-column space-between flex-grow">
      <h4>${projName}</h4>
      <p class="text-muted">${projDesc}</p>
      <a href="${url}" target="_blank" class="btn btn-primary stretched-link">Check it Out</a>
    </div>
  </div> 
    `
}

function onSubmitContact() {
  const formInput = $(".form-control")
  const subject = formInput[0].value
  const msgBody = formInput[1].value
  const emailLink = 'https://mail.google.com/mail/?view=cm&fs=1&to=ordel23@gmail.com&su=' + subject + '&body=' + msgBody
  window.open(emailLink, "_blank");
}


function getItemByID(itemId) {
  const items = getProjectsForRender()
  var item = items.find(item => {
    return itemId === item.id;
  })
  return item;
}