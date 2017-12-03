// get csrf from the html
export function getCsrf() {
  const inputElems = document.querySelectorAll('input');
  let csrfToken = '';
  for (let i = 0; i < inputElems.length; ++i) {
    if (inputElems[i].name === 'csrfmiddlewaretoken') {
      csrfToken = inputElems[i].value;
      break;
    }
  }
  return csrfToken;
};
