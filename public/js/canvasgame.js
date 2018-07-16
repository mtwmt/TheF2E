'use strict';

var canvas = document.getElementById('canvas');

if (canvas.getContext) {
  var ctx = canvas.getContext('2d');
  // drawing code here
  // console.log(456)
  alert(555);
} else {
  // canvas-unsupported code here
  console.log(123);
}

// canvas.width = 400;
// canvas.height = 400;