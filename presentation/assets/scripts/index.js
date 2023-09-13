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

    slide.appendChild(container)
  })
}

wrapAllSlideContents();

document.addEventListener('keyup', registerVideoToggle, false);
