const init = require('./init')
const splitter = require('./reed-solomon-splitter')


console.log('Let\'t get started !')
const context = init();
splitter(context, './video.mp4', 6, 3)