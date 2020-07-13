module.exports = () => {
    require('codemirror/lib/codemirror.css')
    require('codemirror/theme/idea.css')
    require('codemirror/theme/seti.css')
    require('codemirror/mode/javascript/javascript')
    require('codemirror/mode/vue/vue')
    require('codemirror/mode/css/css')
    require('codemirror/mode/htmlmixed/htmlmixed')
    // 代码折叠
    require('codemirror/addon/fold/foldcode')
    require('codemirror/addon/fold/foldgutter')
    require('codemirror/addon/fold/brace-fold')
    require('codemirror/addon/fold/comment-fold')
    require('codemirror/addon/fold/foldgutter.css')
    // 自动提示
    require('codemirror/addon/hint/show-hint.css')
    require('codemirror/addon/hint/show-hint')
    require('codemirror/addon/hint/html-hint')
    require('codemirror/addon/hint/css-hint')
    require('codemirror/addon/hint/javascript-hint')
    require('codemirror/addon/hint/anyword-hint.js')
    require('codemirror/keymap/sublime')
    // search
    require('codemirror/addon/search/search')
    require('codemirror/addon/search/jump-to-line')
    require('codemirror/addon/dialog/dialog.css')
    require('codemirror/addon/dialog/dialog')
    return require('codemirror')
}
