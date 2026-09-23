const API_URL = 'https://v2.jokeapi.dev/joke/Any?safe-mode';

const button = document.querySelector('#new-joke');
const status = document.querySelector('#status');
const setup = document.querySelector('#setup');
const delivery = document.querySelector('#delivery');
const errorMessage = document.querySelector('#error');

function clearJoke() {
  setup.textContent = '';
  delivery.textContent = '';
}

async function getJoke() {
  button.disabled = true;
  status.textContent = 'Finding a good one…';
  errorMessage.hidden = true;
  clearJoke();

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('The joke service is unavailable.');

    const joke = await response.json();
    if (joke.error) throw new Error('The joke service returned an error.');

    if (joke.type === 'single') {
      setup.textContent = joke.joke;
    } else {
      setup.textContent = joke.setup;
      delivery.textContent = joke.delivery;
    }
    status.textContent = 'Here is your joke:';
  } catch (error) {
    status.textContent = 'Sorry!';
    errorMessage.textContent = `${error.message} Please try again.`;
    errorMessage.hidden = false;
  } finally {
    button.disabled = false;
  }
}

button.addEventListener('click', getJoke);
