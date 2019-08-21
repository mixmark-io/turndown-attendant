var test = require('tape').test

function Attendant (options) {
  this.test = test
  this.document = getDocument(options.file)
  this.TurndownService = options.TurndownService
  this.beforeEach = options.beforeEach || function id (input) { return input }
}

Attendant.prototype = {
  run: function () {
    var testCases = this.document.querySelectorAll('.case')
    for (var i = 0; i < testCases.length; i++) {
      runTestCase.call(this, testCases[i], { beforeEach: this.beforeEach })
    }
  }
}

function getDocument (file) {
  if (typeof window === 'undefined') {
    var JSDOM = require('jsdom').JSDOM
    var fs = require('fs')
    var dom = new JSDOM(fs.readFileSync(file).toString())
    return dom.window.document
  } else {
    return document
  }
}

function runTestCase (testCase, options) {
  var testCaseName = testCase.getAttribute('data-name')
  var jsonOptions = testCase.getAttribute('data-options')
  var turndownServiceOptions = jsonOptions ? JSON.parse(jsonOptions) : {}
  var turndownService = new this.TurndownService(turndownServiceOptions)
  options.beforeEach(turndownService)

  var inputElement = testCase.querySelector('.input')
  var expectedElement = testCase.querySelector('.expected')
  var expected = expectedElement.textContent
  var output = turndownService.turndown(inputElement)
  var outputElement = this.document.createElement('pre')
  outputElement.className = 'output'
  testCase.insertBefore(outputElement, inputElement.nextSibling)
  outputElement.textContent = output

  var outputHeading = this.document.createElement('h3')
  outputHeading.className = 'output-heading'
  outputHeading.textContent = 'output'
  testCase.insertBefore(outputHeading, outputElement)

  var heading = this.document.createElement('h2')
  heading.className = 'test-case-heading'
  heading.textContent = testCaseName
  testCase.insertBefore(heading, inputElement)

  var inputHeading = this.document.createElement('h3')
  inputHeading.className = 'input-heading'
  inputHeading.textContent = 'Input'
  testCase.insertBefore(inputHeading, inputElement)

  var expectedHeading = this.document.createElement('h3')
  expectedHeading.className = 'expected-heading'
  expectedHeading.textContent = 'Expected Output'
  testCase.insertBefore(expectedHeading, expectedElement)

  if (output !== expected) {
    expectedElement.className += ' expected--err'
    expectedHeading.className += ' expected-heading--err'
    outputElement.className += ' output--err'
  }

  this.test(testCaseName + ' (DOM)', function (t) {
    t.plan(1)
    t.equal(output, expected)
  })
}

module.exports = Attendant
