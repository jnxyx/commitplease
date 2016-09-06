var process = require('child_process')
var command = 'git config --get core.commentchar'

var scissor = /# ------------------------ >8 ------------------------[\s\S]+/

var comment = null

function initComment () {
  try {
    comment = process.execSync(command).toString().trim()
  } catch (error) {
    comment = '#'

    // console.log('Suppressing an error from ' + command)
    // console.log('Possible reasons for error:')
    // console.log(' 1. "core.commentchar" defaults to #')
    // console.log(' 2. This is *not* a git repository')
    // console.log(' 3. This is a git submodule')
    // console.log('Maybe something else, no reliable way to know')
  }
}

module.exports = function (value) {
  if (comment === null) initComment()

  var isComment = new RegExp('^' + comment)
  return value.replace(scissor, '').split(/\n/).filter(function (line) {
    return !isComment.test(line)
  }).join('\n').trim()
}
