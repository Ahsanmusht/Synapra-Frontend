/**
* Template Name: Arsha
* Updated: Sep 18 2023 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/arsha-free-bootstrap-html-template-corporate/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Initiate  glightbox 
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

})()



// ################## LOGIN FUNCTION STARTS HERE !!!!!!!!!!!

function Login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const URL = "http://localhost:5000/login";

  // Using Axios for the HTTP request
  axios
    .post(URL, {
      email: email,
      password: password,
    })
    .then((res) => {
      if (res.status === 200) {

        localStorage.setItem("token", res.data.token)

        // Success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
        }).then(() => {
          // Redirect to /profile after clicking the "OK" button
          window.location.href = '/dashboard/dashboard';
        });
      } else {
        // Handle other success cases or unexpected response
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message || "Unexpected response format",
        });
      }
    })
    .catch((err) => {
      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response ? err.response.data.message : "An error occurred while processing your request",
      });
    });
}


// ################## SEND MESSAGE FUNCTION STARTS HERE !!!!!!!!!!!

async function SendMessage() {
  try {
    // Get form input values
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let subject = document.getElementById("subject").value;
    let message = document.getElementById("message").value;


    const URL = "http://localhost:5000/send-message";

    // Make a POST request using axios
    const response = await axios.post(URL, {
      name,
      email,
      subject,
      message
    });

    // Check if the response contains a message
    if (response.data && response.data.message) {
      // Show success message using SweetAlert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      }).then(()=> {
        window.location.reload()
      })   
    }else{
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.data.message,
      }) 
    }
  } catch (error) {
    console.error(error);

    // Show error message using SweetAlert
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response.data.message || JSON.stringify(error),
    });
  }
}


async function GetAllMessage() {
  const URL = "http://localhost:5000/all-messages";

  try {
    const response = await axios.get(URL);

    const message = response.data.Message;
    // Get the tbody element
    const tbody = document.getElementById("message-tbody");

    // Clear existing rows
    tbody.innerHTML = "";

    // Iterate through blogs and append rows to tbody
    message.map((message) => {
      const row = `<tr>
      <td>${message.name}</td>
      <td>${message.email}</td>
      <td>${message.subject}</td>
      <td>${message.message}</td>
      <td>
          <!-- Delete icon. You can customize this as needed -->
          <button onclick="deleteMessage('${message._id}')" class="btn btn-danger btn-circle btn-sm">
              <i class="fas fa-trash"></i>
          </button>
      </td>
  </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error(err);

    // Display a more informative error message using Swal
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response.data.message
    });
  }
}


function deleteMessage(id) {
  const URL = `http://localhost:5000/delete-message/${id}`;

  axios
    .delete(URL)
    .then((res) => {
      if (res.data && res.data.message) {
        // Show success message using Swal
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
        }).then(() => {
          // Refresh the page
          location.reload();
        });
      } else {
        console.error("Unexpected response format:", res);

        // Show error message using Swal with the message from the backend
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message || "Unexpected response format",
        });
      }
    })
    .catch((err) => {
      // Show error message using Swal
      Swal.fire({
        icon: "error",
        title: "Error",
        text:  err.response.data.message || JSON.stringify(err),
      });
    });
}