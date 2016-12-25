// For vendors for example jQuery, Lodash, angular2-jwt just import them here unless you plan on
// chunking vendors files for async loading. You would need to import the async loaded vendors
// at the entry point of the async loaded file. Also see custom-typings.d.ts as you also need to
// run `typings install x` where `x` is your module

// TODO(gdi2290): switch to DLLs

// 临时解决加载顺序问题，2.4.1左右的版本需要先加载 reflect polyfill

import 'core-js/es7/reflect';

// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/forms';
import '@angular/http';
import '@angular/router';

// RxJS
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import '../node_modules/codemirror/addon/comment/comment.js';
import './public/js/codemirror-mode-hosts.js';

import './public/css/styles.css';

if ('production' === process.env.ENV) {
  // Production


} else {
  // Development

}
