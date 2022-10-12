export function createPopupContent(props) {
  return `
    <p class="popup-title">${props.name}<p/>
    <p>Дата основания: ${props.foundation}<p/>
    <p>${props.capital} - центр штата ${props.name}<p/>
  `;
}
