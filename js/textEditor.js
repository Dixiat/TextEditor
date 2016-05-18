//预先检测浏览器对方法的支持，若不支持即自定义该函数
if (!String.prototype.splice) {
    String.prototype.splice = function(start, delCount, newSubstr) {
        return this.slice(0, start) + newSubstr + this.slice(start + Math.abs(delCount));
    };
}

/*//textarea元素获取选择文本的方法
function getSelctedText(elt) {
    "use strict";
    if (!elt.selectionStart || !elt.selectionEnd) {
        return null;
    }
    elt.strStart = elt.selectionStart;
    elt.strEnd = elt.selectionEnd;
    return elt.value.substring(elt.selectionStart, elt.selectionEnd);
}*/

//获取选取的文本
function getSelectedText(elem) {
    var selectedStr;
    if (window.getSelection) { // all browsers, except IE before version 9
        selectedStr = window.getSelection();
        if (selectedStr.anchorOffset < selectedStr.focusOffset) {
            elem.strStart = selectedStr.anchorOffset;
            elem.strEnd = selectedStr.focusOffset;
        } else {
            elem.strStart = selectedStr.focusOffset;
            elem.strEnd = selectedStr.anchorOffset;
        }

        return selectedStr.toString();
    } else {
        if (document.selection.createRange) { // Internet Explorer
            selectedStr = document.selection.createRange();
            return selectedStr.text;
        }
    }
}

//根据元素节点id获取元素节点的内容
function getContent(elem) {
    if (!elem) {
        return null;
    }
    if (typeof elem === "string") {
        elem = document.getElementById(elem);
    }
    return elem.value;
}

//更改textarea选取文本的样式
function changeTextStyle(elem, tag, style_class) {
    /* body... */
    if (!elem) return false;
    var selectedStr = getSelectedText(elem);
    if (!selectedStr) return false;
    var newStrStart = "<" + tag + " class='" + style_class + "'>";
    var newStrEnd = "</" + tag + ">";
    elem.strEnd += newStrStart.length;
    elem.innerHTML = elem.textContent.splice(elem.strStart, 0, newStrStart)
        .splice(elem.strEnd, 0, newStrEnd);
    // var textarea_txt = document.createTextNode(elem.value);
    // elem.value = "";
    // elem.appendChild(textarea_txt);

    alert(elem.innerHTML);
}

function execByElement(elem) {
    var command = elem.getAttribute("id");
    document.execCommand(command);
}

//返回用于绑定的命令执行函数
function addCommandHandler(command) {
    return function() {
        document.execCommand(command);
    };
}

function getRangeStatus() {
    //获取一个Selection对象
    var selection = window.getSelection();
    if (selection) {
        //获取被选中的第一个区块即Range对象
        var range = selection.getRangeAt(0);
        //选择范围的共同父元素
        var commonParentNode = range.commonAncestorContainer;
        if(commonParentNode.nodeType == 3) {
        	commonParentNode = commonParentNode.parentElement;
        }
    }

    alert(commonParentNode.tagName.toLowerCase());
    //设置计时器循环查询选取对象的状态
    // setTimeout(getRangeStatus, 50);
}

window.onload = function() {
    /*获取文本编辑器中各个元素节点*/
    //文本
    var title = document.getElementById("title"); //文本标题
    var author = document.getElementById("authot"); //文本作者
    var content = document.getElementById("content"); //文本域

    //工具栏按钮
    var buttons = document.getElementsByTagName("button");
    var btn_bold = buttons.bold;
    var btn_italic = buttons.italic;

    //操作按钮
    var btn_preview = document.getElementById("btn-preview");
    var btn_save = document.getElementById("btn-save");
    var btn_close = document.getElementById("btn-close");

    //命令种类
    var commandTypes = ["bold", "italic", "underline", "strikeThrough", "subscript",
        "superscript", "indent", "outdent", "justifyLeft", "justifyRight", "justifyCenter",
        "justifyFull", "redo", "undo", "removeFormat", "insertOrderedList", "insertUnorderedList"
    ];

    //样式节点种类
    var styleNodes = ["b","i","u","strike","ol","ul","sup","sub","div","article"];

    //为工具栏按钮绑定处理函数
    for (var i = 0; i < commandTypes.length; i++) {
        var commandType = commandTypes[i];
        buttons[commandType].onclick = addCommandHandler(commandType);
    }

    //循环查询选取对象状态
    btn_close.onclick = function() {
        getRangeStatus();
    };

};
