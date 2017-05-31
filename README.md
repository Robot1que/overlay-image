## Instructions

To start the app run the following commands sequentially:
```
.\node_modules\.bin\gulp build
.\node_modules\.bin\webpack
.\dist\electron.exe .\dist\resources\app\Main.js
```

After the app is succesfully built copy custom images to `.\dist\resources\app\images\` folder and restart the app.

## Shortcuts
* `Esc` - quit the app / hide menu.
* `Spacebar` - open menu.
* (`Shift`+`-`) or (`Shift`+`=`) - decreace or increace the opacity of the image.

## Notes
Note that upon launch Chrome DevTools window can hide the app UI.