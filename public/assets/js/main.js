////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var toolTip = localStorage.getItem('myPopup');
  var toolTipMobile = localStorage.getItem('myPopupMobile');
  var isVisible = false;

  var dropDownMenu = document.getElementsByClassName('dropdown-menu');
  var clickedAway = false;
  var navigationLi = document.querySelectorAll('.nav > li');
  var sendViewLog = true;
  var _supportPageOffset = window.pageXOffset !== undefined;
  var _isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
  var scrollTop = _supportPageOffset ? window.pageYOffset : _isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
  var _propertyModal = false;
  var _pageView = _page = document.getElementById('page-content') ? document.getElementById('page-content').getAttribute('data-page-view') : false;
  var _windowScrollTop = scrollTop > 0 ? scrollTop : document.getElementsByTagName('body')[0].scrollTop;
  var additionalParameters = null;
  var _tokenEl = document.querySelectorAll('meta[name="token"]');
  var _CsrfTokenEl = document.querySelectorAll('meta[name="csrf-token"]');
  if(_tokenEl.length)
    var token = _tokenEl[0].getAttribute('content');
  else if(_CsrfTokenEl.length){
      var token = _CsrfTokenEl[0].getAttribute('content');
  }
  var CHANGE_RANGE_TIMEOUT = null;
  var SHARE_LINK_URL = null;
  const DETAIL_PAGE_TYPE = 1;
  const MAP_PAGE_TYPE = 2;
  const MARKER_PAGE_TYPE = 3;
  const LIST_PAGE_TYPE = 4;
  const GALLERY_PAGE_TYPE = 5;
  const MODAL_PAGE_TYPE = 6;

  window.prevScrollTop = 0;
  window.place = '';
  window.firstCall = true;
  window.requestSent = true;
  window.updateMap = document.getElementById('map') ? true : false;
  window.filters = {};
  window.updateUrl = false;
  window.locationUrl = window.location.href;
  window.stickElAdded = false;

  // Map page constants
  var data = {};
  var openedInfobox = false;
  var newMarkersObjs = {};
  var markers = [];
  var markerLocations = [];
  var _initialLatitude=false;
  var _initialLongitude=false;
  var _preLoader = false;
  var _searchField =false;
  window.bounds = {};
  var locations = [];
  // var _adPath = role == 2 ? _siteLang +'/advertisement/subscription' : 'javascript:void(0)';
  var propAd = '/assets/img/FooterImages.JPG',
      saveMapPostionCheck = false;
  _mapCol = document.getElementsByClassName('mapCol');
  var _zoom = 8;
  if(_mapCol.length){
     _initialLatitude = _latitude = _mapCol[0].getAttribute('data-lat');
     _initialLongitude = _longitude = _mapCol[0].getAttribute('data-lng');
     _zoom = _initialZoom = _mapCol[0].getAttribute('data-zoom');
  }
  var bounds = {};
  var _sections = ['new_posts', 'other_articles'];
  var body = document.getElementsByTagName('body')[0];
  var _elements = document.getElementsByClassName('search-address');
  if(_elements.length){
    for (var i = 0; i < _elements.length; i++) {
      if(_elements[i].offsetWidth > 0 || _elements[i].offsetHeight > 0){
        var  input =_elements[i];
         break;
      }
    }
  }
  var inputAddressMap = document.getElementsByClassName('address-map-input');
  if (inputAddressMap.length)
      input = inputAddressMap[0];

  var _searchAddress = document.querySelectorAll('.search-address');

  if (_searchAddress.length)
       _searchField = _searchAddress[1];

  var _propertyLoaders = document.querySelectorAll('.property-loader');
  var _preLoader = "";
  if(_propertyLoaders.length){
    for (var i = 0; i < _propertyLoaders.length; i++) {
    if(_propertyLoaders[i].offsetWidth > 0 || _propertyLoaders[i].offsetHeight > 0){
       _preLoader = _propertyLoaders[i];
      break;
    }
    }
  }
  var _modal = false;
  var _propertyModal = false;
  var _searchTypes = ['new', 'search'];
  var mapId = document.getElementById('map');
  var updateMap = mapId ? true : false;
  var RequestTimeout = null;
  var locationData = {};
  var navSearchHtml = false;
  var _searchDivKeys = [];
  var _cacheKeys = [];
  var deleteMarkers = true;
  var activeFilters = false;
  var newFilters = document.getElementsByClassName('active-filters');
  var filterContent = document.getElementsByClassName('filterContent');
  var subfilterMenu = document.getElementsByClassName('subfilterMenu');
  var screenWidth = window.innerWidth;

  if (filterContent.length)
      activeFilters = filterContent[0];

  if (screenWidth > 767 && !newFilters.length) {
      var filterLeftCol = document.getElementsByClassName('filterLeftCol');
      if (filterLeftCol.length)
          activeFilters = filterLeftCol[0];
  }

  if (subfilterMenu.length)
      activeFilters = subfilterMenu[0];

  if (_pageView) {
      if (_pageView == 'map')
          var loader = document.getElementsByClassName('property-loader')[0];
      else
          var loader = document.getElementsByClassName('ajax-loader')[0];

      var ajaxRequest = document.getElementById('property-view');
  }

  if (typeof input !== 'undefined')
      var autocomplete = new google.maps.places.Autocomplete(input);

  if (document.readyState === "complete" || document.readyState === "loaded") {
      "use strict";
      var  _iconTooltip =  document.querySelectorAll('[data-toggle="tooltip"]');

      var _navchildEls = document.querySelectorAll('.nav > li > ul li > ul');
      if(_navchildEls.length){
        for (var i = 0; i < _navchildEls.length; i++) {
          var _navWidth = document.querySelectorAll('.nav > li > ul li > ul');
          if(_navWidth.length)
            _navchildEls[i].style.left = _navWidth[0].style.width;
        }
      }
    }
  var _submiPriceCur = document.getElementById('submit-price-cur');
  var _currencySymbol = document.getElementById('currency-symbol');
  if (_submiPriceCur && _currencySymbol) {
    _submiPriceCur.addEventListener("change", function(e){
      var _this = e.currentTarget;
      var _currencySymbol  = document.getElementsByClassName('currency-symbol');
      if(_currencySymbol.length){
        for (var i = 0; i < _currencySymbol.length; i++) {
          _currencySymbol[i].innerText = _this.querySelectorAll('option:selected')[0].getAttribute('data-symbol');
        }
      }
    });
  }

  var _soldPriceCurrency = document.getElementById('sold-price-currency');
  var _soldPriceCurrencySymbol = document.getElementById('sold-price-currency-symbol');
  if(_soldPriceCurrency && _soldPriceCurrencySymbol){
    _soldPriceCurrency.addEventListener('change', function(e){
      var _this = e.currentTarget;
      var _soldCurrencySymbol  = document.querySelectorAll('sold-price-currency-symbol');
      if(_soldCurrencySymbol.length){
        for (var i = 0; i < _soldCurrencySymbol.length; i++) {
          _soldCurrencySymbol[i].innerText = _this.querySelectorAll('option:selected')[0].getAttribute('data-symbol');
        }
      }
    })
  }
  function userDeleteBtn(e) {
    var _this = e.target;
    if (_this.getAttribute('data-role').toLowerCase() == 'admin') {
        swal(
            'Oops...',
            'You Cannot Delete An Admin User',
            'error'
        );
        return false;
    }
     deleteConfirm(_this);

  }

  function moreOpenLink(e) {
    var _modalMoreLink = document.getElementsByClassName('modalMoreLink');
    var _moreOpenlink = document.querySelectorAll('li.moreOpenlink');
    if(_modalMoreLink.length){
      if(_modalMoreLink[0].classList.contains('show'))
         _modalMoreLink[0].classList.remove('show')
      else
        _modalMoreLink[0].classList.add('show')
    }
    if(_moreOpenlink.length){
      _moreOpenlink = _moreOpenlink[0];
      if(_moreOpenlink.classList.contains('modalOpenLink'))
          _moreOpenlink.classList.remove('modalOpenLink');
      else
          _moreOpenlink.classList.add('modalOpenLink');
    }
  }

  function filterTrigger(e) {
    var _fiterColMain = document.getElementsByClassName('fiterColMain');
    var _bodyEl = document.getElementsByTagName('body');
    if(_fiterColMain.length){
      _fiterColMain = _fiterColMain[0];
      if(_fiterColMain.classList.contains('activeFilter'))
          _fiterColMain.classList.remove('activeFilter');
      else
        <!-- Sidebar -->
        <div class="sidebar" id="sidebar">
          <div class="sidebar-inner slimscroll">
            <div id="sidebar-menu" class="sidebar-menu">
              <ul>
                <li>
                  <a href="index.html"><i class="la la-dashboard"></i> <span>Dashboard</span></a>
                </li>
                <li>
                  <a href="employee-dashboard.html"><i class="la la-tachometer"></i> <span>Employee Dashboard</span></a>
                </li>
                <li class="submenu">
                  <a href="#" class="noti-dot"><i class="la la-user"></i> <span> Employees</span> <span class="menu-arrow"></span></a>
                  <ul style="display: none;">
                    <li><a href="employees.html">All Employees</a></li>
                    <li><a href="holidays.html">Holidays</a></li>
                    <li><a href="leaves.html">Leaves (Admin) <span class="badge badge-pill bg-primary float-right">1</span></a></li>
                    <li><a href="leaves-employee.html">Leaves (Employee)</a></li>
                    <li><a href="leave-settings.html">Leave Settings</a></li>
                    <li><a href="attendance.html">Attendance (Admin)</a></li>
                    <li><a href="attendance-employee.html">Attendance (Employee)</a></li>
                    <li><a href="departments.html">Departments</a></li>
                    <li><a href="designations.html">Designations</a></li>
                    <li><a href="timesheet.html">Timesheet</a></li>
                    <li><a href="performance.html">Performance Review</a></li>
                    <li><a href="promotion.html">Promotion</a></li>
                    <li><a href="resignation.html">Resignation</a></li>
                    <li><a href="termination.html">Termination</a></li>
                    <li><a href="overtime.html">Overtime</a></li>
                  </ul>
                </li>
                <li>
                  <a href="clients.html"><i class="la la-users"></i> <span>Clients</span></a>
                </li>
                <li>
                  <a href="projects.html"><i class="la la-rocket"></i> <span>Projects</span></a>
                </li>
                <li>
                  <a href="tasks.html"><i class="la la-tasks"></i> <span>Tasks</span></a>
                </li>
                <li class="submenu">
                  <a href="#"><i class="la la-phone"></i> <span> Calls</span> <span class="menu-arrow"></span></a>
                  <ul style="display: none;">
                    <li><a href="voice-call.html">Voice Call</a></li>
                    <li><a href="video-call.html">Video Call</a></li>
                    <li><a href="outgoing-call.html">Outgoing Call</a></li>
                    <li><a href="incoming-call.html">Incoming Call</a></li>
                  </ul>
                </li>
                <li>
                  <a href="contacts.html"><i class="la la-book"></i> <span>Contacts</span></a>
                </li>
                <li>
                  <a href="leads.html"><i class="la la-user-secret"></i> <span>Leads</span></a>
                </li>
                <li class="submenu">
                  <a href="#"><i class="la la-files-o"></i> <span> Accounts </span> <span class="menu-arrow"></span></a>
                  <ul style="display: none;">
                    <li><a href="estimates.html">Estimates</a></li>
                    <li><a href="invoices.html">Invoices</a></li>
                    <li><a href="payments.html">Payments</a></li>
                    <li><a href="expenses.html">Expenses</a></li>
                    <li><a href="provident-fund.html">Provident Fund</a></li>
                    <li><a href="taxes.html">Taxes</a></li>
                  </ul>
                </li>
                <li class="submenu">
                  <a href="#"><i class="la la-money"></i> <span> Payroll </span> <span class="menu-arrow"></span></a>
                  <ul style="display: none;">
                    <li><a href="salary.html"> Employee Salary </a></li>
                    <li><a href="salary-view.html"> Payslip </a></li>
                    <li><a href="payroll-items.html"> Payroll Items </a></li>
                  </ul>
                </li>
                <li class="submenu">
                  <a href="#"><i class="la la-building"></i> <span> Jobs </span> <span class="menu-arrow"></span></a>
                  <ul style="display: none;">
                    <li><a href="jobs.html"> Manage Jobs </a></li>
                    <li><a href="job-applicants.html"> Applied Candidates </a></li>
                  </ul>
                </li>
                <li>
                  <a href="tickets.html"><i class="la la-ticket"></i> <span>Tickets</span></a>
                </li>
                <li>
                  <a href="events.html"><i class="la la-calendar"></i> <span>Events</span></a>
                </li>
                <li>
                  <a href="inbox.html"><i class="la la-at"></i> <span>Email</span></a>
                </li>
                <li>
                  <a href="chat.html"><i class="la la-comments"></i> <span>Chat</span> <span class="badge badge-pill bg-primary float-right">5</span></a>
                </li>
                <li>
                  <a href="assets.html"><i class="la la-object-ungroup"></i> <span>Assets</span></a>
                </li>
                <li>
                  <a href="knowledgebase.html"><i class="la la-question"></i> <span>Knowledgebase</span></a>
                </li>
                <li>
                  <a href="policies.html"><i class="la la-file-pdf-o"></i> <span>Policies</span></a>
                </li>
                <li>
                  <a href="activities.html"><i class="la la-bell"></i> <span>Activities</span></a>
                </li>
                <li>
                  <a href="users.html"><i class="la la-user-plus"></i> <span>Users</span></a>
                </li>
                <li class="submenu">
                  <a href="#"><i class="la la-pie-chart"></i> <span> Reports </span> <span class="menu-arrow"></span></a>
                  <ul style="display: none;">
                    <li><a href="expense-reports.html"> Expense Report </a></li>
                    <li><a href="invoice-reports.html"> Invoice Report </a></li>
                  </ul>
                </li>
                <li>
                  <a href="settings.html"><i class="la la-cog"></i> <span>Settings</span></a>
                </li>
                <li class="submenu">
                  <a href="#"><i class="la la-columns"></i> <span> Pages </span> <span class="menu-arrow"></span></a>
                  <ul style="display: none;">
                    <li><a href="login.html"> Login </a></li>
                    <li><a href="register.html"> Register </a></li>
                    <li><a href="forgot-password.html"> Forgot Password </a></li>
                    <li><a href="otp.html"> OTP </a></li>
                    <li><a href="lock-screen.html"> Lock Screen </a></li>
                    <li><a class="active" href="profile.html"> Employee Profile </a></li>
                    <li><a href="client-profile.html"> Client Profile </a></li>
                    <li><a href="search.html"> Search </a></li>
                    <li><a href="faq.html"> FAQ </a></li>
                    <li><a href="terms.html"> Terms </a></li>
                    <li><a href="privacy-policy.html"> Privacy Policy </a></li>
                    <li><a href="error-404.html">404 Error </a></li>
                    <li><a href="error-500.html">500 Error </a></li>
                    <li><a href="blank-page.html"> Blank Page </a></li>
                  </ul>
                </li>
                <li>
                  <a href="components.html"><i class="la la-puzzle-piece"></i> <span>Components</span></a>
                </li>
                <li class="submenu">
                  <a href="javascript:void(0);"><i class="la la-share-alt"></i> <span>Multi Level</span> <span class="menu-arrow"></span></a>
                  <ul style="display: none;">
                    <li class="submenu">
                      <a href="javascript:void(0);"> <span>Level 1</span> <span class="menu-arrow"></span></a>
                      <ul style="display: none;">
                        <li><a href="javascript:void(0);"><span>Level 2</span></a></li>
                        <li class="submenu">
                          <a href="javascript:void(0);"> <span> Level 2</span> <span class="menu-arrow"></span></a>
                          <ul style="display: none;">
                            <li><a href="javascript:void(0);">Level 3</a></li>
                            <li><a href="javascript:void(0);">Level 3</a></li>
                          </ul>
                        </li>
                        <li><a href="javascript:void(0);"> <span>Level 2</span></a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:void(0);"> <span>Level 1</span></a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
          _fiterColMain.classList.add('activeFilter');
    }
    if(_bodyEl.length){
      _bodyEl = _bodyEl[0];
      if(_bodyEl.classList.contains('mbl'))
          _bodyEl.classList.remove('mbl');
      else
          _bodyEl.classList.add('mbl');
    }
  }
  function sortTrigger(e) {
    var _bodyEl = document.getElementsByTagName('body');
    var _filterOrderList = document.getElementsByClassName('filterOrderList');
    if(_filterOrderList.length){
      _filterOrderList = _filterOrderList[0];
      if(_filterOrderList.classList.contains('openSortOrder'))
          _filterOrderList.classList.remove('openSortOrder');
      else
          _filterOrderList.classList.add('openSortOrder');
    }
    if(_bodyEl.length){
      _bodyEl = _bodyEl[0];
      if(_bodyEl.classList.contains('mbl'))
          _bodyEl.classList.remove('mbl');
      else
          _bodyEl.classList.add('mbl');
    }
  }
  function filterCancel(e) {
    var _filterColMain = document.querySelectorAll('.fiterColMain');
    if(_filterColMain.length && _filterColMain[0].classList.contains('activeFilter'))
    {
      _filterColMain[0].classList.remove('activeFilter');
    }
  }
  function sortCancel(e) {
    var _filterOrderList = document.getElementsByClassName('filterOrderList');
    var _bodyEl = document.getElementsByTagName('body');
    if(_filterOrderList.length)
        _filterOrderList[0].classList.remove('openSortOrder');

    if(_bodyEl.length){
      _bodyEl = _bodyEl[0];
      if(_bodyEl.classList.contains('mbl'))
          _bodyEl.classList.remove('mbl');
      else
          _bodyEl.classList.add('mbl');
    }
  }

  function newsLetterForm(e)
  {
      e.preventDefault();
      var _element = e.target;
      newsLetterSubmit(_element, true);
  }
  function extantdUrlNewsletterModal(e) {
    var _this = e.target;
    var _el = document.querySelector(_this.getAttribute('data-target'))
    modalShow(_el)
  }
  function newsLetterForm2(e)
  {
      e.preventDefault();
      var _element = e.target;
      var success = false;
      var _fields = _element.querySelectorAll('input');
      var _formObj = {};
      for (var i = 0; i < _fields.length; i++) {
        var _field = _fields[i];
        var _fName = _field.name;
        var _fValue = _field.value;
        _formObj[_fName] = _fValue;
      }
      _formObj['region'] = _locale;
      axios.post('/newsletter', _formObj)
      .then(function(response){
        success = true;
        var _el = document.getElementById('extantdUrlNewsletterModal');
        modalHide(_el);
      })
      .catch(function(error){
        var _errorVal = error.response.data.errors;
        if(_element){
          _element.querySelector('.help-block').remove();

          var _parentElement = _element.querySelectorAll(`input[name^="${fieldName}"]`);
          if(_parentElement.length){
            if(_parentElement[0].offsetWidth > 0 || _parentElement[0].offsetHeight > 0){
              _parentElement = _parentElement[0].parentNode;
            }
          }
          if(_parentElement)
            _parentElement.insertAdjacentHTML('afterend', '<p class="help-block">' + _errorVal + '</p>');

        }
      })
      if (success) {
        window.open(_element.data('url'), '_blank');
      }

  }
  function ratingVal(e) {
    var _this = e.target;
    var _childId = _this.childNodes[1].getAttribute('id');
    var _childEl = document.getElementById(`${_childId}1`);
    if (_this.childNodes[1].checked ){
        let event = new Event("click");
        _childEl.dispatchEvent(event);
    }
  }

  function submitRating(event) {
       var _this =event.target;
      _rating = document.querySelector('.rating-number').innerText;
      _item_id = _articleId;
      data = {};
      getPercent(_this);
      data = {
            'item_type': 'article',
            'ratings': _rating,
            'item_id': _item_id
      };
      var _ratingSec = document.getElementById('ratingSec');
      var _inputEls = _ratingSec.querySelectorAll('input')

      for (var i = 0; i < _inputEls.length; i++) {
        _inputName = _inputEls[i].name;
        _inputChecked = _inputEls[i].checked ? 1 : 0;
        data[_inputName] = _inputChecked;
      }
      if (Number.isInteger(Math.ceil(_rating))) {
         _url = '/article/rating';
         axios.get(_url,{  params:data  })
         .then(function(response){
           response = response.data;
           if(response == 'success'){
             var _ratingSectionElement = document.getElementsByClassName('rating-section');
             if(_ratingSectionElement.length)
                 _ratingSectionElement[0].style.display = 'none';
             var _articleRatingElement = document.getElementsByClassName('articleRatingMessage')[0];
             if(_articleRatingElement.length)
                 _articleRatingElement[0].style.display = 'block';
           }
         })
      }
  }
  var _countryFlags = false;
  _countryFlags = document.querySelectorAll('.country-flags');
  if(_countryFlags.length){
    for (var i = 0; i < _countryFlags.length; i++) {
      _countryFlags[i].addEventListener('click', function(event){
        var _this = event.target;
        var _selText =_this.innerText;
        var _imgSource = _this.getElementsByTagName('img')[0].getAttribute('src');
        var _img = `<img src=${_imgSource} class="img-thumbnail icon-medium"/>`;
        document.querySelectorAll('.dropdown-toggle')[0].innerHTML = `${_img}<span class="caret"></span>`;
      })
    }
  }

  if(navigationLi.length){
      for (var i = 0; i < navigationLi.length; i++) {
        navigationLi[i].addEventListener('mouseover', function(e){
          var _bodyEls = document.getElementsByTagName('body');
          if (_bodyEls[0].classList.contains('navigation-fixed-bottom')) {
            if (window.innerWidth > 768) {
              var spaceUnderNavigation = window.innerHeight - (this.offsetTop - scrollTop);
              var childElements = this.querySelectorAll('.child-navigation');
              if(childElements.length){
                for (var i = 0; i < childElements.length; i++) {
                  if (spaceUnderNavigation < childElements[i].style.height) {
                    childElements[i].classList.add('position-bottom');
                  } else {
                    childElements[i].classList.remove('position-bottom');
                  }
                }

              }
            }
          }
        })

      }
    }
  function responsiveLandingFilter(e){
    var _bodyEl = document.getElementsByTagName('body');
    if(_bodyEl.length){
      _bodyEl = _bodyEl[0];
      if(_bodyEl.classList.contains('openResponsivefilter'))
          _bodyEl.classList.remove('openResponsivefilter');
      else
          _bodyEl.classList.add('openResponsivefilter');
    }
  }
  function filterCloseRowIcon(e){
    var _bodyEl = document.getElementsByTagName('body');
    if(_bodyEl.length){
      _bodyEl = _bodyEl[0];
      if(_bodyEl.classList.contains('openResponsivefilter'))
        _bodyEl.classList.remove('openResponsivefilter');
    }
  }
  var _filterBtns = document.getElementsByClassName('filter-btn');
  if(_filterBtns.length){
    for (var i = 0; i < _filterBtns.length; i++) {
      _filterBtns[i].addEventListener('click', function(e){
        if(this.parentNode.classList.contains('property-status'))
        {
          var _statusBtns = document.getElementsByClassName('property-status');
          [].forEach.call(_statusBtns, (_statusBtn) => {
            _statusBtn.classList.remove('active');
          });
          this.parentNode.classList.add('active');
          updateLandingURL();
        }
        _el = e.target;
          if(_el.parentNode.classList.contains('filterAddon'))
              var _parentEl = _el.parentNode;

        if(_el){
          if(_el.classList.contains('openfilter')){
            _el.classList.remove('openfilter');
          }
          else
            _el.classList.add('openfilter');
          if(_parentEl){
              var _subfilterMenu = _parentEl.querySelectorAll('.subfilterMenu');
              for (var i = 0; i < _subfilterMenu.length; i++) {
                if(_subfilterMenu[i].style.display == "block"){
                  _subfilterMenu[i].style.display = "none";
                }
                else
                  _subfilterMenu[i].style.display = "block";
              }
          }
        }

        var _this = e.currentTarget;
        var _arrow = _this.getElementsByTagName('i');
        var _className = 'openfilter';
        if (multipleClassList(_this.classList, _className)) {
          if(_arrow.length){
            _arrow[0].classList.remove('fa-angle-down')
            _arrow[0].classList.add('fa-angle-up');
          }
        } else {
          if(_arrow.length){
            _arrow[0].classList.remove('fa-angle-up')
            _arrow[0].classList.add('fa-angle-down');
          }
        }
      })
    }
  }
  function quickTabSection(e) {
    var _targetEl = e.target;
    var _parentElement = _targetEl.parentNode;
    var _siblingEl = _targetEl.nextElementSibling;
    if(_parentElement)
      var _liElement = _parentElement.parentNode;
    if(_liElement.classList.contains('openDDMenu')){
        _liElement.classList.remove('openDDMenu');
        _siblingEl.style.display = "none";
    } else {
      _liElement.classList.add('openDDMenu');
      _siblingEl.style.display = "block";
    }
  }
  function filterCheckbox(e) {
    var _checkbox = e.querySelector('input[type="checkbox"]');
    if(_checkbox){
      if(e.classList.contains('active') &&  _checkbox.checked){
        e.classList.remove('active');
        _checkbox.checked = false;
        showFilters();

      } else {
        e.classList.add('active');
        e.classList.add('focus');
        _checkbox.checked = true;
        showFilters();
      }
    }
  }
  document.onclick = documentClickHandler;
  function documentClickHandler(e) {
    var _this = e.target;
    if((document.getElementsByClassName('filterDdColMain').length && document.getElementsByClassName('filterDD').length) || (_this.classList.contains('customCheck') && _this.querySelector('input').classList.contains('change-update')))
        filterCheckbox(_this);
    if (!document.getElementsByClassName('filterDdColMain').length && !document.getElementsByClassName('filterDD').length) {
      var _filterDD = document.getElementsByClassName('filterDD');
      if(_filterDD.length)
      _filterDD[0].classList.remove('selected-filter');
    }
    var _bodyEl = document.getElementsByTagName('body');
    var _openDDMenu = _bodyEl[0].querySelectorAll('.openDDMenu');
    if (_openDDMenu.length && _this.parentNode.getAttribute('class') !== 'quickTabSection') {
      var _footerLinks = _bodyEl[0].getElementById('footer-direct-links');
      let _openDDMenu = _footerLinks.querySelectorAll('openDDMenu');
      if(_openDDMenu.length){
        for (var i = 0; i < _openDDMenu.length; i++) {
          _openDDMenu[i].classList.remove('openDDMenu');
        }
      }
      var _subquickLink = document.getElementsByClassName('subquickLink');
        if(subquickLink.length)
            subquickLink[0].style.height = "0px";
      }
    var _filterBtn = _bodyEl[0].querySelectorAll('.filter-btn');
    if(_this.parentNode.nodeName == "DIV")
        var _mapSearchParent = _this.parentNode;
    if(_filterBtn.length){
      for (var i = 0; i < _filterBtn.length; i++) {
        if (_filterBtn.length && _filterBtn[i].classList.contains('openfilter') && _this.parentNode.classList.contains('map-search-box')) {
          _arrow = _filterBtn[0].getElementsByTagName('i');
          _arrow[0].classList.remove('fa-angle-up');
          _arrow[0].classList.add('fa-angle-down');
          var _filterBtn = document.getElementsByClassName('filter-btn')
          if(_filterBtn.length){
            for (var i = 0; i < _filterBtn.length; i++) {
              var _filterBtnParent = _filterBtn[i].parentNode.classList.contains('filterAddon') ? _filterBtn[i].parentNode : "" ;

              if(_filterBtn[i].classList.contains('openfilter')){
                _filterBtn[i].classList.remove('openfilter');
                if(_filterBtnParent)
                {
                  var subfilterMenu = _filterBtnParent.querySelectorAll('subfilterMenu');
                  if(subfilterMenu.length)
                  subfilterMenu[0].style.display = "none";
                }

              } else{
                if(_filterBtnParent)
                {
                  _filterBtn[i].classList.add('openfilter');
                  var subfilterMenu = _filterBtnParent.querySelectorAll('subfilterMenu');
                  if(subfilterMenu.length)
                  subfilterMenu[0].style.display = "block";
                }
              }
            }
          }
        }

      }
    }

  }
  function navbarToggle(e){
    var _bodyEl = document.getElementsByTagName('body');
    if(_bodyEl.length){
      _bodyEl = _bodyEl[0];
      if(_bodyEl.classList.contains('openNav'))
        _bodyEl.classList.remove('openNav');
      else
        _bodyEl.classList.add('openNav');
    }
  }
  function navCloseRow(e) {
    var _bodyNav = document.getElementsByTagName('body');
    if(_bodyNav.length)
        _bodyNav[0].classList.remove('openNav');
  }

  // smooth scroll arrow (Home banner)
  var _hrefEls = document.querySelectorAll('a[href^="#"]');
  if(_hrefEls.length){
    for (var i = 0; i < _hrefEls.length; i++) {
      _hrefEls[i].addEventListener('click', function(e){
        var _target = e.currentTarget.getAttribute('href');
        var _target = _hrefEls[i].querySelectorAll("a[href = _target]");
        if( _target.length ) {
            event.preventDefault();
              window.scrollTo({
              top:_target[0].offsetTop,
              behavior: "smooth"
            })
          }
      })
    }
  }
  function bottomArrowScroll(e) {
    window.scrollTo({
      top: document.getElementsByClassName('benefits-sec')[0].offsetTop-40,
      behavior: "smooth"
  })
  }

  //Generate random password for agency admin
  function generatePassword(event){
    event.preventDefault();
    var _this = event.target;
    axios.get('/account/agency/agent/random-password')
    .then(function(response){
      document.getElementById("password").value = response.data;
      document.getElementById("password-confirm").value = response.data;
    });
  };
  window.onload = function() {
    var _deleteBtns = document.querySelectorAll('.delete-btn');
    if(_deleteBtns.length){
      _deleteBtns.forEach((_deleteBtn) => {
        _deleteBtn.addEventListener('click', function(event){
          var _el = event.target;
          deleteConfirm(_el);
        })
      });
    }
  }
  var _left = 400;
  function rightSideArrow(e) {
    var _scrollLeft = document.getElementsByClassName('photo-wall-content')[0].scrollLeft;
      if (_propertyModal){
        var _propertyModal = document.getElementById('propertyModal');
        var _photoWllContent = _propertyModal.querySelectorAll('.photo-wall-content');
        if(_photoWllContent.length){
          _photoWllContent[0].scrollTo({
            left: _scrollLeft+_left,
            behavior: "smooth"
          })
        }
      } else {
        document.getElementsByClassName('photo-wall-content')[0].scrollTo({
          left: _scrollLeft+_left,
          behavior: "smooth"
        })
      }
  }

  function seePropDetail(e) {
    var _this = e.currentTarget;
    _propId = _this.getAttribute('data-target-id');
    showPropModalNew(_propId);
  }

  if (document.getElementById('newsletterModal')) {
      var _newsLetterHeader = document.getElementById('newsletterModal').querySelectorAll('.modal-header');
      if(_newsLetterHeader.length)
        _newsLetterHeader[0].getElementsByTagName('p')[0].innerText = _propertyContactSubHeaderTexts;
      var newsLetterHeader = document.getElementById('newsletterModal').innerHTML;
  }
  function agentContactModal(e) {
    var _this = e.target;
    var _agentContactModal = document.getElementById('agent-contact-modal')
    _agentContactModal.insertAdjacentHTML('beforeend', newsLetterHeader);
    var _agentContactForm = _agentContactModal.querySelectorAll('.'+_agentContactModal.getAttribute('data-target'));
    _agentContactForm[0].setAttribute('data-agent', _this.getAttribute('data-agent'));
    _agentContactForm[0].setAttribute('data-prop-id', _this.getAttribute('data-prop-id'));
    _agentContactForm[0].setAttribute('data-text', _this.getAttribute('data-text'));
    _agencyFormId = _agentContactForm[0].querySelectorAll('input[name="agency_id"]');
      if(_agencyFormId.length)
          _agencyFormId[0].value = _this.getAttribute('data-agency');
    modalShow(_agentContactModal);
  }
  function modalShow(element) {
    element.classList.add('in');
    element.style.display = "block";
  if(element.offsetWidth > 0 || element.offsetHeight > 0){
    document.getElementsByTagName('body')[0].classList.add('modal-open');
  }
  }
  function modalHide(element) {
    element.classList.remove('in');
    element.style.display = "none";
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }
  function closeBtn(e) {
    var _this = e.target;
    if(_this.classList.contains('close')){
      var _agentContactModal = document.getElementById(_this.getAttribute('data-target'));
      modalHide(_agentContactModal)
    }
  }

  function multipleClassList(_classes, className) {
    for (var i = 0; i < _classes.length; i++) {
      if(_classes[i] == className && typeof _classes[i] !== "undefined"){
        return true;
      }
    }
    return false;
  }
  function filterDdItem(e) {
    var _this = e.currentTarget;
    var _el = e.target;
    var _elClass = _el.getAttribute('data-target');
    var _els = document.getElementsByClassName(_elClass);
    var _className = 'selected-filter';
    if(multipleClassList(_this.classList, _className) && !(_els.length)){
      _this.classList.remove('selected-filter');
    }
    else{
      _this.classList.remove('selected-filter');
      if(!(e.target).querySelectorAll('.opt-close').length)
          _this.classList.add('selected-filter');

    }
    clickedAway = false
    isVisible = true
    e.preventDefault();
  }
  var _landSrcBtn = document.querySelectorAll('.landSrcBtn');
  if(_landSrcBtn.length){
    for (var i = 0; i < _landSrcBtn.length; i++) {
      _landSrcBtn[i].addEventListener('click', function(e){
        updateLandingURL(e);
      })
    }
  }

  function acceptCookie(event){
    event.preventDefault();
    var _this = event.target;
    axios.get('/set-cookie')
    .then(function(response){
      fadeOut(document.getElementById("cookie-accept-terms"))
      window.setTimeout(function() {
        // PopUp();
      }, 3000);
    });
  };

  function fadeOut(element) {
      var op = 1;  // initial opacity
      var timer = setInterval(function () {
          if (op <= 0.1){
              clearInterval(timer);
              element.style.display = 'none';
          }
          element.style.opacity = op;
          element.style.filter = 'alpha(opacity=' + op * 100 + ")";
          op -= op * 0.1;
      }, 50);
  }
  window.addEventListener('scroll', function(){
    var _secondaryNavigation =  document.getElementsByClassName('secondary-navigation');
       if (scrollTop > 400){
         if(_secondaryNavigation.length)
               _secondaryNavigation[0].style.display = "none";
       }
       else{
         if(_secondaryNavigation.length)
             _secondaryNavigation[0].style.display = "block";

       }
  })
  var _checkBoxField = document.getElementsByClassName('checkbox_field');
  if (_checkBoxField.length && _checkBoxField[0].getAttribute('data-old-address'))
      document.getElementById('addressField').style.display = "block";

  function showAddressModal(e) {
    document.getElementById('addressModal').insertAdjacentHTML('afterend', '<div class="modal-backdrop fade in"></div>');
  }
  var _addressCheckbox = false;
  _addressCheckbox = document.getElementById('addressCheckbox');
  if (_addressCheckbox){
    showHideRegisterDivs(_addressCheckbox);

  }
  var _addressEl = false;
   _addressEl = document.getElementById('addressCheckbox');
   if(_addressEl){
     _addressEl.addEventListener('change', function(e){
       document.getElementsByTagName('body')[0].style.overflowY = "auto";
       showHideRegisterDivs(e.target);

     })
  }

  function registerRoles(event) {
    var _this = event.target;
    var _userRole = _this.getAttribute('data-role');
    document.querySelector('input[name=name]').setAttribute('placeholder', _this.getAttribute('data-placeholder')+'*');
    document.querySelector('input[name=role_id]').value = _userRole;
    var _opmCheck =  document.getElementsByClassName('opm-checkbox');
        if (_userRole == 4){
        if(_opmCheck.length)
              _opmCheck[0].style.display = "block";
        } else {
              if(_opmCheck.length)
              _opmCheck[0].style.display = "none";
        }

        var url = window.location.href.split('?');
          var segments = url[0].split('/');
          currenturl = url[0];

          segments[5] = _this.getAttribute('data-url');

          _pushURL = segments.join('/');

          if (url[1] && url[1] != '') _pushURL = _pushURL + '?' + url[1];

          window.history.replaceState("object or string", document.title, _pushURL);
  }
  window.addEventListener('load', function(){
    var _articleShareInfo = document.getElementById('articleShareInfo');
    if(_articleShareInfo) _articleShareInfo.style.display = "block";
    var _articleRateDetail = document.getElementsByClassName('articleRate-detail');
    if(_articleRateDetail.length) _articleRateDetail[0].style.display = "block";
    var _commonSection = document.getElementById('commentSection');
    if(_commonSection) _commonSection.style.display = "block";

    showHideScrollBtn(_windowScrollTop);

    var _userRolesEls = document.querySelectorAll('ul.user-roles li');
    if(_userRolesEls.length){
      for (var i = 0; i < _userRolesEls.length; i++) {
        if(_userRolesEls[i].getAttribute('class') == 'active'){
          var _active = _userRolesEls[i].getElementsByTagName('a');
          var _activePlaceholder = _active[0].getAttribute('data-placeholder');
          var _el = document.querySelectorAll('input[name="name"]');
          _el[0].setAttribute('placeholder', `${_activePlaceholder}*`);
          document.querySelectorAll('input[name="role_id"]')[0].value = _active[0].getAttribute('data-role');
        }

      }
    }
  })

  function setMainImage(e)
  {
      var _this = e.target;
      imageId = _this.getAttribute('data-id');
      propertyId = _this.getAttribute('data-property-id');
      advertiserProperty = _this.getAttribute('data-advertiser');
      var _imgLoad = document.getElementsByClassName('img-load');
      axios.get('/property/set-main-image', {
        params:{
          'image_id' : imageId,
          'property_id' : propertyId ,
          'advertiserProperty' : advertiserProperty
        }
      })
      .then(function(response){
        response = response.data;
        var _el = document.getElementById('grid-view');
        if(_el) _el.setAttribute('ajax-request', 0);
        if(_imgLoad) _imgLoad[0].style.display = 'none';
        var _el = document.getElementsByClassName('gallery-images');
        if(_el.length)
          _el[0].innerHTML = response;
        updateImages();
      })
    }
  function showHideScrollBtn(_windowScrollTop) {
    var _scrollTopBtn = document.getElementsByClassName('scroll-top-btn');
      if (_windowScrollTop > 600){
         var _scrollBtn = document.getElementsByClassName('scroll-top-btn');
         if(_scrollBtn.length)  _scrollBtn[0].style.display = "block";
      } else {
        if(_scrollTopBtn.length)  _scrollTopBtn[0].style.display = "none";
      }

      if (_windowScrollTop == 0) {
          if(_scrollTopBtn.length) _scrollTopBtn[0].style.display = "none";
      }

  }
  function scrollToTop() {
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
    document.getElementsByClassName('scroll-top-btn')[0].style.display = "block";
    window.prevScrollTop = 0;
  }
  function scrollTopBtn(e) {
    e.preventDefault();
    scrollToTop();
  }
  var _socialShareIcons = document.getElementsByClassName('social-share');
  if(_socialShareIcons.length){
    for (var i = 0; i < _socialShareIcons.length; i++) {
      _socialShareIcons[i].addEventListener('click', function(e){
        socialShareIcons(e);
      })
    }
  }
  function socialShareIcons(e) {
    e.preventDefault();
    var _this = e.currentTarget;
    window.open(_this.getAttribute('href'), 'fbShareWindow', 'height=450, width=550, top=' + (window.innerHeight / 2 - 275) + ', left=' + (window.innerWidth / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    return false;
  }
  // Show rating form
  var _agencyLogoEl = document.getElementById('agency-logo-file');
  if(_agencyLogoEl){
    _agencyLogoEl.addEventListener('change', function(){
     var _imagesForm = document.getElementById('formSubmit');
     var _action = _imagesForm.getAttribute('action');
     var _metaToken = document.querySelector('[name="csrf-token"]');

    var formData = new FormData();
        formData.append( 'logo', _agencyLogoEl.files[0] );
        formData.append("_token", _metaToken.getAttribute('content')); // <- adding csrf token
        var _loaderImage = document.getElementsByClassName('loader-image');
        var _fileUpload = document.getElementsByClassName('fileUpload');
        var _browseBtn = document.getElementById('browse-btn');
        imageLoader(_loading);
        axios.post(_action, formData)
        .then(function(response){
          _loading = false;
          imageLoader(_loading);
          if(_loaderImage.length)
              _loaderImage[0].style.display = "none";

              if (response) {
                document.getElementsByClassName('image')[0].src = response.data;
              }

               if(_fileUpload.length)
                 _fileUpload[0].removeAttribute('disabled')

              var _dataTextName = _agencyLogoEl.getAttribute('data-text-name');
              _browseBtn.innerHTML = _dataTextName ? _dataTextName : ChangeLogo;
              document.getElementById('remove-profile-pic-btn').classList.remove('hidden');
        })
    })
  }
  function deleteCommon(_el) {
    var _parentNode = _el.parentNode;
    var _form = _parentNode.querySelectorAll('form.delete-form');
      if (_form.length) {
          _form[0].submit();
      } else {
          window.location.href = _el.getAttribute('href');
      }
  }

  function deleteConfirm(_el) {
      var showSuccessMessage = false;
      var title = deleteConfirmMessage.replace(':attribute', _el.getAttribute('data-item') ? _el.getAttribute('data-item') : '');

      swal({
          title: title,
          text: deleteConfirmPermission,
          type: 'warning',
          showCancelButton: true,
          cancelButtonText: Cancel,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: confirmButton
      }).then(function() {

          deleteCommon(_el);

          if (showSuccessMessage) {
              swal(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
              );
          }

      }, function(dismiss) {
          if (dismiss === 'cancel') {
              swal(
                  'Cancelled',
                  'Deletion Cancelled',
                  'error'
              );

              return false;
          }
      });
  }

  function bookmark(propertyId) {
    axios.get('/property/add-bookmark',{
      params:{
        'propertyId': propertyId
      }
    })
  }

  function removeProfilePic(e){
    _el = e.target;
    _element = _el.getAttribute('href');
    confirmDelete(_el);
  }

  function confirmDelete(_el) {
      var title = deleteConfirmText.replace(':attribute', _el.getAttribute('data-item') ? _el.getAttribute('data-item') : '');

      swal({
          title: title,
          text: deleteConfirmPermission,
          type: 'warning',
          showCancelButton: true,
          cancelButtonText: Cancel,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: confirmButton
      }).then(function() {
          deleteProfilePic(_el);
      }, function(dismiss) {
          if (dismiss === 'cancel') {
              swal(
                  'Cancelled',
                  'Deletion Cancelled',
                  'error'
              );
              return false;
          }
      });

  }
  function imageLoader(loading) {
    var _loaderImage = document.getElementsByClassName('loader-image');
    var _fileUpload = document.getElementsByClassName('fileUpload');
    var _browseBtn = document.getElementById('browse-btn');
    var _image =  document.getElementsByClassName('image');
    if(loading){
      if(_browseBtn)
            _browseBtn.innerHTML = 'Uploading ...';
      _fileUpload[0].setAttribute('disabled', 'disabled');
      _loaderImage[0].style.display = 'block';
      _image[0].style.filter = 'blur(2px)';
    } else {
      if(_fileUpload.length)
      if(_browseBtn)
            _browseBtn.innerHTML = '';
      _fileUpload[0].removeAttribute('disabled');
      _loaderImage[0].style.display = 'none';
      _image[0].style.filter = '';
    }
  }
var _loading = true;
  function deleteProfilePic(_element) {
        var submitUrl = _element.getAttribute('href');
        imageLoader(_loading);

      var _imageEl = document.getElementsByClassName('image');
      axios.get(submitUrl)
      .then(function(response){
        _loading = false;
        imageLoader(_loading);
        response = response.data;
        var _removeProfilePic =  document.getElementById('remove-profile-pic-btn');
        if(_removeProfilePic){
          _removeProfilePic.classList.add('hidden');
          _removeProfilePic.nextElementSibling.removeAttribute('src');
          _removeProfilePic.nextElementSibling.setAttribute('src', response);
        }
        _fileUpload.querySelector('span').innerText = "";
        _imageEl[0].animate({ filter: 'blur(0px)' });
        _el = document.getElementsByClassName('loader-image');
        if(_el.length)
          _el[0].style.display = "none";
          _fileUpload[0].removeAttribute('disabled');
          _els[0].className += " bookmark-added";
        swal(
            'Deleted!',
            'Your image has been deleted.',
            'success'
        );
        document.getElementById("browse-btn").text = _element.getAttribute('data-noprofile-btn-text') ? _element.getAttribute('data-noprofile-btn-text') :AddLogo;
      })
    .catch(function(error) {
      if(error.response)
        _errorVal = error.response.data.errors;
      var _el = document.getElementById('upload-image-files-btn');
      if(_el && _errorVal)
      _el.insertAdjacentHTML('afterend', `<p class="help-block"> ${_errorVal} </p>`);
    })
  }

  function getPercent(_this) {
      var _total_user = ((+_this.getAttribute('data-total-rating-user') + +1) * 5);
      var _total_user_rating = (+_this.getAttribute('data-total-rating-sum') + +_rating);
      var _percent = ((_total_user_rating * 5) / _total_user);
      var _round_Up = Math.pow(10, 1)
      var _roundRating = Math.ceil(_percent * _round_Up) / _round_Up;
      var _totalRating = document.getElementsByClassName('total-rating');
        if(_totalRating.length)
            _totalRating[0].innerText = _roundRating;
  }
  function rateLabel(e) {
    var _this = e.target;
    var _parentElement = _this.parentNode;
    var _childNodes = _parentElement.children;
    if(_this.classList[1] == 'marked'){
      if(_this.previousElementSibling){
        for (var i = 0; i < _childNodes.length; i++) {
          if(_this.previousElementSibling){
            _this.previousElementSibling.classList.remove('marked');
            _this.previousElementSibling.classList.add('unmarked')
            _this = _this.previousElementSibling;
          }
        }
      }
    } else if(_this.classList[1] == 'unmarked'){
      if(_this.nextElementSibling){
        for (var i = 0; i < _childNodes.length; i++) {
          if(_this.nextElementSibling){
            _this.classList.remove('unmarked');
            _this.classList.add('marked')
            _this = _this.nextElementSibling;
          }
        }
      }
    }
    countRating();
    _firstView = false;
  }

  function countRating() {
      count = 0;
      var _markedEls = document.getElementsByClassName('marked');
      [].forEach.call(_markedEls, (_markedEl) => {
          count = count + parseInt(_markedEl.getAttribute('data-score'));
      });
      count = (count / 5);
      var _ratingNumber = document.getElementsByClassName('rating-number');
      if(_ratingNumber.length)
        _ratingNumber[0].innerText = count;
  }

  function getSimilarProperties(additionalParameters) {

    axios.get('/property/similar-properties', { params: additionalParameters })
    .then(function(response){
      response = response.data;
      if (response.html_body) {
        document.getElementsByClassName('similarProperties-sec')[0].style.display = "block";
          var _el = document.getElementById('search-prop-list');
          if(_el)
              _el.innerHTML = response.html_body;
      } else
        var _el = document.getElementsByClassName('similarProperties-sec');
        if(_el.length)
            _el[0].style.display = "none";
    })
  }

  function copyLink(event) {
      if (event)
          copyToClipboard(event.target.getAttribute('data-href'));
      else
          copyToClipboard(SHARE_LINK_URL);
  }

  function copyToClipboard(value) {
      var aux = document.createElement("input");
      aux.setAttribute("value", value);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
  }

  function newsLetterSubmit(_element, _footer) {
    var _fields = _element.querySelectorAll('input');
    var _formObj = {};
    for (var i = 0; i < _fields.length; i++) {
      var _field = _fields[i];
      var _fName = _field.name;
      var _fValue = _field.value;
      _formObj[_fName] = _fValue;
    }
    _formObj['footer'] = _footer;
    axios.post('/newsletter', _formObj)
    .then(function(response){
      response = response.data;
      if (_footer) {
        _element.innerHTML = '<h3 class="text-center  info-link">' + response.success + '</h3>';
      } else {
          _element.style.display = "none";
          _element.innerHTML = '<h3 class="text-center  info-link">' + response.success + '</h3>';
      }

      swal(response.success);
    })
    .catch(function (error) {
      var _errorVal = error.response.data;
      var _helpBlock = document.getElementsByClassName('help-block');
      if(_helpBlock.length)
          _helpBlock[0].classList.remove('help-block');
      if (_footer){
        _element.innerHTML +=  '<label class="inputGroupLabel"> <p class="help-block" style="text-align:center;">' +  _errorVal.errors.email[0]  + '</p></label>';
      }
        else{
          var _parentElement = _element.querySelectorAll(`input[name^="${fieldName}"]`);
          if(_parentElement.length){
            if(_parentElement[0].offsetWidth > 0 || _parentElement[0].offsetHeight > 0){
              _parentElement = _parentElement[0].parentNode;
            }
          }
          _parentElement.insertAdjacentHTML('afterend', '<p class="help-block">' + _errorVal.message + '</p>');
        }
    })
  }

  // Register page

  function showHideRegisterDivs(_this) {
    var adrressField = document.getElementById('addressField');
      if (_this.checked)
      {
        if(addressField)
              adrressField.style.display = "block";
      }
      else{
        if(addressField)
            adrressField.style.display = "none";
      }
  }

  function initSubmitMap(_prop) {
      var _latitude = body.getAttribute('data-map-lat');
      var _longitude = body.getAttribute('data-map-lng');
      var _zoom = body.getAttribute('data-map-zoom');
      var mapCenter = new google.maps.LatLng(_latitude, _longitude);
      var mapOptions = {
          zoom: (_zoom ? parseInt(_zoom) : 10),
          center: mapCenter,
          disableDefaultUI: false,
          //scrollwheel: false,
          styles: getMapStyles(),
      };
      var mapElement = document.getElementById('submit-map');

      var input      = /** @type {HTMLInputElement} */ (document.getElementById('address-autocomplete'));

      if(mapElement)
      {
        var map = new google.maps.Map(mapElement, mapOptions);
        var marker = new MarkerWithLabel({
          position: mapCenter,
          clickable: _prop ? false : true,
          map: map,
          icon: '/assets/img/placeholder_32px.png',
          labelAnchor: new google.maps.Point(50, 0),
          draggable: (typeof _prop !== 'undefined' && _prop) ? false : true
        });

        mapElement.classList.remove('fade-map');

        google.maps.event.addListener(map, 'click', function(event) {

          var positionclick = event.latLng;
          marker.setPosition(positionclick);
          geocodePosition(marker.getPosition());

          document.getElementById('latitude').value = event.latLng.lat();
          document.getElementById('longitude').value = event.latLng.lng();

        });

        google.maps.event.addListener(marker, "mouseup", function(event) {

          geocodePosition(marker.getPosition());

          document.getElementById('latitude').value = this.position.lat();
          document.getElementById('longitude').value = this.position.lng();

        });
      }

      if (input) {

          var autocomplete = new google.maps.places.Autocomplete(input);

          if(mapElement)
            autocomplete.bindTo('bounds', map);

          google.maps.event.addListener(autocomplete, 'place_changed', function() {

              var place = autocomplete.getPlace();

              if (!place.geometry) return;

              if(typeof map !== 'undefined')
              {
                if (place.geometry.viewport)
                  map.fitBounds(place.geometry.viewport);
                else {
                  map.setCenter(place.geometry.location);
                }
              }

              if(marker)
              {
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);

                document.getElementById('latitude').value = marker.getPosition().lat()
                document.getElementById('longitude').value = marker.getPosition().lng()
              }

              mapupdateCityAndZip('', place.address_components);

              if(document.getElementById('user-detail-geo_lat'))
              {
                document.getElementById('user-detail-geo_lat').value = place.geometry.location.lat();
                document.getElementById('user-detail-geo_lng').value = place.geometry.location.lng();
              }

              if(document.getElementById('your_geo_lat'))
              {
                document.getElementById('your_geo_lat').value = place.geometry.location.lat();
                document.getElementById('your_geo_lng').value = place.geometry.location.lng();
              }

              var address = '';
              if (place.address_components) {
                  address = [
                      (place.address_components[0] && place.address_components[0].short_name || ''),
                      (place.address_components[1] && place.address_components[1].short_name || ''),
                      (place.address_components[2] && place.address_components[2].short_name || '')
                  ].join(' ');
              }

              input.value = address;
              document.getElementById('address-autocomplete').value = address;
          });

          google.maps.event.addDomListener(input, 'keydown', function(e) {
            var _pacContainers = document.getElementsByClassName('pac-container');
            if(_pacContainers.length){
              for (var i = 0; i < _pacContainers.length; i++) {
                if (e.keyCode == 13 && (_pacContainers[i].offsetWidth > 0 || _pacContainers[i].offsetHeight > 0))
                e.preventDefault();
                break;
              }
            }
          });
          var _userDetailAddress = document.getElementById('user-detail-form-address');
          if(_userDetailAddress){
            _userDetailAddress.addEventListener('keyup', function(e){
              mapAutoComplete('user-detail-form-address', map, marker);
            })
          }
          var _yourAddress = document.getElementById('your_address');
          if(_yourAddress){
            _yourAddress.addEventListener('keyup', function(e){
              mapAutoComplete('your_address', map, marker);
            })
          }
          var _yourCity = document.getElementById('your_city');
          if(_yourCity){
            _yourCity.addEventListener('keyup', function(e){
              mapAutoComplete('your_city', map, marker);
            })
          }
          var _zipCode = document.getElementById('zip_code');
          if(_zipCode){
            _zipCode.addEventListener('keyup', function(e){
              mapAutoComplete('zip_code', map, marker);
            })
          }
          var _yourState = document.getElementById('your_state');
          if(_yourState){
            _yourState.addEventListener('keyup', function(e){
              mapAutoComplete('your_state', map, marker);
            })
          }
      }
  }
  function geocodePosition(pos) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      latLng: pos
    }, function(responses) {
      var addressComponents = responses[1]['address_components'];
      address = responses[1]['formatted_address'];

      if (typeof _modal !== "undefined" && _modal)
        document.getElementById('user-detail-form-address').value = address;
      else {
        document.getElementById('address-autocomplete').value = address;
        document.getElementById('your_address').value = address;
        document.querySelectorAll('input[name="address_1"]')[0].value = address;
      }

      mapupdateCityAndZip('', addressComponents);
    });
  }

  function mapAutoComplete(IdName, map, marker) {
      var input = /** @type {HTMLInputElement} */ (document.getElementById(IdName));
      var autocomplete = new google.maps.places.Autocomplete(input);

      if(typeof map !== "undefined" && map)
        autocomplete.bindTo('bounds', map);

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.geometry) return;

          if(typeof map !== "undefined" && map)
          {
            if (place.geometry.viewport)
              map.fitBounds(place.geometry.viewport);
            else {
              map.setCenter(place.geometry.location);
            }

            map.setZoom(14);
          }

          if(document.getElementById('user-detail-geo_lat'))
          {
            document.getElementById('user-detail-geo_lat').value = place.geometry.location.lat();
            document.getElementById('user-detail-geo_lng').value = place.geometry.location.lng();
          }

          if(document.getElementById('your_geo_lat'))
          {
            document.getElementById('your_geo_lat').value = place.geometry.location.lat();
            document.getElementById('your_geo_lng').value = place.geometry.location.lng();
          }


          if(typeof marker !== "undefined" && marker)
          {
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
          }

          mapupdateCityAndZip('', place.address_components);

          var address = '';
          if (place.address_components) {
              address = [
                  (place.address_components[0] && place.address_components[0].short_name || ''),
                  (place.address_components[1] && place.address_components[1].short_name || ''),
                  (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
          }
      });

      google.maps.event.addDomListener(document.getElementById(IdName), 'keydown', function(e) {
        var _pacContainer = document.getElementsByClassName('pac-container');
        if(_pacContainers.length){
          for (var i = 0; i < _pacContainers.length; i++) {
            if (e.keyCode == 13 && (_pacContainers[i].offsetWidth > 0 || _pacContainers[i].offsetHeight > 0))
            e.preventDefault();
            break;
          }
        }
      });
  }

  function mapupdateCityAndZip(IdName, addressComponents) {
      var address = '';
      checkZipCode = checkCity = false;
      for (var i = 0; i < addressComponents.length; i++) {

          for (var j = 0; j < addressComponents[i].types.length; j++) {

              if (IdName) {
                  //update zipcode
                  if (IdName == 'zip_code' && addressComponents[i].types[j] == "postal_code") {
                      document.getElementById(IdName).value = addressComponents[i].long_name;
                      checkZipCode = true;
                  } else {
                      if (!checkZipCode)
                          checkZipCode = false;
                  }

                  //update city
                  if (IdName == 'your_city' && addressComponents[i].types[j] == "locality") {
                    document.getElementById(IdName).value = addressComponents[i].long_name;
                      checkCity = true;
                  } else {
                      if (!checkCity)
                          checkCity = false;
                  }

              } else {
                  if (addressComponents[i].types[j] == "postal_code") {
                    if(document.getElementById('user-detail-form-zip'))
                      document.getElementById('user-detail-form-zip').value = addressComponents[i].long_name;

                    if(document.getElementById('zip_code'))
                      document.getElementById('zip_code').value = addressComponents[i].long_name;
                      checkZipCode = true;
                  } else {
                      if (!checkZipCode)
                          checkZipCode = false;
                  }
                  if (addressComponents[i].types[j] == "locality") {
                    if(document.getElementById('user-detail-form-city'))
                      document.getElementById('user-detail-form-city').value = addressComponents[i].long_name;

                    if(document.getElementById('your_city'))
                      document.getElementById('your_city').value = addressComponents[i].long_name;
                      checkCity = true;
                  } else {
                      if (!checkCity)
                          checkCity = false;

                  }
              }

              //update state
              if (addressComponents[i].types[j] == "administrative_area_level_1") {
                if(document.getElementById('address-map-state'))
                  document.getElementById('address-map-state').value = addressComponents[i].long_name;

                if(document.getElementById('your_state'))
                  document.getElementById('your_state').value = addressComponents[i].long_name;
              }

              //update country
              if (addressComponents[i].types[j] == "country") {
                  country = addressComponents[i].short_name;
                  countryLong = addressComponents[i].long_name;

                  if(document.getElementById('user-detail-form-country'))
                    document.querySelectorAll(`#user-detail-form-country option[data-name="${country}"]`)[0].setAttribute('selected',true);

                  if(document.getElementById('your_country'))
                  {
                    if(document.querySelectorAll(`#your_country option[data-name="${country}"]`).length)
                      document.querySelectorAll(`#your_country option[data-name="${country}"]`)[0].setAttribute('selected',true);
                    else
                      document.getElementById('your_country').value = countryLong;
                  }
              }
          }
      }
      if (!checkZipCode) {
        if(document.getElementById('user-detail-form-zip'))
          document.getElementById('user-detail-form-zip').value = '';

        if(document.getElementById('zip_code'))
          document.getElementById('zip_code').value = '';
      }
      // empty city field if city not found
      if (!checkCity) {
        if(document.getElementById('user-detail-form-city'))
          document.getElementById('user-detail-form-city').value = '';

        if(document.getElementById('your_city'))
          document.getElementById('your_city').value = '';
      }

  }
  document.addEventListener('DOMContentLoaded', function() {
      loadIncludeFile();

      if (!body.classList.contains('auth-pages'))
          getSiteData();

      if (_pageView)
      {
        if(_pageView == 'gallery')
          document.getElementsByTagName('body')[0].classList.add('filled-body');
          updateFiltersHtml();

          ajaxRequest.setAttribute('data-first-load', 0);
      }

      if (typeof map == 'undefined' && typeof autocomplete !== 'undefined') {
          initSearchAutocomplete(false);
      }

      var lightgalleryEls = document.getElementsByClassName('lightgallery');

      [].forEach.call(lightgalleryEls, (lightgalleryEl) => {
          lightGallery(lightgalleryEl);
      });

      updateImages();

      if (document.getElementById('address-autocomplete'))
          google.maps.event.addDomListener(window, 'load', initSubmitMap());

      setTimeout(function(){
        if (typeof document.getElementById('slider-items') !== 'undefined' && document.getElementById('slider-items'))
          getLogos();
      },5000);


  }, false);

  document.onkeydown = function(evt) {
      evt = evt || window.event;
      var isEscape = false;
      if ("key" in evt) {
          isEscape = (evt.key == "Escape" || evt.key == "Esc");
      } else {
          isEscape = (evt.keyCode == 27);
      }
      if (isEscape) {
          closePropModal();
          window.history.pushState("object or string", document.title, window.locationUrl);
      }
  };

  function getSiteData() {
    axios.get('/get-site-data', {
      params: {
        locale: _locale,
        lang: _currentLang,
        currency: _selectedCurrency
      }
    })
    .then(function(response) {
      response = response.data;

      document.getElementById('submenu_language').innerHTML = response.language;
      document.getElementById('submenu_currency').innerHTML = response.currency;

      var submenu = document.getElementById("submenu_blogs");
      var submenuResponsive = document.getElementById("article_menu_collapse");
      if (response.blogs) {
          submenu.innerHTML = response.blogs;
          submenuResponsive.innerHTML = response.blogs_collapse;
          document.getElementById('article_menu_head').classList.remove('hidden');
      } else {
          submenu.remove();
          submenuResponsive.remove();
      }

      var headerNode = document.getElementById("header_menu");
      var accordionNode = document.getElementById("accordion");
      var footerNode = document.getElementById("blogs_with_links");
      if(headerNode)
        headerNode.insertAdjacentHTML('afterbegin', response.menu);
      if(accordionNode)
        accordionNode.insertAdjacentHTML('afterbegin', response.collapse);

      var list_articles = document.getElementById('list_articles');

      if (typeof(list_articles) !== 'undefined' && list_articles !== null)
          getLandingPageArticles();

      var articlesList = document.getElementById('articles');

      if (typeof(articlesList) !== 'undefined' && articlesList !== null)
          paginateArticles({
              'locale': _locale,
              'lang': _currentLang
          });

      if (typeof(footerNode) !== 'undefined' && footerNode !== null) {
          footerNode.innerHTML = response.footer;
          footerNode.style.display = 'block';
      }

      var landingFilterItem = document.getElementsByClassName('landingFilterItem');

      if (typeof(landingFilterItem) !== 'undefined' && landingFilterItem.length)
          updateLandingFiltersHtml();

      if (typeof _sections !== 'undefined' && document.getElementsByClassName('article-page').length) {

          newArticles({
              'locale': _locale,
              'sections': _sections,
              'articleId': _articleId,
              'lang': _currentLang
          });

          if (typeof _lpv !== 'undefined') getSimilarProperties({
              'locale': _locale,
              'lpv': _lpv
          });

          countRating();
      }

      updateImages();
    });
  }

  window.onscroll = function() {
      var sticky = document.getElementsByClassName('headerSection')[0];

      if (_pageView && _pageView == 'gallery')
          var sticky = document.getElementsByClassName('searchTopSection')[0];
      var scrollTop = _supportPageOffset ? window.pageYOffset : _isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
      if(sticky){
        if (scrollTop >= 10)
          sticky.classList.add('fixed');
        else {
          sticky.classList.remove('fixed');
          body.classList.remove('fixedFilter');
        }
      }

      searchListScrollRequest()
      showHideScrollBtn(window.pageYOffset);

      if (document.getElementById('articles')) {
          if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 1500 && window.pageYOffset >= window.prevScrollTop) {
              if (window.requestSent) {
                  paginateArticles({
                      'page': _page,
                      'locale': _locale,
                      'lang': _currentLang
                  });
              }
          }
      }
  };

  function loadIncludeFile() {
      _cssFiles.forEach(function(_cssFile) {
          var _element = document.createElement('link');
          _element.setAttribute("type", "text/css");
          _element.setAttribute("href", _cssFile);
          _element.setAttribute("rel", "stylesheet");
          var y = document.getElementsByTagName('link');
          _appendElement = y.length - 1;
          var x = y[_appendElement];
          x.after(_element, x);
      });

      _jsFiles.forEach(function(_jsFile) {
          var _element = document.createElement('script');
          _element.type = 'text/javascript';
          _element.src = _jsFile;
          //  _element.async=true;
          var y = document.getElementsByTagName('script');
          _appendElement = y.length - 1;
          var x = y[_appendElement];
          x.parentNode.insertBefore(_element, x);
      });
  }

  function showPropModalNew(propId) {
      var _loader = document.getElementById('loadingModal');
      var _modal = document.getElementById('propertyModal');
      _loader.style.display = 'block';
      axios.get(`/property/info/${propId}`, {
        params: {
          'locale': _locale,
          'version': 'v1'
        }
      })
      .then(function(response){
        response = response.data;
          if (response.length == 0) {
              alert('Something went wrong!');
              return;
          }

          _modal.classList.add('in');
          _modal.style.display = 'block';

          document.getElementById('property-modal-body').innerHTML = response['html_body'];
          _loader.style.display = 'none';

          updateImages();
          showDetailDivs(true);

          var lightgalleryEls = document.getElementsByClassName('lightgallery');

          Array.prototype.forEach.call(lightgalleryEls, (lightgalleryEl) => {
              lightGallery(lightgalleryEl);
          })

          updateModalBookmark('bookmark-modal', propId);

          if (body.classList.contains('mbl')) {
              body.classList.remove('mbl');
          } else {
              body.classList.add('mbl');
          }

          _propertyModal = true;
          var _detailPageUrl = document.getElementsByClassName('expandDetail')[0].getAttribute('href');
          var _detailPageUrl = `${_detailPageUrl}?popup=true`;

          window.history.pushState("object or string", document.title, _detailPageUrl);

          saveViewLog(propId,6);

          if (typeof checkSendAnalyticsEvent !== 'undefined')
            ga('send', 'event', "User", "Viewed Property", "Property PopUpview", propId);
      });
  }

  function updateModalBookmark(_class, propId) {
      _this = document.getElementsByClassName(_class)[0];
      if (uId)
          _this.href = 'javascript:void(0)';
      else
          _this.href = '/' + _locale + '/login?bookmark=' + _this.getAttribute('data-prop-id');

      var bookmarkAdded = document.querySelectorAll(`.bookmark-added[data-prop-id="${propId}"]`);

      if (bookmarkAdded.length) {
          _this.setAttribute('data-bookmark-state', 'added');
          _this.classList.add('bookmark-added');
          _this.querySelectorAll('.title-add')[0].textContent = _this.querySelectorAll('.title-add')[0].getAttribute('data-saved');
      } else {
          _this.setAttribute('data-bookmark-state', 'empty');
          _this.classList.remove('bookmark-added');
          _this.querySelectorAll('.title-add')[0].textContent = _this.querySelectorAll('.title-add')[0].getAttribute('data-save-this');
      }
  }

  function closePropModal() {
      var _modal = document.getElementById('propertyModal');
      if (_modal && _modal.classList.contains('in') && !document.getElementsByClassName('lg-backdrop').length) {
          document.getElementById('property-modal-body').innerHTML = '';
          _modal.classList.remove('in');
          _modal.style.display = 'none';
          body.classList.remove('mbl');
      }
  }

  function updateImages() {
      var divs = document.querySelectorAll('div[data-bckgrnd-src]');
      var imgEls = document.querySelectorAll('img[data-src]');
      [].forEach.call(divs, (div) => {
          var _src = div.getAttribute('data-bckgrnd-src');
          if (_src != '') {
              var _path = `linear-gradient(100deg,rgba(255,255,255,0),rgba(171,146,146,0.2)),url(${_src})`;
              div.style.backgroundImage = _path;
          }
      });

      [].forEach.call(imgEls, (imgEl) => {
          var _src = imgEl.getAttribute('data-src');
          var _prevSrc = imgEl.getAttribute('src');
          if (_src != '' && (_prevSrc == '' || !_prevSrc))
              imgEl.src = _src;
      });
  }

  function getMapStyles() {
      var $main_color = '#0092fb',
          $saturation = 0,
          $brightness = 0;
      return [{
              elementType: "labels",
              stylers: [{
                  saturation: $saturation
              }]
          },
          {
              featureType: "poi",
              elementType: "labels",
              stylers: [{
                  visibility: "on"
              }]
          },
          {
              featureType: 'road.highway',
              elementType: 'labels',
              stylers: [{
                  visibility: "off"
              }]
          },
          {
              featureType: "road.local",
              elementType: "labels",
              stylers: [{
                  visibility: "off"
              }]
          },
          {
              featureType: "road.arterial",
              elementType: "labels",
              stylers: [{
                  visibility: "off"
              }]
          },
          {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{
                  visibility: "on"
              }]
          },
          {
              featureType: "transit",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: $brightness
              }, {
                  saturation: $saturation
              }]
          },
          {
              featureType: "poi",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: $brightness
              }, {
                  saturation: $saturation
              }]
          },
          {
              featureType: "poi.government",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: $brightness
              }, {
                  saturation: $saturation
              }]
          },
          {
              featureType: "poi.attraction",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: $brightness
              }, {
                  saturation: $saturation
              }]
          },
          {
              featureType: "poi.business",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: $brightness
              }, {
                  saturation: $saturation
              }]
          },
          {
              featureType: "transit",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: $brightness
              }, {
                  saturation: $saturation
              }]
          },
          {
              featureType: "transit.station",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: $brightness
              }, {
                  saturation: $saturation
              }]
          },
          {
              featureType: "landscape",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: $brightness
              }, {
                  saturation: $saturation
              }]
          },
          {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: 0
              }, {
                  saturation: 0
              }]
          },
          {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{
                  hue: $main_color
              }, {
                  visibility: "on"
              }, {
                  lightness: 0
              }, {
                  saturation: 0
              }]
          },
          {
              featureType: "water",
              elementType: "geometry",
              stylers: [{
                  visibility: "on"
              }]
          },
          {
              featureType: "administrative.land_parcel",
              elementType: "labels",
              stylers: [{
                  "visibility": "on"
              }]
          }
      ]
  }

  function updateLandingFiltersHtml() {
      var _cacheKeys = {};
      var folder = 'landing';
      var elements = document.getElementsByClassName('landingFilterItem');

      Array.prototype.forEach.call(elements, function(element) {
        _cacheKeys[element.getAttribute('data-type')] = element.getAttribute('data-key');
      });
      axios.get('/get-filters', {
        params: {
          search_type: _searchTypes,
          cacheKeys: _cacheKeys,
          siteLang: _siteLang,
          landingPage: 'landing'
        }
      })
      .then(function(response) {
        response = response.data;
        if (response.views) {
          let _cacheKeys = JSON.parse(response.request.cacheKeys);
          Object.keys(_cacheKeys).forEach(function(type) {
            response.request.search_type.forEach((folder) => {
              let _class = `${folder}_${type}`;
              let _divs = document.getElementsByClassName(_class);
              let _len = _divs.length;
              if (_len) {
                for (let i = 0; i < _len; i++) {
                  _divs[i].innerHTML = response.views[type][folder];
                }
              }
            })
          });
        }
      });
  }

  function updateFiltersHtml() {
    var _cacheKeys = {};
    var elements = document.getElementsByClassName('filterItem');

    if (elements.length) {
        Array.prototype.forEach.call(elements, function(element) {
          _cacheKeys[element.getAttribute('data-type')] = element.getAttribute('data-key');
        });
    }

    axios.get('/get-filters', {
      params: {
        search_type : _searchTypes,
        cacheKeys   : _cacheKeys,
        siteLang    : _siteLang
      }
    })
    .then(function(response) {
        response = response.data;
        if (response.views) {
          let _cacheKeys = JSON.parse(response.request.cacheKeys);
          let _searchTypes = response.request.search_type;
            Object.keys(_cacheKeys).forEach(function(type) {
              _searchTypes.forEach((folder) => {
                let _folderId = folder == 'new' ? 'new_search' : folder;
                let _el = document.getElementById(`${_folderId}_${type}`);
                if(_el)
                {
                  let _elId = _el.getAttribute('id');
                  if (_elId) {
                    _el.innerHTML = response.views[type][folder];
                  }
                }
              })
            });
            window.updateUrl = true;
        }
    });
  }

  function getLandingPageArticles(event) {
      var _parentNode = document.getElementById("list_articles");
      var _prevCatId = '';
      var _element = document.querySelectorAll('.articleCatList.active');
      if (_element.length && _element[0].getAttribute('data-cat-id')) {
        _prevCatId = _element[0].getAttribute('data-cat-id');
      }
      var _seemoreEl = document.getElementsByClassName('seeMoreArticles')[0];
      var _loader = document.getElementsByClassName('article-loader')[0];
      var _noArticles = document.getElementById('no_articles');

      _loader.style.display = 'block';
      _noArticles.style.display = 'none';

      if (event) {
          var articleCatLists = document.getElementsByClassName('articleCatList');
          [].forEach.call(articleCatLists, (articleCatList) => {
              articleCatList.classList.remove('active');
          });
          event.target.parentNode.classList.add('active');
      }

      var _catId = '';
      var _catIdElement = document.querySelectorAll('.articleCatList.active');
      if(_catIdElement.length && _catIdElement[0].getAttribute('data-cat-id')){
        _catId = _catIdElement[0].getAttribute('data-cat-id');
      }
      _url = _catId ? '/getarticle/' + _catId : '/getarticle';

      var _next = _seemoreEl.getAttribute('data-next');
      _page = _prevCatId == _catId && _next > 0 ? _next : 1;
      axios.get(_url, {
        params: {
          locale  : _locale,
          page    : _page,
          lang    : _currentLang,
        }
      })
      .then(function(response) {
        response = response.data;
        if (response && response.articles > 0) {
            if (response.nextPage) {
                _seemoreEl.setAttribute('data-next', response.nextPage);
                _seemoreEl.style.display = 'block';
            } else {
                _seemoreEl.setAttribute('data-next', 0);
                _seemoreEl.style.display = 'none';
            }

            document.getElementsByClassName('article-Sec')[0].style.display = 'block';
            document.getElementsByClassName('article-list-container')[0].style.display = 'block';

            if (_page == 1)
                _parentNode.innerHTML = response.listArticles;
            else
                _parentNode.insertAdjacentHTML('beforeend', response.listArticles);

            updateImages();
        } else {
            _parentNode.innerHTML = '';
            _noArticles.style.display = 'block';
        }

        _loader.style.display = 'none';
      });
  }

  function paginateArticles(additionalParameters) {
      var parentNode = document.getElementById("articles");

      if (!window.requestSent) return;
      window.requestSent = false;

      var _loader = document.getElementById('loading');
      _loader.style.display = 'block';

      axios.get(_url, { params : additionalParameters })
      .then(function(response) {
        var nomorearticle = document.getElementById('nomorearticle');

        if (nomorearticle)
            nomorearticle.remove();

        if (response.data.html) {
            parentNode.insertAdjacentHTML('beforeend', response.data.html);
            _page = _page + 1;
            updateImages();
            window.requestSent = true;
        } else {
            _loader.remove();
            html = '<div id="nomorearticle" class="text-center" style="display:block;margin-top:15px;width:100%;"><i class="fa fa-meh-o"></i> ' + _noMoreArticles + '</div>'
            parentNode.insertAdjacentHTML('beforeend', html);
            window.requestSent = false;
        }
        _loader.style.display = 'none';
      });
  }

  function newArticles(additionalParameters) {
      axios.get('/article/other-posts', { params: additionalParameters })
        .then(function(response) {
          let _newPostNode = document.getElementById('newPosts');
          let _otherArticleNode = document.getElementById('otherArticles');
          if (response.data.newPosts) {
              _newPostNode.innerHTML = response.data.newPosts;
              _newPostNode.classList.remove('hidden');
          }

          if (response.data.otherArticles) {
              _otherArticleNode.innerHTML = response.data.otherArticles;
              _otherArticleNode.classList.remove('hidden');
          }
        });

  }

  var landingForm = document.querySelector('form.search-form');
  if (typeof landingForm !== 'undefined' && landingForm) {
      landingForm.addEventListener('submit', function() {
          if (typeof checkSendAnalyticsEvent !== 'undefined')
              fbSearchEvent('search');
      });
  }

  function setBoundsData(bound) {
      var bounds = typeof bound !== 'undefined' ? bound : (typeof map !== 'undefined' ? map.getBounds() : '');
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();

      var lats = sw.lat().toFixed(4) + ',' + ne.lat().toFixed(4);
      var lngs = sw.lng().toFixed(4) + ',' + ne.lng().toFixed(4);

      if (document.querySelector('input[name="lats"]')) {
          document.querySelector('input[name="lats"]').value = lats;
          document.querySelector('input[name="lngs"]').value = lngs;
      }

      bounds = {
          'lats': {
              'n': sw.lat().toFixed(4),
              's': ne.lat().toFixed(4)
          },
          'lngs': {
              'n': sw.lng().toFixed(4),
              's': ne.lng().toFixed(4)
          },
          'zoom': typeof map !== 'undefined' ? map.getZoom() : 8
      };

      window.bounds = bounds;
  }

  function getAddressComponents(place) {
      var components = {
          'lat': place.geometry.location.lat(),
          'lng': place.geometry.location.lng(),
          'place': place.place_id,
          'address': input.value
      };

      addressComponents = place.address_components;

      for (var i = 0; i < addressComponents.length; i++) {

          for (var j = 0; j < addressComponents[i].types.length; j++) {

              if (addressComponents[i].types[j] == "locality")
                  components['city'] = addressComponents[i].long_name;

              if (addressComponents[i].types[j] == "country") {
                  //update country
                  components['country'] = addressComponents[i].long_name;
                  components['iso'] = addressComponents[i].short_name;
              }
          }
      }

      return Object.keys(components).length ? components : false;
  }

  function getLogos() {
    axios.get('/get-logos', {
      params: {
        locale: _locale,
        lang: _currentLang,
        currency: _selectedCurrency
      }
    })
    .then(function(response) {
      response = response.data;
        updateImages();

      var slideIndex = 7;
      var initialindex = 0;
      var myHTML = "";
      var right = 0;
      var maxMargin;
      var jumpMargin = 260;
      function slideTest() {
        response.logosdata.startPageAds.forEach(function(value, Key) {
            myHTML += `<div class="slick-slide slick-active" data-slick-index="49" aria-hidden="false" style="width: 186px;"><div><div class="slider_item li-style" title="P2Mproperties" style=" display: inline-block; width:200px; margin: 0 0 2px 0;"><a><div class=" item_img"><img src="${value.image_path}"/></div></a></div></div></div>`;
        })
        document.getElementById('testContainer').innerHTML = myHTML;
      }
      document.querySelector('.carousel.bannerBotm-logo').style.display = "block";
      slideTest();


      function setWidth(){
        var boxwidth = document.querySelector(".li-style").offsetWidth;
        var displaywidth = document.querySelector(".row").offsetWidth;
        var displayheight = document.querySelector(".row").offsetHeight;
        var children = document.querySelectorAll(".ul-test > .li-style").length;
        var outerboxwidth = children * boxwidth + (children*10);
        document.querySelector(".ul-test").style.width = outerboxwidth+"px";
        maxMargin = outerboxwidth - displaywidth;
      }

      function slideLeft(event){
        if(typeof event !== 'undefined') {
          var rowcont = document.querySelector(".ul-test");
          if(right <= -maxMargin){
            event.preventDefault();
          }
          else{
            right -= jumpMargin;
          }
          rowcont.style.marginLeft = right+"px";
        }
      }

      function slideRight(event){
        var rowcont = document.querySelector(".ul-test");
        if(right==0){
          event.preventDefault();
        }
        else if(right >= maxMargin){
          event.preventDefault();
        }
        else{
           right += jumpMargin;
        }
        rowcont.style.marginLeft = right+"px";
      }

      window.onload=setWidth;
      setInterval(function() {
        slideLeft(event)
      },  3000);
    });
  }

  function removeFilters(event) {
      var filterType = event.target.parentNode.getAttribute('filter-type');
      var fieldName = event.target.parentNode.getAttribute('data-field-name');

      if (filterType == 'loc') {
          delete window.filters['loc'];

          clearAutocompleteField();
          return;

      } else {
          var _inputs = document.querySelectorAll(`input[value=${filterType}]:checked,select[name=${filterType}]`);

          [].forEach.call(_inputs, (_input) => {
              if (_input.classList.contains('change-update')) {
                  _input.checked = false;
                  _input.parentNode.classList.remove('active');
              }

              if (_input.classList.contains('change-select'))
                  _input.selectedIndex = 0;
          })

          if(_inputs.length){
            _inputs[0].dispatchEvent(new Event('change'));
            return;
          }

      }
  }

  function changedUpdate(event) {
      showFilters();
  }

  function changedSelect(event) {
      showFilters();

      toggleFiltersSelectbox(event.target);
  }

  function showFilters() {
      html = '';
      window.filters = {};
      if(activeFilters){
        var checkboxes = activeFilters.querySelectorAll(`.change-update:checked`);
        if(typeof checkboxes  !== 'undefined' && checkboxes.length){
          [].forEach.call(checkboxes, (checkbox) => {
            var name = checkbox.name;
            var val = checkbox.value;
            var text = checkbox.parentNode.getElementsByTagName('span')[0].innerText;
            window.filters[val] = [name, text];
          });
        }

        var selects = activeFilters.querySelectorAll(`.change-select`);
        if(selects.length){
          [].forEach.call(selects, (select) => {
            if (select.selectedIndex !== 0) {
              var name = select.name;
              var val = select.value;
              var dataName = select.getAttribute('data-name');
              window.filters[name] = [name, val, dataName];
            }
          });
        }

      }

      var _searchFields = Array.prototype.slice.call(document.querySelectorAll('.search-address')).filter(function(item, index) {
          return item.style.display != "none"
      });

      [].forEach.call(_searchFields, (_searchField) => {
          if (_searchField.value != '') {
              var id = _searchField.id;
              var val = _searchField.value;
              var dataName = _searchField.getAttribute('data-name');
              window.filters['loc'] = [id, val, dataName];
          }
      });


      for (var type in window.filters) {
          html += addFilterHtml(type, window.filters[type]);
      }

      var showLocNode = document.getElementById("show-loc");
      if (typeof(showLocNode) !== 'undefined' && showLocNode) {
          showLocNode.innerHTML = html;
          if (html != '')
              showLocNode.style.display = 'block';
          else
              showLocNode.style.display = 'none';
      }

      if (_pageView && typeof sendRequest !== 'undefined') {
          window.firstCall = true;
          window.requestSent = true;
          sendRequest(true, updateMap, false, _pageView);
      } else
        updateLandingURL();
  }

  function toggleFiltersSelectbox(_this) {
      var getId = {
          'price-min': 'price-max',
          'monthly-price-min': 'monthly-price-max',
          'sqm-price-min': 'sqm-price-max',
          'rooms-min': 'rooms-max',
          'living-sqm-min': 'living-sqm-max',
          'gardens-sqm-min': 'gardens-sqm-max',
          'search-price-min': 'search-price-max',
          'search-monthly-price-min': 'search-monthly-price-max',
          'search-sqm-price-min': 'search-sqm-price-max',
          'search-rooms-min': 'search-rooms-max',
          'search-living-sqm-min': 'search-living-sqm-max',
          'search-gardens-sqm-min': 'search-gardens-sqm-max',
          'new_search-price-min': 'new_search-price-max',
          'new_search-monthly-price-min': 'new_search-monthly-price-max',
          'new_search-sqm-price-min': 'new_search-sqm-price-max',
          'new_search-rooms-min': 'new_search-rooms-max',
          'new_search-living-sqm-min': 'new_search-living-sqm-max',
          'new_search-gardens-sqm-min': 'new_search-gardens-sqm-max',
      };

      var id = _this.getAttribute('id');

      var index = _this.selectedIndex;

      var _refId = getId[id];


      if (typeof(_refId) !== 'undefined') {
          _refId = document.getElementById(_refId);

          var options = _refId.getElementsByTagName("option");

          for (var i = 0; i < index; i++) {
              if (typeof options[i] !== 'undefined')
                  options[i].disabled = true;
          }

          for (var i = index; i < options.length; i++) {
              if (typeof options[i] !== 'undefined')
                  options[i].disabled = false;
          }
      }

      var getId = {
          'price-max': 'price-min',
          'monthly-price-max': 'monthly-price-min',
          'sqm-price-max': 'sqm-price-min',
          'rooms-max': 'rooms-min',
          'living-sqm-max': 'living-sqm-min',
          'gardens-sqm-max': 'gardens-sqm-min',
          'search-price-max': 'search-price-min',
          'search-monthly-price-max': 'search-monthly-price-min',
          'search-sqm-price-max': 'search-sqm-price-min',
          'search-rooms-max': 'search-rooms-min',
          'search-living-sqm-max': 'search-living-sqm-min',
          'search-gardens-sqm-max': 'search-gardens-sqm-min',
          'search-price-max': 'search-price-min',
          'new_search-monthly-price-max': 'new_search-monthly-price-min',
          'new_search-sqm-price-max': 'new_search-sqm-price-min',
          'new_search-rooms-max': 'new_search-rooms-min',
          'new_search-living-sqm-max': 'new_search-living-sqm-min',
          'new_search-gardens-sqm-max': 'new_search-gardens-sqm-min',
      };

      _refId = getId[id];

      if (typeof(_refId) !== 'undefined') {
          _refId = document.getElementById(_refId);

          var options = _refId.getElementsByTagName("option");

          if (index == '0') {
              for (var i = index; i < options.length; i++) {
                  if (typeof options[i] !== 'undefined')
                      options[i].disabled = false;
              }
          } else {
              var min = index - 1;
              for (var i = index; i < options.length; i++) {
                  if (typeof options[i] !== 'undefined')
                      options[i].disabled = true;
              }
              for (var i = 0; i < index; i++) {
                  if (typeof options[i] !== 'undefined')
                      options[i].disabled = false;
              }
          }
      }

  }

  //Below is from main-search.js
  function countFilters() {

      valArray = new Array();
      var totalCount = 0;
      var fields = ['agency_id'];
      var cols = ['type', 'status', 'views', 'proximities', 'features'];
      var selects = ['price', 'size'];
      var selectCols = {};
      selectCols['price'] = ['min_price', 'max_price', 'monthly_min_price', 'monthly_max_price', 'sqm_min_price', 'sqm_max_price'];
      selectCols['size'] = ['rooms_min', 'rooms_max', 'living_min', 'living_max', 'gardens_min_sqm', 'gardens_max_sqm'];

      cols.forEach(function(col) {
          count = 0;
          var text = '';
          var style = 'none';
          var elements = activeFilters.querySelectorAll(`input[name^="${col}"]:checked`);

          if (elements) count = elements.length;
          if (count > 0) {
              text = count;
              style = 'inline-block';
          }

          if (activeFilters.querySelectorAll(`input[name^="${col}"]`).length) {
              var bubble = activeFilters.querySelectorAll(`input[name^="${col}"]`)[0].closest('.filterDD').querySelector('.filter-count-bubble');
              bubble.innerHTML = text;
              bubble.style.display = style;
          }

          totalCount += count;
      });

      selects.forEach(function(select) {
          var count = 0;
          var text = '';
          var style = 'none';

          selectCols[select].forEach(function(col, nameKey) {
              var elements = activeFilters.querySelectorAll(`select[name="${col}"]`);
              [].forEach.call(elements, function(el) {
                  if (el.selectedIndex > 0)
                      count++;
              });
          });

          if (count > 0) {
              text = count;
              style = 'inline-block';
          }

          if (activeFilters.querySelectorAll(`select[name="${selectCols[select][0]}"]`).length) {
              var bubble = activeFilters.querySelectorAll(`select[name="${selectCols[select][0]}"]`)[0].closest('.filterDD').querySelector('.filter-count-bubble');
              bubble.innerHTML = text;
              bubble.style.display = style;
          }
          totalCount += count;
      });

      fields.forEach(function(field) {
          count = 0;
          count = document.getElementById('form-map').querySelectorAll(`[name="${field}"]:not([value=""])`).length;
          totalCount += count;
      });

      var _searchFields = Array.prototype.slice.call(document.querySelectorAll('.search-address')).filter(function(item, index) {
          return item.style.display != "none"
      });

      [].forEach.call(_searchFields, (_searchField) => {
          var _icons = _searchField.parentNode.querySelectorAll('.zoom-search-property');
          var i = 0;
          [].forEach.call(_icons, (_icon) => {
              if (_searchField.value != '') {
                  count++;
                  _icon.style.display = 'none';
                  _searchField.parentNode.querySelectorAll('.zoom-map-property')[i].style.display = 'block';
              } else {
                  _icon.style.display = 'block';
                  _searchField.parentNode.querySelectorAll('.zoom-map-property')[i].style.display = 'none';
              }
              ++i;
          });
      });

      totalCount += count;

      var clearFilterBtns = document.getElementsByClassName('clear-all-filters-btn-new');
      var searchFlterMain = document.getElementsByClassName('searchFlterMain');

      if (totalCount > 0)
          var _style = 'block';
      else
          var _style = 'none';

      if (window.innerWidth > 767) {

          [].forEach.call(clearFilterBtns, (clearFilterBtn) => {
              clearFilterBtn.style.display = _style;
              clearFilterBtn.setAttribute('data-filter-count', totalCount);
          });
      }

      if (totalCount == 0) {
          if (searchFlterMain.length)
              searchFlterMain[0].classList.remove('resfilTgl');

          window.history.replaceState("object or string", document.title, window.location.href.split('?')[0]);
      }

      if (totalCount > 0)
          sendfiltersAjaxRequest();

      return totalCount;
  }

  function getInfoboxHtml(propertyData) {
      var infoHtml = '<div class="gm-style-iw">' +
          '<div id="iw-container">' +
          '<div class="iw-content">';

      var mainImage = propertyData['image'] ? propertyData['image'] : '/assets/img/noimageavailable.png';
      infoHtml = infoHtml + '<ul>';
      infoHtml += '<li><img src="' + mainImage + '"></li>';
      infoHtml += '<li>';
      infoHtml += '<span class="title">' + propertyData['prop_type'].replace('_', ' ') + '</span>';
      infoHtml += '<p>';
      if (propertyData['price'] !== null && propertyData['price'] > 0)
          infoHtml += '<span class="info info-price"> ' + currency + ' ' + propertyData['price'].toLocaleString() + '</span>';
      else
          infoHtml += '<span class="info info-price"> ' + priceOnRequest + '</span>';

      if (propertyData['rooms'] > 0)
          infoHtml += '<span class="info info-status">' + propertyData['rooms'] + ' ' + transRooms + '</span>';
      if (propertyData['area'] > 0)
          infoHtml += '<span class="info info-area" style="text-transform: uppercase;">' + propertyData['area'] + ' ' + propertyData['area_type'] + '</span>';

      infoHtml += '</p></li>';
      infoHtml += '</ul></div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';

      return infoHtml;
  }

  function getAdHtml(propAd) {
      var AdHtml = '<li> <div class="propertyCard">';
      AdHtml += '<div>';
      AdHtml += '<a href="' + _adPath + '" target="_blank">';
      AdHtml += '<img src="' + propAd + '" style="width: 100%;height: 100%;">';
      AdHtml += '</a>';
      AdHtml += '</div>';
      AdHtml += '</div></li>';
      return AdHtml;
  }

  function filterMarker(location_id) {
      return markers.filter(function(m) {
          return m.location_id == location_id
      });
  }

  function getMarkerLocations() {
      return markers.map(function(m) {
          return m.location_id;
      });
  }

  function setMapHeight() {
      var windowHeight = window.innerHeight;
      height = windowHeight - document.getElementsByTagName('header')[0].offsetHeight;
      height = parseInt(height) - 50;

      if (typeof map !== 'undefined' && map)
          document.getElementById('map').offsetHeight = windowHeight;
  }

  addEvent(window, "resize", function(event) {
      var windowHeight = window.innerHeight;

      if (body.offsetHeight !== windowHeight) {
          if (typeof map !== 'undefined')
              setMapHeight();
      }
  });

  function addEvent(object, type, callback) {
      if (object == null || typeof(object) == 'undefined') return;
      if (object.addEventListener) {
          object.addEventListener(type, callback, false);
      } else if (object.attachEvent) {
          object.attachEvent("on" + type, callback);
      } else {
          object["on" + type] = callback;
      }
  };

  if (typeof map !== 'undefined') {
      google.maps.event.addDomListener(window, 'load', function() {
          createHomepageGoogleMapNew(_latitude, _longitude, _zoom, null, true);
      });

      setMapHeight();
  }

  function createHomepageGoogleMapNew(_latitude, _longitude, zoom, propertyLocations, firstCall) {
      var mapMinZoom = 9;

      if (document.getElementById('map') !== null) {
          var mapCenter = new google.maps.LatLng(_latitude, _longitude);
          map = new google.maps.Map(document.getElementById('map'), {
              zoom: parseInt(!zoom ? mapMinZoom : zoom),
              minZoom: 6,
              scrollwheel: true,
              center: mapCenter,
              mapTypeControlOptions: {
                  style: google.maps.MapTypeControlStyle.DEFAULT,
                  position: google.maps.ControlPosition.LEFT_TOP
              },
              zoomControl: true,
              zoomControlOptions: {
                  position: google.maps.ControlPosition.RIGHT_CENTER
              },
              streetViewControl: true,
              streetViewControlOptions: {
                  position: google.maps.ControlPosition.RIGHT_CENTER
              },
              fullscreenControl: true,
              fullscreenControlOptions: {
                  position: google.maps.ControlPosition.RIGHT_TOP
              },
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              styles: getMapStyles()
          });
      }
      map.addListener('idle', function() {
          setBoundsData();
          if (window.firstCall) {
              initSearchAutocomplete(map);
              window.firstCall = false;
              setValuesOnDrag();
          }
      });

      map.addListener('zoom_changed', function() {
          setBoundsData();
          deleteMarkers = false;
          window.firstCall = true;
          setValuesOnDrag();
      });

      map.addListener('dragend', function() {
          setBoundsData();
          deleteMarkers = false;
          window.firstCall = true;
          setValuesOnDrag();
      });
  }

  function createLocationMarkers(geo_lat, geo_lng, location_id, markers, propertyData) {
      var pictureLabel = document.createElement("img");
      pictureLabel.src = '/assets/img/property-types/apartment.png';

      var boxText = document.createElement("div");

      var infoboxOptions = {
          content: boxText,
          disableAutoPan: false,
          // maxWidth: 200,
          pixelOffset: new google.maps.Size(-100, 0),
          zIndex: null,
          alignBottom: true,
          boxClass: "infobox-wrapper",
          enableEventPropagation: true,
          closeBoxMargin: "", //0px 0px -8px 0px
          closeBoxURL: "", ///assets/img/close-btn.png,
          infoBoxClearance: new google.maps.Size(1, 1)
      };

      var marker = new MarkerWithLabel({
          title: '',
          position: new google.maps.LatLng(geo_lat, geo_lng),
          map: map,
          icon: (propertyData['status'] == 'rent') ? '/assets/img/markers/sale-1X.png' : '/assets/img/markers/rent-1X.png',
          labelContent: pictureLabel,
          labelAnchor: new google.maps.Point(50, 0),
          labelClass: "marker-style"
      });


      // newMarkers.push(marker);
      boxText.innerHTML = getInfoboxHtml(propertyData);

      var newMarker = [marker, new InfoBox(infoboxOptions)];
      newMarker['location_id'] = location_id;
      markers.push(newMarker);
      google.maps.event.addListener(marker, 'mouseover', (function(i) {
          return function() {
              if (openedInfobox) {
                  var getMarker = filterMarker(openedInfobox);
                  if (getMarker && typeof getMarker[0] !== 'undefined') {
                      getMarker[0][1].close();
                      openedInfobox = false;
                      if (saveViewLogs) {
                          clearTimeout(RequestTimeout);
                          saveViewLogs = null;
                      }
                  }

              }
              propertyId = i;
              var getMarker = filterMarker(propertyId);
              if (getMarker && typeof getMarker[0] !== 'undefined') {
                  saveViewLogs = setTimeout(function() {
                      saveViewLog(propertyId,7,true);
                      clearTimeout(saveViewLogs);
                  }, 500);
                  getMarker[0][1].open(map, getMarker[0][0]);
                  openedInfobox = propertyId;
              }
          }
      })(location_id));

      google.maps.event.addListener(marker, 'mouseout', (function() {
          return function() {
              //do nothing
          }
      })(location_id));

      google.maps.event.addListener(marker, 'click', (function(id) {
          return function() {
              var button = document.createElement("input");
              button.setAttribute("data-id", id);
              showPropModalNew(id);
          }
      })(location_id));
  }

  function updateMapMarkers(map, propertyLocations) {
      if (propertyLocations == null) {
          return false;
      }

      var locations = propertyLocations['locations'];

      // close infobox if opened
      if (openedInfobox) {
          var getMarker = filterMarker(openedInfobox);
          if (getMarker && typeof getMarker[0] !== 'undefined')
              getMarker[0][1].close();
      }

      // remove all markers
      if (deleteMarkers) {
        if(markers.length)
        {
          for (var i = 0; i < markers.length; i++) {
            markers[i][0].setMap(null);
          }
        }
          markers = [];
      }
      // array of all markers location
      markerLocations = getMarkerLocations();

      if (locations !== false && typeof locations !== 'undefined') {
          var locLength = locations.length;
          for (var i = 0; i < locLength; i++) {
              if (markerLocations.indexOf(locations[i]['id'])) {
                  createLocationMarkers(
                      locations[i]['gt'],
                      locations[i]['gl'],
                      locations[i]['id'],
                      markers, {
                          'price': locations[i].pr,
                          'status': locations[i].tp,
                          'image': locations[i].miump ? locations[i].miump : locations[i].miu,
                          'prop_type': locations[i].pt,
                          'rooms': locations[i].rms,
                          'area': locations[i].ar,
                          'area_type': locations[i].atyp,
                          'street_address': locations[i].sa
                      }
                  );
              }

          }
      }
  }

  function addFilterHtml(filterType, filter) {
      html = '<span class="show-filters" filter-type="' + filterType + '" data-field-name="' + filter[0] + '" data-filter="">';
      html += (typeof filter[2] == 'undefined') ? filter[1] : (filter[2] + ' : ' + filter[1]);
      html += '<a class="filter-close-btn"';

      html += ' onclick="removeFilters(event)"';

      html += '>×</a>';
      html += '</span>';

      return html;
  }

  function showDetailDivs(_modal) {
      var detailDivs = ['features', 'proximities', 'services', 'views', 'images', 'recognition'];

      detailDivs.forEach(function(div) {
          var modalBody = document.getElementById('property-modal-body');
          if (_modal && modalBody) {
              var head = modalBody.querySelectorAll(`#${div}-head`);
              if (!head.length) return false;
              head = head[0];

              var liEl = modalBody.querySelectorAll(`.${div}-li`);
          } else {
              var head = document.getElementById(`${div}-head`);
              if (head)
                  var liEl = document.getElementsByClassName(`${div}-li`);
          }


          if (head && liEl) {

              if (liEl.length)
                  var _style = 'block';
              else
                  var _style = 'none';

              head.style.display = _style;
          }
      });
  }

  function sendfiltersAjaxRequest() {
      if (typeof checkSendAnalyticsEvent !== 'undefined') {
          sendAnalyticsEvent();
          fbSearchEvent('search');
      }
  }

  function sendAnalyticsEvent() {
      ga('send', 'event', 'User', 'Selected filter option', 'User Selected filter option');
  }

  function saveViewLog(propertyId, type, micro) {
      if (sendViewLog && propertyId) {

        var _type = type ? type : '3';

        sendViewLog = false;

        axios.get(`/cdn/save-log?property_id=${propertyId}&type=${_type}`);

        sendViewLog = true;sendViewLog;

        if (typeof checkSendAnalyticsEvent !== 'undefined' && micro)
          ga('send', 'event', "User", "Viewed Property", "Property Microview", propertyId);

      } else {
          return false;
      }
  }

  function setValuesOnDrag(place) {
      var latlng = typeof place !== 'undefined' ? place.geometry.location : map.getCenter();
      var latlng = {
          'lat': parseFloat(latlng.lat()),
          'lng': parseFloat(latlng.lng())
      };

      if (typeof place !== 'undefined' && typeof map == 'undefined') {
          var geolocation = new google.maps.LatLng(latlng);
          options = {
              center: geolocation,
              radius: 100000 //in meters
          };

          var circle = new google.maps.Circle(options);

          autocompleteBounds = circle.getBounds();
          autocomplete.setBounds(autocompleteBounds);
          setBoundsData(autocompleteBounds);
      }

      var geocoder = new google.maps.Geocoder;

      geocoder.geocode({
          'location': latlng
      }, function(results, status) {

          if (status === 'OK')
              mapupdateCityCountryAndArea('', results[0], latlng);

          if (window.firstCall && typeof map === 'undefined' ){
            showFilters();
          }


      });
  }

  function mapupdateCityCountryAndArea(IdName, place, latlng) {
      address = input.value;
      addressComponents = place.address_components;
      _latitude = latlng ? latlng.lat : (!latlng ? place.geometry.location.lat() : '');
      _longitude = latlng ? latlng.lng : (!latlng ? place.geometry.location.lng() : '');

      var components = {
          'lat': _latitude,
          'lng': _longitude,
          'place': place.place_id,
          'address': address
      };

      var city = '',
          country = '',
          countryCode = '';

      for (var i = 0; i < addressComponents.length; i++) {

          for (var j = 0; j < addressComponents[i].types.length; j++) {

              if (addressComponents[i].types[j] == "locality")
                  city = addressComponents[i].long_name;

              if (addressComponents[i].types[j] == "country") {
                  //update country
                  country = addressComponents[i].long_name;
                  countryCode = addressComponents[i].short_name;
              }
          }
      }

      document.getElementById('cityName').value = city;
      document.getElementById('countryName').value = country;
      document.querySelector('[name="city"]').value = city;
      document.querySelector('[name="country"]').value = country;
      document.querySelector('[name="lat"]').value = _latitude;
      document.querySelector('[name="lng"]').value = _longitude;
      document.querySelector('[name="zoom"]').value = typeof map !== 'undefined' ? map.getZoom() : 8;
      document.querySelector('[name="address"]').value = address;
      document.querySelector('[name="iso"]').value = countryCode;

      _searchFields = Array.prototype.slice.call(document.querySelectorAll('.search-address')).filter(function(item, index) {
          return item.style.display != "none"
      });

      [].forEach.call(_searchFields, (_searchField) => {
          _searchField.value = address;
      });

      changePropertiesTitle();

      window.prevScrollTop = 0;
  }

  function changePropertiesTitle() {
      var _search = Array.prototype.slice.call(document.querySelectorAll('.search-address')).filter(function(item, index) {
          return item.style.display != "none"
      });
      if (_search.length) {
          var _nearBy = _search[0].value;
          var _address = _search.length && _nearBy != '' ? `${_nearBy}` : propertiesTitle;

          if (document.getElementById('properties_title'))
              document.getElementById('properties_title').innerHTML = _address;
      }
  }

  function clearAutocompleteField() {

      var _searchFields = Array.prototype.slice.call(document.querySelectorAll('.search-address')).filter(function(item, index) {
          return item.style.display != "none"
      });

      [].forEach.call(_searchFields, (_searchField) => {
          _searchField.parentNode.querySelectorAll('.zoom-map-property').display = 'none';
          _searchField.parentNode.querySelectorAll('.zoom-search-property').display = 'block';
      });
      [].forEach.call(_searchFields, (_searchField) => {
          _searchField.value = '';
          var _icons = _searchField.parentNode.querySelectorAll('.zoom-search-property');
          var i = 0;
          [].forEach.call(_icons, (_icon) => {
              _icon.style.display = 'block';
              _searchField.parentNode.querySelectorAll('.zoom-map-property')[i].style.display = 'none';
              ++i;
          });
      });

      var inputFields = document.getElementById('form-map').querySelectorAll('.loc-data');

      [].forEach.call(inputFields, (inputField) => {
          inputField.value = '';
      });

      defaultZoom = body.getAttribute('data-map-zoom');

      if (defaultZoom > 5)
          defaultZoom = 3;

      if (typeof map !== 'undefined' && map)
          map.setZoom(4);

      changePropertiesTitle();

      var filterOrderList = document.getElementsByClassName('filterOrderList');

      if (filterOrderList.length && filterOrderList[0].classList.contains('openSortOrder'))
          filterOrderList[0].classList.remove('openSortOrder');

      var fiterColMain = document.getElementsByClassName('fiterColMain');

      if (fiterColMain.length && fiterColMain[0].classList.contains('activeFilter'))
          fiterColMain[0].classList.remove('activeFilter');

      showFilters();
  }

  function setAutocompletePlaceByPlaceId(autocomplete) {
      var place_id = window.place.formatted_address;
      if (place_id) {
          var geocoder = new google.maps.Geocoder;
          geocoder.geocode({
              'placeId': place_id
          }, function(results, status) {
              if (status === 'OK') {
                  autocomplete.set("place", results[0]);
              }
          });
      }
  }

  function initSearchAutocomplete(map) {
      //Autocomplete
      if (typeof map !== 'undefined' && map) autocomplete.bindTo('bounds', map);

      if (typeof window.place !== 'undefined') setAutocompletePlaceByPlaceId(autocomplete);

      google.maps.event.addDomListener(input, 'keydown', function(event) {
          if (event.keyCode === 13) event.preventDefault();
        });

      google.maps.event.addListener(autocomplete, 'place_changed', function() {

          window.place = autocomplete.getPlace();

          if (!place.geometry) return;

          if (typeof map !== 'undefined' && map) {
            if (place.geometry.viewport)
              map.fitBounds(place.geometry.viewport);
            else
              map.setCenter(place.geometry.location);
          }

          _latitude = place.geometry.location.lat();
          _longitude = place.geometry.location.lng();

          var address = '';
          if (place.address_components) {
              address = [
                  (place.address_components[0] && place.address_components[0].short_name || ''),
                  (place.address_components[1] && place.address_components[1].short_name || ''),
                  (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');

              if (_pageView) {
                  if (_pageView == 'map')
                      document.getElementsByClassName('property-loader')[0].display = 'block';
                  else
                      document.getElementsByClassName('ajax-loader')[0].display = 'block';
              }

              window.firstCall = true;
              setValuesOnDrag(place);
          }
      });

      if(_pageView)
      {
        const updateUrlInterval = setInterval(function() {
          if (window.updateUrl) {
            clearInterval(updateUrlInterval);
            showFilters();
          }
        }, 100);
      }
  }

  function generateShareLink(event) {
      data = {};
      data['locale'] = _siteLang;
      data['view_type'] = typeof _pageView == 'undefined' ? 'Map' : (_pageView == 'map' ? 'Map' : _pageView);

      var formElements = updateURL();

      data = extend(data, formElements);
      axios.get('/share-link', {  params: data  })
      .then(function(response){
        response = response.data;
        baseUrl = event.target.parentNode.getAttribute('data-href');
        SHARE_LINK_URL = baseUrl + response;
        copyLink();
      })
  }

  function resetFiltersHtml() {
      window.filters = {};

      var checkboxes = activeFilters.querySelectorAll('.btn.active');

      [].forEach.call(checkboxes, (checkbox) => {
          checkbox.querySelector('.change-update').checked = false;
          checkbox.classList.remove('active');
      });

      var changeSelects = document.getElementsByClassName('change-select');
      [].forEach.call(changeSelects, (changeSelect) => {
          changeSelect.selectedIndex = 0;
      });

      clearAutocompleteField();
  }

  function updateBookmarks() {
      var bookmarkNodes = document.getElementsByClassName('bookmark');
      if (bookmarkNodes.length) {
        axios.get('/get-bookmarks',{
          params:{
            'uId': uId
          }
        })
      .then(function(bookmarksPropArray) {
        bookmarksPropArray = bookmarksPropArray.data;
        if (bookmarksPropArray) {
          Array.prototype.forEach.call(bookmarkNodes, (bookmarkNode) => {
              var _propId = bookmarkNode.getAttribute('data-prop-id');
              var titleNode = bookmarkNode.querySelector('.title-add');

              if (uId)
                  bookmarkNode.setAttribute('href', 'javascript:void(0)');
              else
                  bookmarkNode.setAttribute('href', '/' + _siteLang + '/login?bookmark=' + _propId);

              if (bookmarksPropArray[_propId]) {
                  var bookmarkState = 'added';
                  var _title = titleNode.getAttribute('data-saved')
                  bookmarkNode.classList.add('bookmark-added');
              } else {
                  var bookmarkState = 'empty';
                  var titleNode = titleNode.getAttribute('data-save-this');
                  bookmarkNode.classList.remove('bookmark-added');
              }

              bookmarkNode.setAttribute('data-bookmark-state', bookmarkState);
              titleNode.textContent = _title;
          });
        }
      });
    }
  }

  function updateURL(event) {
      var url = window.location.href.split('?');
      var segments = url[0].split('/');
      currenturl = url[0];

      if (typeof event !== 'undefined') {
          var _action = event.target.getAttribute('data-action');
          segments[6] = _action;
      }


      var countryName = document.getElementById('countryName');

      if (countryName.value != '') {
          segments[7] = countryName.value;


          if(document.querySelector('[name="zoom"]').value >= 10)
          {
            var cityName = document.getElementById('cityName');

            if (cityName.value != '')
            segments[8] = cityName.value;
            else
              segments.splice(8, 1);
          } else segments.splice(8, 1);

      } else {
          segments.splice(7, 1);
          segments.splice(7, 1);
      }

      _pushURL = segments.join('/');

      var formElements = [];
      var queryString = '';
      var checkboxes = activeFilters.querySelectorAll(`.change-update:checked`);
      var selects = activeFilters.querySelectorAll(`.change-select`);
      var inputElements = document.getElementsByClassName('additional');

      [].forEach.call(inputElements, (inputElement) => {
          if (inputElement.value != '')
          {
            queryString += `${encodeURIComponent(inputElement.name)}=${inputElement.value}&`
            formElements[encodeURIComponent(inputElement.name)] = inputElement.value;
          }
      });

      [].forEach.call(checkboxes, (checkbox) => {
          queryString += `${checkbox.name}=${checkbox.value}&`
          formElements[checkbox.name] =checkbox.value;
      });

      [].forEach.call(selects, (select) => {
          if (select.selectedIndex !== 0)
          {
            queryString += `${select.name}=${select.value}&`
            formElements[select.name] = select.value;
          }
      });

      if (queryString != '')
          queryString = `?${queryString}`;
      //
      var _url = `${_pushURL}${queryString}`;

      if (typeof event !== 'undefined')
          window.location.href = _url;

      window.history.replaceState("object or string", document.title, _url);

      return formElements;
  }

  function sendRequest(first, updateMap, additionalData, _pageView) {

      if (!window.requestSent) return false;

      window.requestSent = false;

      if (!additionalData) additionalData = {};

      var data = {};

      pageNumber = ajaxRequest.getAttribute('data-page-number');

      if (ajaxRequest.getAttribute('data-first-load') == 1 && _pageView == 'list')
          return;

      loader.style.display = 'block';

      if (additionalData['action'] == 'scroll' && !first) {
          if (parseInt(pageNumber) === 0) {
              loader.style.display = 'none';
              return false;
          }

          data['page'] = pageNumber;
      }

      var noResultImg = document.getElementById('no_result_img');
      noResultImg.style.display = 'block';
      noResultImg.src = noResultImg.getAttribute('data-searching');


      if (first) {
          pageNumber = 1;
          ajaxRequest.setAttribute('data-page-number', 1)
          delete data['page'];
      }

      var sort = document.querySelectorAll('.property-sort.active');
      var _attr = sort[0].getAttribute('data-filter');
      var _el = document.querySelector(`.sort-options[data-filter = ${_attr}]`);
      for (var i = 0; i < sort.length; i++) {
        sort[i].childNodes[0].innerHTML =  _el.childNodes[0].textContent;

        if (sort[i].getAttribute('data-filter') != '')
        data['sort'] = sort[i].getAttribute('data-filter');
      }



            additionalData = extend(data, additionalData);


      if (typeof window.bounds == 'object') {
          var bounds = window.bounds;
          additionalData = extend(additionalData, bounds);
      }

      var extraFields = {
          'firstCall': first,
          'site_lang': _siteLang,
          'site_curr': _siteCurr
      };


      additionalData = extend(additionalData, extraFields);

      var formElements = updateURL();

      additionalData = extend(additionalData, formElements);

      if (_pageView) {
          if (_pageView == 'gallery') getGalleryData(first, updateMap, additionalData);
          if (_pageView == 'list') propertyListing(first, updateMap, additionalData);
          if (_pageView == 'map') getProperties(first, updateMap, additionalData);
      }
  }

  function extend(obj, src) {
      for (var key in src) {
          if (src.hasOwnProperty(key)) obj[key] = src[key];
      }
      return obj;
  }

  function getProperties(first, updateMap, additionalData) {

      var parentNode = document.getElementById("search-prop-list");
      axios.get('/cdn/property-locations',{
        params:additionalData
      })
      .then(function(response){
        response = response.data;
        if (updateMap)
        updateMapMarkers(map, response);

        deleteMarkers = true;

        if (response['paginateProperties']) {
          if (typeof data['page'] == 'undefined') {
            parentNode.innerHTML = response.paginateProperties;
          } else {
            if (response['paginateProperties'] != '')
            parentNode.insertAdjacentHTML('beforeend', response.paginateProperties);
          }
        } else if (typeof data['page'] == 'undefined' && typeof propAd !== 'undefined') {
          // adHtml = getAdHtml(propAd);
          parentNode.innerHTML = '';
        }

        commonFilterSuccess(response);
      })
  }

  function propertyListing(first, updateMap, additionalData) {

      var parentNode = document.getElementById("properties");
      axios.get('/cdn/loadlistview',{ params:additionalData })
      .then(function(response){
        response = response.data
        if (response.properties != '') {
            if (first)
                parentNode.innerHTML = response.properties;
            if (!first)
                parentNode.insertAdjacentHTML('beforeend', response.properties);
            if (typeof nextPage != 'undefined') nextPage = 2;
        } else {
            if (first)
                parentNode.innerHTML = '';
        }
          commonFilterSuccess(response);
      });
  }

  function getGalleryData(first, updateMap, additionalData) {

      _url = typeof _imagesView != 'undefined' && _imagesView ? '/cdn/loadimages' : '/cdn/loadgrideview';

      var parentNode = document.getElementById("grid-view");
      var _gridList = document.getElementById('page-content').getAttribute('data-gridlist');
      var extraFields = {
          'gallery': _gridList ? 0 : 1
      };

      additionalData = extend(additionalData, extraFields);

      var elem = document.querySelectorAll('.grid');
      axios.get(_url,{
        params:additionalData
      })
      .then(function(response){
        response = response.data;
        var append = false;
        if (response['properties'] != '') {
            if (first) {
                parentNode.innerHTML = response.properties;
                append = true;
            }

            if (!first) {
                parentNode.insertAdjacentHTML('beforeend', response.properties);
                append = true;
            }

            if (typeof nextPage != 'undefined') nextPage = 2;

            responsiveGridData();
        } else {
            if (first)
                parentNode.innerHTML = '';
        }

        commonFilterSuccess(response);
      })
  }

  function commonFilterSuccess(response) {
      var noResultImg = document.getElementById('no_result_img');

      if (document.getElementsByClassName('see_prop_detail').length)
          noResultImg.style.display = 'none';

      if (response['nextPage']) {
          nextPage = response['nextPage'];
          pageNumber = parseInt(nextPage);

          ajaxRequest.setAttribute('data-page-number', pageNumber);
      } else {
          ajaxRequest.setAttribute('data-page-number', 0);

          if (response['no_result']) {
              var noResult = document.getElementsByClassName('no-result-outer');
              if (noResult.length)
                  document.getElementsByClassName('no-result-outer')[0].remove();

              document.getElementsByClassName('saveThisSearch')[0].insertAdjacentHTML('afterend', response['no_result']);
              document.getElementById('no-property-result').style.display = 'block';


              noResultImg.src = noResultImg.getAttribute('data-no-result');
          }
      }

      if (response['firstCall'] == 'true') {
          var searchListCol = document.getElementsByClassName('searchListCol');
          if (searchListCol.length)
              searchListCol[0].scrollTop = 0;
          else {
              scrollToTop();
          }
      }

      updateImages();
      updateBookmarks();
      countFilters();
      updateURL();


      if (typeof updateGalleryInterval !== 'undefined')
          clearInterval(updateGalleryInterval);


      window.firstCall = false;
      loader.style.display = 'none';
      window.requestSent = true;
  }

  var _bookMarks = document.getElementsByClassName('bookmark');
  for (var i = 0; i < _bookMarks.length; i++) {
    _bookMarks[i].addEventListener('click', function(event){
      var _el = event.target;
      updateBookmark(_el);
    });
  }

  function updateBookmark(_this)
  {
    event.stopPropagation();
    var _propId = _this.getAttribute('data-prop-id');
    bookmark(_propId);
    var _state = _this.getAttribute('data-bookmark-state');
    var _els = document.querySelectorAll(`.bookmark[data-prop-id="${_propId}"]`);
    for (var i = 0; i < _els.length; i++) {
      var _parentNode = _els[i].parentNode;
      var _childNode = _parentNode.querySelector('.title-add');
          if (_state == 'empty') {
            _els[i].setAttribute("data-bookmark-state", 'added');
            _els[i].className += " bookmark-added";
            _childNode.innerHTML = _childNode.getAttribute('data-saved');
              if (typeof checkSendAnalyticsEvent !== 'undefined') {
                  fbSearchEvent('addBookmark');
              }
        } else if (_state == 'added') {
          _els[i].setAttribute("data-bookmark-state", 'empty');
          _els[i].classList.remove("bookmark-added");
          _childNode.innerHTML = _childNode.getAttribute('data-save-this');
        }
  }
  }
  function searchMapScrollRequest(event) {
      var additionalData = {
          'action': 'scroll'
      };

      var scrollTop = event.target.scrollTop;
      var height = event.target.offsetHeight;
      var searchPropListHeight = document.getElementById('search-prop-list').offsetHeight;

      var searchList = scrollTop + height > searchPropListHeight - 500;

      if (searchList)
          sendRequest(false, false, additionalData, _pageView);
  }

  function searchListScrollRequest() {
      if (_pageView && _pageView != 'map' && typeof sendRequest !== 'undefined') {
          if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 1800 && window.pageYOffset >= window.prevScrollTop) {
              window.prevScrollTop = window.pageYOffset;
              additionalData = {
                  'action': 'scroll'
              };

              sendRequest(false, false, additionalData, _pageView);
          }
      }
  }

  function toggleListArea(event) {
      var _resultSection = document.querySelectorAll('.resultSection');
      if(_resultSection.length){
        _resultSection = _resultSection[0];
        if(_resultSection.classList.contains('moreMapArea'))
            _resultSection.classList.remove('moreMapArea');
        else
            _resultSection.classList.add('moreMapArea');
      }
      if (window.screen.width > 767)
          google.maps.event.trigger(map, 'resize');
  }

  function showInfoBox(event) {
      propertyId = event.target.getAttribute('data-target-id');

      if (openedInfobox) {
          var getMarker = filterMarker(openedInfobox);
          if (getMarker && typeof getMarker[0] != 'undefined') {
              getMarker[0][1].close();
              openedInfobox = false;
              if (saveViewLogs) {
                  clearTimeout(RequestTimeout);
                  saveViewLogs = null;
              }
          }

      }

      var getMarker = filterMarker(propertyId);
      if (getMarker && typeof getMarker[0] != 'undefined') {
          saveViewLogs = setTimeout(function() {
              saveViewLog(propertyId,8,true);
              clearTimeout(saveViewLogs);
          }, 500);

          getMarker[0][1].open(map, getMarker[0][0]);
          openedInfobox = propertyId;
      }
  }

  function moreFilters(sort) {
      var dataFilter = '';
      var dataActives = document.querySelectorAll('.active.property-sort');

      if (dataActives.length ) {
        var dataActive = dataActives[0];
        if(dataActive.getAttribute('data-filter')){
          dataFilter = dataActive.getAttribute('data-filter');
        }
      }

      e = document.querySelectorAll(`.sort-options[data-filter='${dataFilter}']`);
      var filter = '';
      var str = '';
      if (e.length) {
        filter = e[0].getAttribute('data-filter');
        str = e[0].textContent;
      }

      [].forEach.call(document.querySelectorAll('.sort-options.hidden'), (option) => {
          option.classList.remove('hidden');
      });

      [].forEach.call(dataActives, (dataActive) => {
          dataActive.getElementsByTagName('a')[0].textContent = str;
      });

      [].forEach.call(e, (el) => {
          el.classList.add("hidden");
      });

      var filterOrderList = document.getElementsByClassName('filterOrderList');

      if (filterOrderList.length && filterOrderList[0].classList.contains('openSortOrder'))
          filterOrderList[0].classList.remove('openSortOrder');

      if (sort) {
          window.firstCall = true;
          window.requestSent = true;
          sendRequest(true, updateMap, false, _pageView);
          event.stopPropagation();
          var _currentElement = document.querySelector('.dropdownList');
          var _target = _currentElement.querySelector('.dropdown-toggle');
          openClose(_currentElement, _target)
      }
  }

  function sortPropertyList(event) {
      event.stopPropagation();
      var _currentElement = document.querySelector('.dropdown');
      if(_currentElement){
        var _target = _currentElement.querySelector('.dropdown-toggle');
        if(_target)
        openClose(_currentElement, _target)
      }
      var propertySorts = document.getElementsByClassName('property-sort');
      var dataFilter = event.target.parentNode.getAttribute('data-filter');
      var dataActives = document.querySelectorAll(`.property-sort[data-filter=${dataFilter}]`);
      if (!dataActives.length) {
          var dataActives = document.querySelectorAll('.active.property-sort');
          [].forEach.call(dataActives, (dataActive) => {
              dataActive.setAttribute('data-filter', dataFilter);
          });
      }

      [].forEach.call(propertySorts, (propertySort) => {
          propertySort.classList.remove('active');
      });

      [].forEach.call(dataActives, (dataActive) => {
          dataActive.classList.add('active');
      });

      moreFilters(true);
  }

  function responsiveGridData() {

      var column_breakpoint = 700,
          columns = 5,
          screenWidth = window.screen.width;

      if (screenWidth >= 2560) var column_breakpoint = 700,
          columns = 5;
      if (screenWidth <= 991) var column_breakpoint = 400,
          columns = 3;
      if (screenWidth <= 800) var column_breakpoint = 700,
          columns = 2;
      if (screenWidth <= 480) var column_breakpoint = 500,
          columns = 1;

      var options = {
          no_columns: columns,
          padding_x: 10,
          padding_y: 5,
          margin_bottom: 50,
          single_column_breakpoint: column_breakpoint
      };

      els = document.querySelectorAll('#grid-view');

      [].forEach.call(els, (el) => {
          new Grid(el, options)
      });
  }

  function loadViews(_this,_id){
    var _myProperties = document.getElementById('my-properties');
    if(_myProperties)
    {
      if(!_myProperties.getAttribute('data-request'))
      {
        _myProperties.setAttribute('data-request',1);
        axios.get('/account/agency/property_stat/'+_id)
        .then(function(response){
          _this.getElementsByTagName('b')[0].innerText = response.count;
          _this.style.display = 'block';
          _myProperties.setAttribute('data-request',0);
        })
      }

    }
  }

  function backgroundSequence() {
      bgImageArray = [];
      for (i = 1; i <= 11; i++) {
          bgImageArray.push(i);
      }

      var _num = Math.floor(Math.random() * bgImageArray.length);
      var _bckPath = "linear-gradient(0deg,rgba(255, 255, 255, 0.3),rgba(171, 146, 146, 0.3)),url(" + '/assets/img/landing/landing_' + bgImageArray[_num] + '.jpg' + ")";

      _parentNode = document.getElementsByClassName("banner-sec");
      node = _parentNode[0];

      node.style.transition = 'background-image 7s linear';
      node.style.backgroundImage = _bckPath;
  }

  (function() {
      var pluginName = 'grid_view',
          defaults = {},
          columns, article, article_width;

      window.Grid = function(element, options) {
          this.element = element;
          this.options = options;
          this._name = 'grid_view';
          this.init();
      }

      Grid.prototype.init = function() {
          var self = this,
              resize_finish;

          resize_finish = setInterval(function() {
              self.make_layout_change(self);
          }, 50);
          setTimeout(function() {
              clearTimeout(resize_finish);
          }, 20000);

          addEvent(window, "resize", responsiveGridData);
      };

      Grid.prototype.calculate = function(single_column_mode) {
          var self = this,
              tallest = 0,
              row = 0,
              container = this.element,
              container_width = this.element.offsetWidth;
              article = this.element.getElementsByTagName('article');

          if (self.options.no_columns == 1) {
              article_width = container_width;
          } else {
              article_width = (container_width - self.options.padding_x * (self.options.no_columns+1)) / self.options.no_columns;
          }

          columns = self.options.no_columns;

          [].forEach.call(article, (articleEl, index) => {
              articleEl.style.width = article_width;

              var current_column,
                  left_out = self.options.padding_x,
                  top = single_column_mode === true ? 100 : 180,
                  thisEl = articleEl,
                  prevAll = getPreviousSiblings(thisEl, 'article'),
                  tallest = 0;

              if (single_column_mode === false) {
                  current_column = (index % columns);
              } else {
                  current_column = 0;
              }

              for (var t = 0; t < columns; t++) {
                  thisEl.classList.remove('c' + t);
              }

              if (index % columns === 0) {
                  row++;
              }

              thisEl.classList.add('c' + current_column);
              thisEl.classList.add('r' + row);

              if (prevAll) {
                  [].forEach.call(prevAll, (prevEl) => {
                      if (prevEl.classList.contains('c' + current_column)) {
                          top += prevEl.offsetHeight + self.options.padding_y;
                      }
                  });
              };

              if (self.options.no_columns == 1) {
                  left_out = 10;
              } else {
                  left_out = (index % columns) * (article_width + self.options.padding_x) + self.options.padding_x;
              }

              thisEl.style.left = `${left_out}px`;
              thisEl.style.top = `${top}px`;
              thisEl.style.width = `${article_width}px`;
          });

          this.tallest(container);
      };

      Grid.prototype.tallest = function(_container) {
          var column_heights = [],
              largest = 0;

          for (var z = 0; z < columns; z++) {
              var temp_height = 0;
              var els = _container.querySelectorAll(`.c${z}`);

              [].forEach.call(els, (el) => {
                  temp_height += el.offsetHeight;
              });
              column_heights[z] = temp_height;
          }

          largest = Math.max.apply(Math, column_heights);
          height = largest + this.options.padding_y + this.options.margin_bottom;

          _container.style = `${height}px`;

          var searchInfoDiv = document.querySelectorAll('.searchListing.saveThisSearch')[0];
          var noResult = document.querySelectorAll('.no-result-outer');

          searchInfoDiv.style.top = parseInt(height + 100) + 'px';
          if (noResult.length)
            noResult[0].style.top = parseInt(height + 200) + 'px';
      };

      Grid.prototype.make_layout_change = function(_self) {
          if (window.screen.width < _self.options.single_column_breakpoint) {
              _self.calculate(true);
          } else {
              _self.calculate(false);
          }
      };

  })();

  function getPreviousSiblings(elem, filter) {
      var sibs = [];
      while (elem = elem.previousSibling) {
          if (matches(elem, filter)) {
              sibs.push(elem);
          }
      }
      return sibs;
  }

  function matches(elem, filter) {
      if (elem && elem.nodeType === 1) {
          if (filter) {
              return elem.matches(filter);
          }
          return true;
      }
      return false;
  }

  function initContactMap(_markers, _lat, _lng, _zoom, _locationName) {
      var styles = getMapStyles();

      var mapOptions = {
          mapTypeControlOptions: {
              mapTypeIds: ['Styled']
          },
          center: new google.maps.LatLng(_lat, _lng),
          zoom: _zoom,
          scrollwheel: true,
          navigationControl: true,
          mapTypeControl: true,
          zoomControl: true,
          disableDefaultUI: true,
          mapTypeId: 'Styled',
          minZoom: 2
      };


      var mapElement = document.getElementById('contact-map');
      var map = new google.maps.Map(mapElement, mapOptions);

      for (i = 0; i < _markers.length; i++) {
          var position = new google.maps.LatLng(_markers[i][1], _markers[i][2]);
          var marker = new MarkerWithLabel({
              position: position,
              map: map,
              icon: '/assets/img/props_mark.png',
              labelAnchor: new google.maps.Point(10, 0),
              title: _markers[i][0]
          });
      }

      var color = "#85cad1"; //Set your tint color. Needs to be a hex value.
      var styledMapType = new google.maps.StyledMapType(styles, {
          name: _locationName
      });
      map.mapTypes.set('Styled', styledMapType);
  }

  function sendVerificationEmail(_this)
  {
      var title = verification + ' '+ Email + '?';

      swal({
          title: title,
          text: VerificationEmailText,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonText: Cancel,
          cancelButtonColor: '#d33',
          confirmButtonText: confirmButton
      }).then(function() {
        axios.get('/account/profile/verification/send')
        .then(function(response){
          swal(
            title,
            'Email Sent Successfully',
            'success'
          )
        })
        .catch( error => {
          swal(
            SomethingWentWrong,
            PleaseTryAgain,
            'error'
          )
        });
      }, function(dismiss) {
          if (dismiss === 'cancel') {
              swal(
                  Cancelled,
                  VerificationCancelled,
                  'error'
              )
          }
      });
  }

  function sendVerificationEmail(_this)
  {
      var title = verification + ' '+ Email + '?';

      swal({
          title: title,
          text: VerificationEmailText,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonText: Cancel,
          cancelButtonColor: '#d33',
          confirmButtonText: confirmButton
      }).then(function() {
        axios.get('/account/profile/verification/send')
        .then(function(response){
          swal(
            title,
            'Email Sent Successfully',
            'success'
          )
        })
        .catch(function(error){
          swal(
            SomethingWentWrong,
            PleaseTryAgain,
            'error'
          )
        })
      }, function(dismiss) {
          if (dismiss === 'cancel') {
              swal(
                  Cancelled,
                  VerificationCancelled,
                  'error'
              )
          }
      });
  }

  function relocatePage(event){
    var _target = event.target;

    var _location  = window.location.href;
    var _connector = parseInt(body.getAttribute('data-params-count')) ? `&` : `?`;
    var _param     = _target.getAttribute('data-param');
    var _path      = _target.getAttribute('data-href');
    var _href      = `${_location}${_connector}${_param}=${_path}`;

    window.location.href = _href;
  }

  function updateLandingURL(event){

   var _activeStatus = document.querySelectorAll('.property-status.active')[0];
   var _landSrcBtn = document.getElementsByClassName('landSrcBtn');

   var _url = window.location.origin;
   if(_activeStatus)
    _url += '/'+_siteLang+'/' + _activeStatus.getAttribute('data-path') + '/property/' + _landSrcBtn[0].getAttribute('data-action');
   var _country = document.querySelectorAll('input[name="country"]')[0];
   if ( _country) _url += '/' + _country.value;

   var _queryString =window.location.href.split('?');
   if(_queryString.length > 1)
   {
     _queryString = _queryString[1];
     _url += `${_url}?${_queryString}`
   }

   window.history.replaceState("object or string", document.title, _url);

  if(typeof event !== 'undefined' )
    updateURL(event);
  }

  Array.prototype.equals = function (array, strict) {
     if (!array)
         return false;

     if (arguments.length == 1)
         strict = true;

     if (this.length != array.length)
         return false;

     for (var i = 0; i < this.length; i++) {
         if (this[i] instanceof Array && array[i] instanceof Array) {
             if (!this[i].equals(array[i], strict))
                 return false;
         }
         else if (strict && this[i] != array[i]) {
             return false;
         }
         else if (!strict) {
             return this.sort().equals(array.sort(), true);
         }
     }
     return true;
  }

  function getChart (categories, data, chartTitle, containerId) {
     Highcharts.chart(containerId, {
         title: {
             text: chartTitle,
             x: -20 //center
         },
         xAxis: {
             categories: categories
         },
         yAxis: {
             allowDecimals: false,
             title: {
                 text: 'Views'
             },
             plotLines: [{
                 value: 0,
                 width: 1,
                 color: '#808080'
             }]
         },
         tooltip: {},
         legend: {
             layout: 'vertical',
             align: 'right',
             verticalAlign: 'middle',
             borderWidth: 0
         },
         series: [{
             name: 'Full Views',
             data: data[1]
         },{
             name: 'User Views',
             data: data[0]
         }]
     });
  }

  function getBarChart(data, chartTitle)
  {
   // Create the chart
     Highcharts.chart('countries-container', {
         chart: {
             type: 'column'
         },
         title: {
             text: chartTitle
         },
         xAxis: {
             type: 'category'
         },
         yAxis: {
             allowDecimals: false,
             title: {
                 text: 'Total Views'
             }

         },
         legend: {
             enabled: false
         },
         plotOptions: {
             series: {
                 borderWidth: 0,
                 dataLabels: {
                     enabled: true,
                     format: '{point.y}'
                 }
             }
         },

         tooltip: {
             headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
             pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
         },

         series: [{
             name: 'Views',
             colorByPoint: true,
             data: data
         }]
     });
  }

  function getAgencyUserViewStats(chartTitle, month = 1)
  {
    agencyStatsLoader(_loading);
    axios.get('/account/agency/user_view',{
     params: { 'month' : month },

    })
    .then(function(response){
      _loading = false;
      agencyStatsLoader(_loading);
      response = response.data;
       getChart (response[0], response[1], chartTitle, 'user-view-container');
    })
  }

  function getDayViewsStats(chartTitle)
  {
   data = {
     'property_id' : document.querySelectorAll('[name="property_id"]')[0].value,
     'month' : 'true'
   };

   getStats(data, chartTitle);
  }

  function getCountryViewsStats(chartTitle = 'Countries Views')
  {
   data = {
     'property_id' : document.querySelectorAll('[name="property_id"]')[0].value,
     'countries' : 'true'
   };

   getStats(data, chartTitle, true);
  }

  function getStats(data, chartTitle, countries = false)
  {
     axios.get('/account/property-stats', {
       params:data
     })
     .then(function(response){
       respone = response.data;
       if(countries)
         getBarChart(response, chartTitle);
       else
         getChart(response[0], response[1], chartTitle, 'days-container');
     })
  }

  function getChart (categories, data, chartTitle, containerId) {
     Highcharts.chart(containerId, {
         title: {
             text: chartTitle,
             x: -20 //center
         },
         xAxis: {
             categories: categories
         },
         yAxis: {
             allowDecimals: false,
             title: {
                 text: 'Views'
             },
             plotLines: [{
                 value: 0,
                 width: 1,
                 color: '#808080'
             }]
         },
         tooltip: {},
         legend: {
             layout: 'vertical',
             align: 'right',
             verticalAlign: 'middle',
             borderWidth: 0
         },
         series: [{
             name: 'Full Views',
             data: data[1]
         },{
             name: 'Map Views',
             data: data[0]
         }]
     });
  }

  function getBarChart(data, chartTitle)
  {
   // Create the chart
     Highcharts.chart('countries-container', {
         chart: {
             type: 'column'
         },
         title: {
             text: chartTitle
         },
         xAxis: {
             type: 'category'
         },
         yAxis: {
             allowDecimals: false,
             title: {
                 text: 'Total Views'
             }

         },
         legend: {
             enabled: false
         },
         plotOptions: {
             series: {
                 borderWidth: 0,
                 dataLabels: {
                     enabled: true,
                     format: '{point.y}'
                 }
             }
         },

         tooltip: {
             headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
             pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
         },

         series: [{
             name: 'Views',
             colorByPoint: true,
             data: data
         }]
     });
  }
function agencyStatsLoader(loading) {
  var _container = document.getElementById('container') ? document.getElementById('container') : document.getElementById('user-view-container');

  if(loading)
    _container.innerHTML = '<center><img src="/assets/img/ajax-loader.svg"></center>';
  else
    _container.innerHTML = "";
}
  function getAgencyStats(chartTitle, month = 1)
  {
    agencyStatsLoader(_loading);
   axios.get('/account/agency/stats',{
     params:{
       'month':month
     }
   })
   .then(function(response){
     _loading = false;
     agencyStatsLoader(_loading);
     response = response.data;
     getChart (response[0], response[1], chartTitle, 'container');
   })
  }

  var planSubmits = document.getElementsByClassName('plans-sumbit-more');

  if(planSubmits.length){
    [].forEach.call(planSubmits, (planSubmit) => {
      planSubmit.addEventListener('click' , function(e){
        e.preventDefault();
        var planId = this.getAttribute('data-value');
        document.querySelectorAll('input[name=plan]')[0].value = btoa(planId);
          swal({
                title : 'Confirmation!',
                buttons: {
                  cancel: "Cancel",
                  catch: {
                    text: "Confirm",
                    value: "catch",
                  },
              },
              })
            .then((value) => {

                switch (value) {

                  case "catch":
                  var _stripePayForm = document.getElementById('stripe-pay-form');
                  _stripePayForm.submit();
                    break;

                  default:
                      swal("Plan Order Cancelled");
                      break;
                }
            });
      });
    });

  }

  function updateInput(_this)
  {
    var _target = _this.getAttribute('data-target');
    var _value  = _this.getAttribute('data-value');

    var _input  = document.querySelectorAll(`input[name="${_target}"]`);
    _input[0].value = _value;

    var _els = document.querySelectorAll(`[data-target="${_target}"]`);
    [].forEach.call(_els, (_el) => {
      _el.classList.remove('active');
    });

    _this.classList.add('active');
  }

  function getUserAndAdvertise(event)
  {
    var _formEl = document.getElementById('advertiseProperty');
    var _formId =  _formEl.getAttribute('id');
    var _formTarget = _formEl.getAttribute('data-target');
    var _formElement = document.getElementById(_formTarget);
    var _errors = requiredError(_formId);
    if(_errors){
      window.scrollTo({top:0, behavior:"smooth"})
      event.preventDefault();
      return;
    }
    if(!_errors){
      var _url = _formEl.getAttribute('action');
      var _formObj = {};
      var _formInputs = _formEl.querySelectorAll('input,textarea');
      if(_formInputs.length){
        for (var i = 0; i < _formInputs.length; i++) {
          var _name = _formInputs[i].name;
          var _value = _formInputs[i].value;
          _formObj[_name] = _value;
        }
      }
      axios.post(_url,_formObj);
      modalShow(_formElement);
      if(document.getElementById('alreadyHaveAccount').checked)
      {
        document.getElementById('userDetail').style.paddingTop = "110px";
        document.getElementsByClassName('password-bodrNone')[0].classList.add('bodrNone');
      } else {
        document.getElementById('userDetail').style.paddingTop = "30px";
        document.getElementsByClassName('password-bodrNone')[0].classList.remove('bodrNone');
      }

    }
    if(_userModal == 'true')
    {
      document.getElementById('name').value              = document.querySelectorAll('input[name="name"]')[0].value;
      document.getElementById('mobile').value            = document.querySelectorAll('input[name="mobile"]')[0].value;
      document.getElementById('email').value             = document.querySelectorAll('input[name="email"]')[0].value;
      document.getElementById('lang').value              = document.querySelectorAll('input[name="locale"]')[0].value;
      document.getElementById('prop-type').value         = document.querySelectorAll('input[name="property_type"]')[0].value;
      document.getElementById('prop-status').value       = document.querySelectorAll('input[name="status"]')[0].value;

      document.getElementById('postProperty').setAttribute('disabled', true);
      document.querySelectorAll('#user-register-form button[type=submit]')[0].removeAttribute('disabled');

      if(!_authUser)
        document.body.insertAdjacentHTML('afterend', '<div class="modal-backdrop fade in"></div>');
      else
        advertiseProperty();
    }

    if(!document.querySelectorAll('input[name="user_id"]')[0].value)
      event.preventDefault();
  }
  function pleaseWaitMinuteLoader(loading) {
    var _submitMessageEl = document.querySelectorAll('.form-prop-submit-message');
    var _submitImgEl = document.querySelectorAll('.form-prop-submit-img');
    var _formSubmitMessage = document.getElementsByClassName('form-submit-message');
    var _formSubmitImag = document.getElementsByClassName('form-submit-img');
    var _button = document.querySelectorAll('#user-register-form button[type=submit]');
    if(loading){
       if(_formSubmitMessage.length)  _formSubmitMessage[0].style.display = 'block';
       if(_formSubmitMessage.length)   _formSubmitMessage[0].innerHTML = _pleaseWaitMinuteOrTwo;
       if(_formSubmitImag.length)      _formSubmitImag[0].style.display = 'block';
       if(_button.length)              _button[0].setAttribute('disabled',true);
       if(_submitMessageEl.length)     _submitMessageEl[0].innerHTML = _pleaseWaitMinuteOrTwo;
       if(_submitImgEl.length)         _submitImgEl[0].style.display = "block";
    } else {
       if(_formSubmitMessage.length)   _formSubmitMessage[0].style.display = 'none';
       if(_formSubmitMessage.length)   _formSubmitMessage[0].innerHTML = "";
       if(_formSubmitImag.length)      _formSubmitImag[0].style.display = 'none';
       if(_button.length)              _button[0].removeAttribute('disabled');
       if(_submitMessageEl.length)     _submitMessageEl[0].innerHTML = "";
       if(_submitImgEl.length)         _submitImgEl[0].style.display = "none";
    }
  }

  function getUser(event){
    var _form   = event.target;
    var _formId = _form.getAttribute('id');
    var _errors = requiredError(_formId);
    if(_errors){
      event.preventDefault();
      return false;
    }

    event.preventDefault();
    var _fields    = _form.querySelectorAll('input,select');
    var formObj = {};
    for(i=0;i<_fields.length;i++)
    {
      var _field = _fields[i];
      var _fieldName = _field.name;
      var _fieldValue = _field.value;
      formObj[_fieldName] = _fieldValue;
    }
    formObj['user'] = _authUser;
    formObj['role_id'] = 4;
    formObj['action'] = document.getElementById('alreadyHaveAccount').checked ? 'login' : 'register';
    formObj['lang'] = _sitelang;
    pleaseWaitMinuteLoader(_loading,);
    axios.post('/property/getuser',formObj)
    .then(function(response){
      _loading = false;
      pleaseWaitMinuteLoader(_loading);
      response = response.data;
      adShowSuccess(response);
    })
    .catch(function(error){
      var errors = error.response.data.errors;
      if(errors){
        document.querySelectorAll('#user-register-form button[type=submit]')[0].removeAttribute('disabled',true);
        document.getElementsByClassName('form-submit-message')[0].style.display = 'none';
      }
      var el = document.getElementById("userDetail");
      el.classList.remove("help-block");
      Object.keys(errors).forEach((key) => {
        const value = errors[key];
        _parentElement = document.querySelector(`input[name^="${key}"],select[name^="${key}"]`).parentNode;
        _parentElement.insertAdjacentHTML('afterend', `<p class="help-block">${value}</p>`); //retrieving errors and appending them according to their field
     });
    })

  }

  function requiredError(formId)
  {
    var _return = false;
    var requiredFields = document.querySelectorAll(`form[id="${formId}"]`)[0].querySelectorAll("[required]");
    [].forEach.call(requiredFields, function(requiredField) {
    if(requiredField.parentElement.querySelectorAll('span').length)
      {
        var _errorEl = requiredField.parentElement.querySelectorAll('span')[0];
        if(requiredField.value == ''){
          _errorEl.textContent = _requiredField;
          _return = true;
        } else
        _errorEl.textContent = '';
      }
    });
    return _return;
  }
  var _elementBlur =document.querySelectorAll('p[contenteditable="true"], div[contenteditable="true"], h2[contenteditable="true"]');
  if(_elementBlur.length){
    for (var i = 0; i < _elementBlur.length; i++) {
      _elementBlur[i].addEventListener('blur', function(e) {
        var _this = e.currentTarget;
        if(_this.getAttribute('data-target') == 'title')
        {
           var _inputEls = document.querySelectorAll('input[name="'+ _this.getAttribute('data-target') +'"]');
           if(_inputEls.length){
               for (var i = 0; i < _inputEls.length; i++) {
                 _inputEls[i].value = _this.innerText;
               }
            }
            var _errorEls = document.querySelectorAll('.title-error.help-block>strong');
            if(_errorEls.length){
              for (var i = 0; i < _errorEls.length; i++) {
                _errorEls[i].innerText = "";
              }
            }
        } else {
          var _errorEls = document.querySelectorAll('.description-error.help-block>strong');
          if(_errorEls.length){
            for (var i = 0; i < _errorEls.length; i++) {
              _errorEls[i].innerText = "";
            }
          }
          var _textArea = document.querySelectorAll('textarea[name="'+ _this.getAttribute('data-target')+'"]');
          if(_textArea.length){
              for (var i = 0; i < _textArea.length; i++) {
                _textArea[i].value = _this.innerHTML;
              }
           }
        }
      })
    }
  }
  function adShowSuccess(response){
      _user = JSON.parse(response.user);
        document.querySelectorAll('input[name="user_id"]')[0].value = _user.id ;
        advertiseProperty();

  }

  function adShowErrors(response){
    var _formSubmitMessage = document.getElementsByClassName('form-submit-message');
    if(_formSubmitMessage.length) _formSubmitMessage[0].innerHTML = "";

    var _formSubmitImg = document.getElementsByClassName('form-submit-img');
    if(_formSubmitImg.length) _formSubmitImg[0].style.display = "none";

    var _formPropSubmitMessage = document.getElementsByClassName('form-prop-submit-message');
    if(_formPropSubmitMessage.length) _formPropSubmitMessage[0].innerHTML = "";

    var _formPropSubmitImg = document.getElementsByClassName('form-prop-submit-img');
    if(_formPropSubmitImg.length) _formPropSubmitImg[0].style.display = "none";

     document.getElementById('postProperty').setAttribute('disabled', false);
     document.getElementById('user-register-form button').setAttribute('disabled', false);
    var errors = JSON.parse(response.responseText);
    errors.forEach(function(value, fieldName) {
      var _els = document.querySelectorAll('[name="'+ fieldName +'"]');
      if(_els.length){
        var _parentEl = _els[0].parentNode;
        _parentEl.querySelectorAll('.help-block.'+ fieldName).innerText = value;
      }
    });
  }

  function advertiseProperty(response){
    var _form = document.getElementById('advertiseProperty');
     var _url  =   _form.getAttribute('action');
     var _fields = _form.querySelectorAll('input,textarea');
     var formObj = {};
     for(i=0;i<_fields.length;i++){
       var _field = _fields[i];
       var name = _field.name;
       var value = _field.value;
       formObj[name] = value;
     }
     formObj['preview_mode'] = 1;
     if(_authUser)
       {
          pleaseWaitMinuteLoader(_loading);
       }

     axios.post(_url,formObj)
     .then(function(response){
       _loading = false;
       pleaseWaitMinuteLoader(_loading);
       response = response.data;
       propShowSuccess(response);
     })
     .catch(function(error){
       var errors = error.response.data.errors;
       propShowErrors(errors);
     })
  }

  function propShowSuccess(response){
    var _propSubmitMessage  = document.querySelectorAll('.form-prop-submit-message');
    var _propSubmitImg      = document.querySelectorAll('.form-prop-submit-img');
    var _formSubmitImg      = document.querySelectorAll('.form-submit-img');
    var _formSubmitMessage  = document.querySelectorAll('.form-submit-message')

    if(_propSubmitMessage.length)
          _propSubmitMessage[0].innerHTML = "";

    if(_propSubmitImg.length)
            _propSubmitImg[0].style.display = "none";

    if(_formSubmitImg.length)
            _formSubmitImg[0].style.display = "none";

    if(_formSubmitMessage.length)
          _formSubmitMessage[0].innerHTML = "";

      document.getElementById('userDetail').classList.add('hide');
      var _sessionProp = document.querySelectorAll('#user-register-form  input[name = "sessionProp"]');
      if(_sessionProp.length) _sessionProp[0].value = "{{str_random(4)}}";
      document.querySelectorAll('input[name = "lang"]')[0].value = _sitelang;
      document.getElementById('postProperty').setAttribute('disabled', false);

      if (typeof ga !== 'undefined')
          ga('send', 'event', "User","Added Property","Property Advertised", response.propId);

      swal(response.message, {
          buttons: {
              catch: {
                  text: "Ok!",
                  value: "catch",
              }
          },
          dangerMode:true,
      })
      .then((value) => {
          switch (value) {
              case "catch":
                  window.location.href = response.link;
              break;

          }
      });
  }

  function propShowErrors(response){
    var _propSubmitMessage = document.querySelectorAll('.form-prop-submit-message')
    var _propSubmitImg = document.querySelectorAll('.form-prop-submit-img')
    var _postProperty = document.getElementById('postProperty')
    if(_propSubmitMessage.length)
      _propSubmitMessage[0].innerHTML = "";

    if(_propSubmitImg.length)
      _propSubmitImg[0].style.display = "none";

    _postProperty.setAttribute('disabled', false);

      alert('Something went wrong!');
  }
  var _postPropertyElement = document.getElementById("postProperty");
  if(_postPropertyElement){
    _postPropertyElement.addEventListener("click", function(e)
    {
      getUserAndAdvertise(event);
      e.preventDefault();

    });

  }
  function userDetailsHide(e) {
    var _this = e.target;
    _el = document.getElementById(_this.getAttribute('data-target'));
    modalHide(_el)
    var _modalBackdrop = document.getElementsByClassName('modal-backdrop');
    if(_modalBackdrop.length)
        _modalBackdrop[0].remove();

    document.getElementById('user-register-form').reset();
    document.querySelectorAll(`#user-register-form input[type=hidden]`)[0].value = "";
    document.querySelectorAll(`#user-register-form input[name="lang"]`)[0].value = _sitelang;
    var _userRegisterForm = document.querySelectorAll(`form#user-register-form input[name=_token]`);
      if(_userRegisterForm.length)
            _userRegisterForm[0].value = `{{csrf_token()}}`;
    document.querySelectorAll(`#user-register-form span.help-block`)[0].innerText = "";
    document.querySelectorAll(`.form-submit-message`)[0].innerHTML = "";
    var _registerForm =  document.querySelectorAll(`form#user-register-form button[type=submit]`);
    var _postProperty = document.getElementById('postProperty');
    if(_postProperty)
        _postProperty.removeAttribute('disabled');
    if(_registerForm.length)  _registerForm[0].removeAttribute('disabled');
    var _submitForm = document.querySelectorAll(`.form-submit-img`);
    if(_submitForm.length)
      _submitForm[0].style.display = "none";
  }
  var _el = document.getElementById('alreadyHaveAccount');
  if(_el){
      _el.addEventListener('change', function(e){
      var _registerField = document.getElementsByClassName('register-field');
      var _registerBtn = document.getElementsByClassName('register-btn');
      if((e.target).checked)
      {
        if(_registerField.length)
        for (var i = 0; i < _registerField.length; i++) {
          _registerField[i].style.display = "none";
        }

        if(_registerBtn.length)
        _registerBtn[0].innerText = _login;

      } else {
        if(_registerField.length)
        for (var i = 0; i < _registerField.length; i++) {
          _registerField[i].style.display = "block";
        }

        if(_registerBtn.length)
        _registerBtn[0].innerText = _register;
      }

    })
  }

  var _articleRightSectionMainEl = document.getElementById('articleRightSections');
  if(_articleRightSectionMainEl) {
    var _articleRightSectionMainElOuterHtml = _articleRightSectionMainEl.outerHTML;
    window.onscroll = function() {
      stickyRelocate();
    }
    window.onload = function() {
      stickyRelocate();
    };
  }
  function stickyRelocate() {
    if(window.screenWidth > 991)
    {
      var _stickyColParentNode    = document.getElementById('articleLeftSection').parentNode;
      var _articleRightSectionEl  = _articleRightSectionMainEl.cloneNode(true) ;
      var _windowTop              =  window.pageYOffset;
      var _footerTop              = document.getElementsByTagName('footer')[0].offsetTop-518;
      var _navBarTop              = document.getElementById('bs-example-navbar-collapse-1').offsetTop;

      if (_windowTop  >=  _footerTop){
        if(document.getElementById('insertStick'))
        {
          document.getElementById('insertStick').remove();
          _stickyColParentNode.insertAdjacentHTML('beforeend', _articleRightSectionMainElOuterHtml);
          window.stickElAdded = false;
        }
      }
      else if (_windowTop > _navBarTop && _windowTop > 800) {
        _articleRightSectionEl.classList.add('stick');

        var _rightSidebar                 = _articleRightSectionEl.outerHTML;
        var _articleRightSectionElWithStick = '';
        if(!window.stickElAdded){

          _articleRightSectionElWithStick  = `<div id="insertStick" style="position: relative; display: block; float: left;">`;
          _articleRightSectionElWithStick += _rightSidebar;
          _articleRightSectionElWithStick += `</div>`;

          document.getElementById('articleRightSections').remove();
          _stickyColParentNode.insertAdjacentHTML('beforeend', _articleRightSectionElWithStick);
          window.stickElAdded = true;
        }
      } else {
        if(document.getElementById('insertStick'))
        {
          document.getElementById('insertStick').remove();
          _stickyColParentNode.insertAdjacentHTML('beforeend', _articleRightSectionMainElOuterHtml);
          window.stickElAdded = false;
        }
      }

    }
  }
  function dropdownList(e) {
    var _currentElement = e.currentTarget;
    var _target = _currentElement.querySelector('.dropdown-toggle');
      openClose(_currentElement, _target)

  }

  function openClose(_currentElement,_target) {
    if(_currentElement.classList.contains('open') ||  (!_target.getAttribute('aria-expanded') && _currentElement.classList.contains('open'))){
      _currentElement.classList.remove('open');
      _target.removeAttribute('aria-expanded');
      _target.setAttribute('aria-expanded', true);
    } else {
      _currentElement.classList.add('open');
      _target.removeAttribute('aria-expanded');
      _target.setAttribute('aria-expanded', false);
    }
  }
  window.onload = function(){
  if(!typeof _oldTitle == "undefined" &&  _oldTitle){
      var _titles = document.querySelectorAll(`div[data-target="title"],p[data-target="title"],h2[data-target="title"]`);
      if(_titles.length){
        for (var i = 0; i < _titles.length; i++) {
          _titles[i].innerHTML = "{!! old('title') !!}";
        }
      }

    }
    if(!typeof _oldDescription == "undefined" &&  _oldDescription){
      var _description = document.querySelectorAll(`p[data-target="description"], div[data-target="description"], h2[data-target="description"]`);
      if(_description.length){
        for (var i = 0; i < _description.length; i++) {
          _description[i].innerHTML = "{!! old('description') !!}";
        }
      }
    }
  }
  if(!typeof _authUser)
  {
    var _inputEmail = document.querySelector('.basicInfoEmail');
    if(_inputEmail){
      _inputEmail.addEventListener('keyup', function(e){
        axios.get('/validateEmail',{
          params:{
          'email': e.target.value,
          'role_id': 4
        }
        })
        .then(function(response){
            document.querySelector(`.help-block.email-error`).innerText = "";
        })
        .catch(function(error){
          var error = error.response.data.errors.info_email[0];
          document.querySelector(`.help-block.email-error`).innerHTML = error;
        })
      })
    }
  }
  var _fiterColMain = document.querySelector('.fiterColMain');
  if(_fiterColMain){
    window.onscroll = function() {
    fiterColMainScroll();
    }
    window.onload = function() {
      fiterColMainScroll();
    }
  }
  function fiterColMainScroll() {
    if(window.screenWidth > 991)
    {
        var _windowTop              =  window.pageYOffset;
        var _filterSidebar = document.getElementById('filterSidebar');
        if(_filterSidebar)
          _filterSidebar = _filterSidebar.offsetTop;
        var _resultMainColum = document.getElementById('resultMainColum');
        if(_resultMainColum)
        _resultMainColum = _resultMainColum.offsetTop;
        var _searchListing  = document.querySelector('.searchListing');
        if(_searchListing) _searchListing = _searchListing.offsetTop-2200;
        var _filterColLeft  = document.querySelector('.filterColLeft');

        if(_windowTop > 10 && _windowTop < _searchListing){
        _fiterColMain.style.position = "fixed";
        _fiterColMain.style.width = "18.5%";
        _filterColLeft.style.marginTop = "38px";
        }
        else if(_windowTop >= _searchListing && _searchListing > 0){
            _fiterColMain.style.position = "unset";
            _fiterColMain.style.width = "unset";
            _filterColLeft.style.marginTop = "160px";
        } else {
          _fiterColMain.style.position = "unset";
          _fiterColMain.style.width = "unset";
          if(_filterColLeft)
            _filterColLeft.style.marginTop = "38px";
        }

    }
  }
