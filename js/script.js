---
---
/***This is https://jekyllrb.com/docs/front-matter/ Write javascript under this line***/

// Init parallax elements
var parallaxElements;
var footerElement;

// Init translations object
var t = {{ site.t.js | jsonify }};
var pageLang = "fi";

/* Check if DOM is ready */
if (document.readyState !== 'loading') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init, false);
}

function init() {
  //console.log("DOM ready");

  //Set parallax elements
  parallaxElements = [].slice.call(document.body.querySelectorAll('.parallax'));
  footerElement = document.body.querySelector('footer');

  // Add parallax effect to elements with ".parallax" and to footer
  parallax();

  // Add menu event listeners
  addEventListeners();

  // Add .header--scrolled if landed in the middle of page
  headerScrolled();

  // Get page language for translations
  getPageLanguage();

  // If Service status section exists, get service status
  document.getElementById("service-status-section") ? getServiceStatus("https://status.digitraffic.fi") : '';

  if (typeof loadDatex2 === "function") {
    loadDatex2();
  } else if (typeof loadTWC === "function") {
    loadTWC();
  } else if (typeof loadApiChanges === "function") {
    loadApiChanges(pageLang);
  }

}


/* On scroll actions */
window.onscroll = () => {

  // Add parallax effect
  parallax();

  // Add .header--scrolled when scrolling page, remove when scrolled to top
  headerScrolled();
}

/* Add event listeners for menu, search and language */
function addEventListeners() {
  let menuElement = document.body.querySelector(".header-menu__item--menu");
  let searchElement = document.body.querySelector(".header-menu__item--search");
  let languageElement = document.body.querySelector(".header-menu__item--language");
  let outsideMenu = document.body.querySelector(".content");

  if (menuElement) {
      menuElement.addEventListener("click", toggleMenu);
  }
    if (searchElement) {
  searchElement.addEventListener("click", toggleSearch);
    }
    if (languageElement) {
languageElement.addEventListener("click", toggleLanguage);
    }
    if (outsideMenu) {
        outsideMenu.addEventListener("click", closeMenuSearchLanguage);
    }
}

// Add .header--scrolled when scrolling page, remove when scrolled to top
function headerScrolled() {
  var headerClasses = document.body.querySelector(".header").classList;
  if (window.scrollY < 40) {
    if (headerClasses.contains("header--scrolled")) {
      headerClasses.remove("header--scrolled");
    }
  } else {
    if (!headerClasses.contains("header--scrolled")) {
      headerClasses.add("header--scrolled");
    }
  }
}

// Toggle menu function
function toggleMenu() {
  const headerClasses = document.body.querySelector(".header").classList;

  // Toggle menu
  if (headerClasses.contains("header--menu-opened")) {
    closeMenu();
  } else {
    // If search or language is opened, close it
    if (headerClasses.contains("header--search-opened")) {
      closeSearchQuick();
    }
    if (headerClasses.contains("header--language-opened")) {
      closeLanguageQuick();
    }
    openMenu();
  }
}

// Toggle search function
function toggleSearch() {
  const headerClasses = document.body.querySelector(".header").classList;

  // Toggle search
  if (headerClasses.contains("header--search-opened")) {
    closeSearch();
  } else {
    // If menu or language is opened, close it
    if (headerClasses.contains("header--menu-opened")) {
      closeMenuQuick();
    }
    if (headerClasses.contains("header--language-opened")) {
      closeLanguageQuick();
    }
    openSearch();
  }
}

// Toggle language menu function
function toggleLanguage() {
  const headerClasses = document.body.querySelector(".header").classList;

  // Toggle search
  if (headerClasses.contains("header--language-opened")) {
    closeLanguage();
  } else {
    // If menu or search is opened, close it
    if (headerClasses.contains("header--menu-opened")) {
      closeMenuQuick();
    }
    if (headerClasses.contains("header--search-opened")) {
      closeSearchQuick();
    }
    openLanguage();
  }
}

