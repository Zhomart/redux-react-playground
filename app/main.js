"use strict";

require("./../styles/main.css")

const todoapp = require('./todolist/app.js');


document.addEventListener("DOMContentLoaded", function(event) {
  todoapp.init()
});
