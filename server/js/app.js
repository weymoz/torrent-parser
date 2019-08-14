const DELETE_PATH = 'http://localhost:3000/delete-all';
window.onload = function() {
  const deleteAll = document.getElementById('delete-all');
  deleteAll.addEventListener('click', deleteAllHandler);
}

function deleteAllHandler() {
  fetch(DELETE_PATH)
    .then(response => {
      console.log(response);
      return response.text();
    })
    .then(text => console.log(text));
}
