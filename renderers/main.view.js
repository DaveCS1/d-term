
const { remote } = require('electron');

let instances = [];

$('.console-option').on('click', ($event) => {
    $option = $($event.currentTarget);
    createConsoleInstance($option.data('console-type'));
});

createConsoleInstance = (consoleType) => {

    console.log('Creating instance', consoleType);

    let instance = new remote.BrowserWindow({
        width: 500,
        height: 350,
        tite: consoleType,
        parent: remote.getCurrentWindow()
    });

    instance.setMenu(null);
    instance.webContents.openDevTools();
    instance.loadFile(`${__dirname}/consoles/console.view.html`);

    instances.push(instance);

    instance.on('closed', function () {
        let idx = instances.indexOf(instance);
        instances.slice(idx, 1);
        this.instance = null;
        console.log('Instances', instances);
    });
}