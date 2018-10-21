
const { ipcRenderer } = require('electron');

$('.console-option').on('click', ($event) => {
    $option = $($event.currentTarget);
    ipcRenderer.send('create-console-instance', {
        id: $option.data('id'),
        name: $option.data('name')
    });
});
