const { exec } = require('child_process')

let jsonText = '';

const childProcess = exec('rg --json --with-filename --column --line-number --color never -F materia /Users/alex/local/github/speed-sonic/vim-materia');
childProcess.stdout.on('data', content => {
  jsonText += content
})

childProcess.on('close', () => {
  const jsons = jsonText.replace(/\n$/, '').split('\n')
  console.log(jsons.length)
})
