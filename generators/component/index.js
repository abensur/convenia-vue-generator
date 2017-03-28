/* eslint-disable */
const generators = require('yeoman-generator')
const _          = require('lodash')
const fs         = require('fs')
const path       = require('path')
const inject     = require('gulp-snippet-injector').inject

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments)

        this.getViews = function (dir) {
            return fs.readdirSync(dir).filter(function (file) {
                return fs.statSync(path.normalize(dir + '/' + file)).isDirectory()
            })
        }
    },

    initializing: function () {
        this.log('Pronto para criar um componente: ')
    },

    prompting: function () {
        var questions = [{
            type: 'list',
            name: 'view',
            message: 'Pertence à alguma view? ',
            choices: this.getViews(this.destinationPath('src/components'))
        }, {
            type: 'input',
            name: 'component',
            message: 'Nome?',
            default: 'componenteSemNome'
        }]

        return this.prompt(questions).then(function (answers) {
            this.viewName = answers.view
            this.component = _.startCase(answers.component).replace('\ ', '')
            this.componentName = _.camelCase(this.component)
        }.bind(this))
    },

    configuring: function () { },

    'default': function () { },
    
    writing: {
        generate: function () {
            this.fs.copyTpl(
                this.templatePath('index.vue'),
                this.destinationPath('src/components/' + this.viewName + '/' + this.component + '.vue'),
                {
                    componentName: this.componentName
                }
            )
        }
    },

    conflicts: function () { },
    end: function () { }
})