// Close menu, search and language
function closeMenuSearchLanguage() {
  const headerClasses = document.body.querySelector(".header").classList;

  if (headerClasses.contains("header--menu-opened")) {
    closeMenu();
  }

  if (headerClasses.contains("header--search-opened")) {
    closeSearch();
  }

  if (headerClasses.contains("header--language-opened")) {
    closeLanguage();
  }
}

// Open menu
function openMenu() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--menu-opening");
  // bodyClasses.add("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.add("header--menu-opened");
    headerClasses.remove("header--menu-opening");
    },
    1
  );
}

// Close menu
function closeMenu() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--menu-closing");
  headerContentWrapperClasses.add("header__content-wrapper--menu-closing");
  headerClasses.remove("header--menu-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.remove("header--menu-closing");
    },
    150
  );
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--menu-closing");
    },
    300
  );
}

// Quickly close menu
function closeMenuQuick() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerContentWrapperClasses.add("header__content-wrapper--menu-switching");
  headerClasses.remove("header--menu-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--menu-switching");
    },
    150
  );
}

// Open search
function openSearch() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--search-opening");
  // bodyClasses.add("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.add("header--search-opened");
    headerClasses.remove("header--search-opening");
    },
    1
  );
  document.body.querySelector("input.search-opened__input-field").focus();
}

// Close search
function closeSearch() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--search-closing");
  headerContentWrapperClasses.add("header__content-wrapper--search-closing");
  headerClasses.remove("header--search-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.remove("header--search-closing");
    },
    150
  );
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--search-closing");
    },
    300
  );
}

// Quickly close search
function closeSearchQuick() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerContentWrapperClasses.add("header__content-wrapper--menu-switching");
  headerClasses.remove("header--search-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--menu-switching");
    },
    150
  );
}

// Open language
function openLanguage() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--language-opening");
  // bodyClasses.add("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.add("header--language-opened");
    headerClasses.remove("header--language-opening");
    },
    1
  );
}

// Close language
function closeLanguage() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerClasses.add("header--language-closing");
  headerContentWrapperClasses.add("header__content-wrapper--language-closing");
  headerClasses.remove("header--language-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerClasses.remove("header--language-closing");
    },
    150
  );
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--language-closing");
    },
    300
  );
}

// Quickly close language
function closeLanguageQuick() {
  const headerClasses = document.body.querySelector(".header").classList;
  const headerContentWrapperClasses = document.body.querySelector(".header__content-wrapper").classList;
  const bodyClasses = document.body.classList;

  headerContentWrapperClasses.add("header__content-wrapper--menu-switching");
  headerClasses.remove("header--language-opened");
  // bodyClasses.remove("u--disable-scroll-mobile");
  setTimeout( () => {
    headerContentWrapperClasses.remove("header__content-wrapper--menu-switching");
    },
    150
  );
}

/* Parallax function for elements with css class ".parallax" */
function parallax() {
  parallaxElements.forEach(element => {
    if (elementInViewport(element)) {
      let elementCenter = (element.getBoundingClientRect().bottom - element.getBoundingClientRect().top) / 2 + element.getBoundingClientRect().top;
      let windowCenter = window.innerHeight / 2;
      let diffFromCenter = elementCenter - windowCenter;
      let translateY = diffFromCenter / 15;
      element.style.transform = "translate3d(0, " + translateY + "px, 1px)";
    }
  });
}

/* Check if a part of element is in viewport */
function elementInViewport(el) {
  var top = el.offsetTop;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    (top + height) > window.pageYOffset
  );
}

const componentGroups = ['road', 'marine', 'rail'];
const serviceChildComponentHealthThreshold = 50;
const statusOperational = 'operational';
const statusPartialOutage = 'partial_outage';
const statusMajorOutage = 'major_outage';

function serviceIsHealthy(serviceStatus) {
  return serviceStatus.toLowerCase() === statusOperational;
}

function getChildComponentHealthPercentage(service, allComponents) {
  const childComponents = allComponents.filter(c => service.components.includes(c.id));
  const healthyComponents = childComponents.filter(c => serviceIsHealthy(c.status));
  return Math.ceil(healthyComponents.length / childComponents.length * 100);
}

