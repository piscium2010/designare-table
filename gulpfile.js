const fs = require('fs')
const { series, src, watch } = require('gulp')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const less = require('gulp-less')
const tsProject = ts.createProject('tsconfig.json')
const merge = require('merge-stream')
const path = require('path')

function clean(next) {
    if (!fs.existsSync('dist')) { fs.mkdirSync('dist'); }
    rmDir('dist')
    next()
}

function stylesheet(next) {
    src('src/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist', { overwrite: true }))
    next()
}

function compile(next) {
    const tsOutput = src([
        'src/**/*.tsx',
        'src/**/*.ts',
        'src/**/*.js',
        'src/**/*.jsx'
    ])
        .pipe(tsProject())
    merge(tsOutput, tsOutput.js)
        .pipe(gulp.dest('dist', { overwrite: true }))
    next()
}

function copy(next) {
    copyFile('package.json', 'dist/package.json')
    copyFile('readme.md', 'dist/readme.md')
    next()
}

function copyFile(source, target) {
    fs.createReadStream(source).pipe(fs.createWriteStream(target));
}

function rmDir(dirPath, removeSelf = false) {
    let files
    try {
        files = fs.readdirSync(dirPath)
    }
    catch (e) {
        console.error(e)
        return;
    }

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let filePath = path.join(dirPath, files[i])
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
            else {
                rmDir(filePath, true)
            }
        }
    }

    if (removeSelf) {
        fs.rmdirSync(dirPath)
    }
}

exports.default = function() {
    series(clean, stylesheet, compile, copy)()
    watch('src/**/*', series(clean, stylesheet, compile, copy))
}