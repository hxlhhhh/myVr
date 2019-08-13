"use strict";
var inject = require('gulp-inject');
var gulp = require('gulp');

gulp.task('copy', function(done) {
    // 将你的默认的任务代码放在这
    return gulp.src('./views/index.html')
        .pipe(gulp.dest('./dest/dev'));
});
gulp.task('inject',function (done) {
    gulp.src('./views/index.html')
        .pipe(inject(gulp.src(['./public/**.css','./public/lib/**/*.css']), {
            starttag: '<!-- inject:FileContent:{{ext}} -->', // '<!-- -->'这是关键，判断插入位置
            endtag: '<!-- endinject -->',
            relative: true,
            transform: function (filePath, file) {
                if(filePath.slice(-4) === '.css'){
                    return '<style>' + file.contents.toString('utf8') + '</style>'
                }
                // 将文件内容作为字符串返回
                return file.contents.toString('utf8')
            }
        }))
        .pipe(gulp.dest('dist/'));
    done();
});
gulp.task('task3',function(done) {
    done();
});


gulp.task('default',
    gulp.series(gulp.parallel('copy', 'inject'),'task3'));
