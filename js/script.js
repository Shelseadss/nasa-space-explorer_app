// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);


// ADD THE API REQUEST

// Find the button
const getImagesButton = document.getElementById('getImagesButton');
const gallery = document.getElementById('gallery');
const spaceFact = document.getElementById('spaceFact');

const spaceFacts = [
  'A day on Venus is longer than a year on Venus.',
  'Neutron stars can spin hundreds of times per second.',
  'There are more stars in the universe than grains of sand on Earth.'
];

function displayRandomFact() {
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  spaceFact.textContent = `${spaceFacts[randomIndex]}`;
}

displayRandomFact();

// create API function
async function getSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate || startDate > endDate) {
    throw new Error('Please choose a valid date range.');
  }

  const apiUrl =
    `https://api.nasa.gov/planetary/apod` +
    `?api_key=jfcRmqcNLMdJWbnMhKLHChLmkBhg7pdCpczCDTJf` +
    `&start_date=${startDate}` +
    `&end_date=${endDate}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'NASA images could not be loaded.');
  }

  if (!Array.isArray(data)) {
    throw new Error(data.msg || 'NASA returned an unexpected response.');
  }

  return data;
}

// Create one gallery card for each space photo returned by NASA
function displayGallery(spaceImages) {
  gallery.innerHTML = '';

  spaceImages.forEach((spaceImage) => {
    if (spaceImage.media_type === 'image') {
      const galleryItem = document.createElement('article');
      galleryItem.className = 'gallery-item';

      const image = document.createElement('img');
      image.src = spaceImage.url;
      image.alt = spaceImage.title;

      const title = document.createElement('h2');
      title.textContent = spaceImage.title;

      const date = document.createElement('p');
      date.textContent = spaceImage.date;

      galleryItem.append(image, title, date);
      galleryItem.addEventListener('click', () => openModal(spaceImage));
      gallery.appendChild(galleryItem);
    } else if (spaceImage.media_type === 'video') {
      const galleryItem = document.createElement('article');
      galleryItem.className = 'gallery-item';

      const title = document.createElement('h2');
      title.textContent = spaceImage.title;

      const date = document.createElement('p');
      date.textContent = spaceImage.date;

      const videoLink = document.createElement('a');
      videoLink.href = spaceImage.url;
      videoLink.target = '_blank';
      videoLink.rel = 'noopener noreferrer';
      videoLink.textContent = 'Watch NASA video';
      galleryItem.append(title, date, videoLink);
      gallery.appendChild(galleryItem);
    }
  });
}

// Load new space photos when the user clicks the button
getImagesButton.addEventListener('click', async () => {
  gallery.innerHTML = '<p>🔄 Loading space photos...</p>';
  getImagesButton.disabled = true;

  try {
    const spaceImages = await getSpaceImages();
    displayGallery(spaceImages);
  } catch (error) {
    gallery.innerHTML = `
      <p>Sorry, the space photos could not be loaded.</p>
      <p>${error.message}</p>
    `;
    console.error(error);
  } finally {
    getImagesButton.disabled = false;
  }
});


//Modal Behavior
const modal = document.getElementById('imageModal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModalButton = document.getElementById('closeModal');

function openModal(spaceImage) {
  modalMedia.innerHTML = '';

  const image = document.createElement('img');
  image.src = spaceImage.hdurl || spaceImage.url;
  image.alt = spaceImage.title;

  modalMedia.appendChild(image);
  modalTitle.textContent = spaceImage.title;
  modalDate.textContent = spaceImage.date;
  modalExplanation.textContent = spaceImage.explanation || 'No explanation is available for this entry.';
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

// Close the modal when the user clicks the close button
closeModalButton.addEventListener('click', closeModal);

// Close the modal when the user clicks outside the modal content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close the modal when the user presses Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});