'use strict'


$(document).ready(initPage);

function initPage() {
    createProjcets();
    renderProjects();
}

function renderProjects() {
    var projects = getProjectsForRender()
    var strProjectsHtmls = projects.map(getProjectHTML)
    $('.projects-content').html(strProjectsHtmls.join(''))
    var strProjModalsHtmls = projects.map(getProjModalHTML)
    $('.modals-content').html(strProjModalsHtmls.join(''))
    renderLabels(projects) //render label inside the modal as basges
}


function renderLabels(projects) {
    projects.forEach(project => {
        const labels = project.labels
        const id = project.id
        var strLabelsHtmls = labels.map(getLebelsHTML)
        $('.label-' + id).html('Tags: '+strLabelsHtmls.join(''))

    })
}

function getLebelsHTML(label) {
    return `<span class="badge-size badge badge-primary">${label}</span>` //todo margin between spans isn't working
}

function getProjectHTML(project) {
    const imgURL = 'img/portfolio/' + project.id + '.jpg'
    const projName = project.title
    const projDesc = project.desc
    const modalLink = '#portfolioModal-' + project.id
    const url = project.url

    return `<div class="col-md-4 col-sm-6 portfolio-item">
    <a class="portfolio-link" data-toggle="modal" href="${modalLink}">
      <div class="portfolio-hover">
        <div class="portfolio-hover-content">
          <i class="fa fa-plus fa-3x"></i>
        </div>
      </div>
      <img class="img-size img-fluid" src="${imgURL}" alt="">
    </a>
    <div class="portfolio-caption-size portfolio-caption">
      <h4>${projName}</h4>
      <p class="text-muted">${projDesc}</p>
      <a href="${url}" target="_blank" class="btn btn-primary stretched-link">Check it Out</a>
    </div>
  </div> 
    `
}


function getProjModalHTML(project) {
    const projId = project.id
    const imgURL = 'img/portfolio/' + project.id + '.jpg'
    const projName = project.title
    const projDesc = project.desc
    const modalId = 'portfolioModal-' + project.id
    const date = project.publishedAt
    const url = project.url
    const longDesc = project.longDesc
    

    return `<div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content modal-lg">
        <div class="close-modal" data-dismiss="modal">
          <div class="lr">
            <div class="rl"></div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-lg-11 mx-auto">
              <div class="modal-body">
                <!-- Project Details Go Here -->
                <h2>${projName}</h2>
                <p class="item-intro text-muted">${projDesc}</p>
                <img class="img-size img-fluid d-block mx-auto" src="${imgURL}" alt="${projName}" title="${projName}">
                <p>${longDesc}</p>
                <ul class="list-inline">
                  <li>Created on ${date}</li>
                  <li class="label-${projId}"></li> 
                </ul>
                <div class="modal-footer">
                <a href="${url}" target="_blank" class="btn btn-primary stretched-link">Check it Out</a>
                <button class="btn btn-link" data-dismiss="modal" type="button">
                    <i class="fa fa-times"></i>
                    Close Project</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`

}

function onSubmitContact() {
  const formInput =  $(".form-control")
  const subject = formInput[0].value
  const msgBody = formInput[1].value
  const emailLink = 'https://mail.google.com/mail/?view=cm&fs=1&to=ordel23@gmail.com&su='+subject+'&body='+msgBody
  window.open(emailLink, "_blank");
}

