"use strict";

var DELETE_PATH = 'http://localhost:3000/delete-all';

window.onload = function () {
  var deleteAll = document.getElementById('delete-all');
  deleteAll.addEventListener('click', deleteAllHandler);
};

function deleteAllHandler() {
  fetch(DELETE_PATH).then(function (response) {
    console.log(response);
    return response.text();
  }).then(function (text) {
    return console.log(text);
  });
}