function updateServiceStatus() {
  // Add updated service status info to each service
  const components = JSON.parse(this.responseText).components;
  components.filter(c => componentGroups.includes(c.name.toLowerCase())).forEach(service => {
    if (serviceIsHealthy(service.status)) {
      addOperationStatus(service.name.toLowerCase(), statusOperational);
    } else {
      const childComponentHealthPercentage = getChildComponentHealthPercentage(service, components);
      if (childComponentHealthPercentage > serviceChildComponentHealthThreshold) {
        addOperationStatus(service.name.toLowerCase(), statusPartialOutage);
      } else {
        addOperationStatus(service.name.toLowerCase(), statusMajorOutage);
      }
    }
  });
}

function updateServiceStatusList() {

  var statusList = document.getElementById('service-status-incident-list'); //ul

  // Get a reference to the template li and remove it from dom
  var templateItem = statusList.firstElementChild;

  while (statusList.firstChild) {
    statusList.removeChild(statusList.firstChild);
  }

  // Add list of service status incidents to incident list
  JSON.parse(this.responseText).incidents.forEach(function (incident) {
    const newestUpdate = incident.incident_updates[0];
    addIncidentToList(newestUpdate.created_at, incident.name, newestUpdate.body, statusList, templateItem);
  });
}

// Get page language
function getPageLanguage() {
  let lang = document.getElementsByTagName("html")[0].getAttribute('lang');
  if (lang) {
    pageLang = lang;
  }
}

function getServiceStatus(baseUrl) {

  // Get service status data from api
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", updateServiceStatus);
  oReq.open("GET", baseUrl + "/api/v2/components.json");
  oReq.send();

  // Get service incidents from api
  if (document.getElementById("service-status-incident-list")) {
    var oReq2 = new XMLHttpRequest();
    oReq2.addEventListener("load", updateServiceStatusList);
    oReq2.open("GET", baseUrl + "/api/v2/incidents.json");
    oReq2.send();
  }

  // Update service status every 60 seconds
  setTimeout(getServiceStatus, 60000, baseUrl);
}

function addOperationStatus(service, status) {
  //console.log(service, ":", status);

  // Elements
  const classes = document.getElementById(`service-status-circle-${service}`).classList;
  let statusText = document.getElementById(`service-status-text-${service}`);

  // Clean previous status
  classes.remove(
    `service-status__icon-circle-bottom--operational__${service}`,
    "service-status__icon-circle-bottom--partial-outage",
    "service-status__icon-circle-bottom--major-outage"
  );

  // Update status
  if (status === "operational") {
    classes.add(`service-status__icon-circle-bottom--operational__${service}`);
    statusText.textContent = t.statusOperational[pageLang];
    statusText.classList.remove("service-status__service-text--loading");
  } else if (status === "partial_outage") {
    classes.add("service-status__icon-circle-bottom--partial-outage");
    statusText.textContent = t.statusPartialOutage[pageLang];
    statusText.classList.remove("service-status__service-text--loading");
  }
  else if (status === "major_outage") {
    classes.add("service-status__icon-circle-bottom--major-outage");
    statusText.textContent = t.statusMajorOutage[pageLang];
    statusText.classList.remove("service-status__service-text--loading");
  }
  else {
    statusText.textContent = t.loadingError[pageLang];
    statusText.classList.add("service-status__service-text--loading");
  }
}

function addIncidentToList(created_at, name, message, statusList, templateItem) {
  const createdAtDate = new Date(created_at);
  const createdDateString = createdAtDate.getDate()  + "." +
      (createdAtDate.getMonth() + 1) + "." +
      createdAtDate.getFullYear() + " " +
      createdAtDate.getHours() + ":" + createdAtDate.getMinutes();
  var newItem = templateItem.cloneNode(true);
  newItem.innerHTML = "<h4>" + name + "</h4><span class='service-status__incident-list-timestamp'>" + createdDateString + "</span><span>" + message + "</span>";
  statusList.appendChild(newItem);
}