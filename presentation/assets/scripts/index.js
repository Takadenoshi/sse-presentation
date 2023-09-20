function registerVideoToggle({ code }) {
  if (code === 'KeyV') {
    const video = document.querySelector('#video-cover');
    if (!video)
      return;
    const { display: prevDisplay } = video.style;
    video.style.display = prevDisplay === 'block' ? 'none' : 'block';
  }
}

function wrapAllSlideContents() {
  // remove the logosig from <body>
  // to then add it on all slides except title
  // - brings it over the slide background layer
  // - hides it on the title screen
  // - allows standalone slide generation (src is found in the html, but it wouldn't be found if we had the element/src here)
  const logosig = document.getElementById('logosig-icon');
  logosig.parentNode.removeChild(logosig);
  logosig.removeAttribute("id"); // non unique IDs are not good

  const slides = document.querySelectorAll('.slide:not(.titlepage)')

  slides.forEach((slide) => {
    const container = document.createElement('div')
    container.classList.add('container')

    const header = document.createElement('header')
    header.classList.add('wrapper')

    const content = document.createElement('div')
    content.classList.add('content')

    slide.querySelectorAll('h1').forEach((slideContent) => header.appendChild(slideContent))
    slide.querySelectorAll(':scope > *').forEach((slideContent) => content.appendChild(slideContent))

    container.appendChild(header)
    container.appendChild(content)
    slide.appendChild(logosig.cloneNode());

    slide.appendChild(container)
  })
}

wrapAllSlideContents();

document.addEventListener('keyup', registerVideoToggle, false);
