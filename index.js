var path = require('path');
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var glob = require('glob');
var win = null;
var cwd = process.cwd();
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var browserGlob = argv['browser'];
var browserRunner = require('./browser');
var rendererGlob = argv['renderer'];
var fixtureGlob  = argv['fixture'];

require('babel-register');

app.on('window-all-closed', app.quit);

app.on('ready', function onReady() {
  win = new BrowserWindow({ title: 'Tests' });

  if (fixtureGlob) {
    glob(fixtureGlob, function (err, files) {

        win.loadURL(path.join('file://', path.resolve(cwd, files[0])));

    });
  } else {
    win.loadURL(path.join('file://', __dirname, 'index.html'));
  }

  win.webContents.on('did-finish-load', function onDidFinishLoad() {
    win.openDevTools();
    browserRunner(browserGlob);
    win.webContents.send('run', rendererGlob);
  });

  win.on('closed', function onClose() { win = null; });
});
