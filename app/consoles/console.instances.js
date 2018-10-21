
exports.windows = [];

exports.track = (consoleWindow) => {

    console.log('Tracking', consoleWindow);

    this.windows.push(consoleWindow);

}