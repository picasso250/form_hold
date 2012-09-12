/** 保存和恢复form中填的数据
 * 用法：只需要在页面中包含这个js文件即可
 * using JSON so IE8+
 * using localStorage so IE10+, that's unecceptable! 或者说这个功能属于附属的奖励功能？
 * 每个页面有自己的不同的数据
 * 这是DEV版，是最新版，是激进版，可能包含若干BUG
 *
 * by: Ryan
 * version: 0.0.1b
 */

/*properties
    bind, change, checkboxes, checkboxs, click, each, find, fn, is, join,
    localStorage, location, others, parents, parse, pathname, prop, radios,
    restoreFrom, saveAs, split, stringify, val
*/

(function ($, window) {
    'use strict';
    if (JSON === undefined || window.localStorage === undefined) {
        return;
    }
    var getName = function (form) {
        return form.prop('name') || form.prop('id') || form.find('form').prop('name') || 'unique';
    };
    var getLocalPath = function (name) {
        return ['form_hold', window.location.pathname, name].join('.');
    };
    var getData = function (form) {
        var data = {radios: {}, checkboxes: {}, others: {}};
        form.find('input,textarea,select').each(function () {
            var name = $(this).prop('name');
            switch ($(this).prop('type')) {
            case 'radio':
                if ($(this).is(':checked')) {
                    data.radios[name] = $(this).val();
                }
                break;
            case 'checkbox':
                data.checkboxes[name] = $(this).prop('checked');
                break;
            case 'email':
            case 'text':
                data.others[name] = $(this).val();
                break;
            }
        });
        return data;
    };
    var saveToLocal = function (data, path) {
        var pathArr = path.split('.');
        var allData = window.localStorage[pathArr[0]] || null;
        allData = JSON.parse(allData) || {};
        var pageData = allData[pathArr[1]] || {};
        pageData[pathArr[2]] = data;
        allData[pathArr[1]] = pageData;
        window.localStorage[pathArr[0]] = JSON.stringify(allData);
    };
    var readLocal = function (path) {
        var pathArr = path.split('.');
        var allData = JSON.parse(window.localStorage[pathArr[0]] || null) || {};
        var pageData = allData[pathArr[1]] || {};
        return pageData[pathArr[2]] || {};
    };
    var fillForm = function (form, data) {
        var others = data.others || {};
        $.each(others, function (i, x) {
            var input = form.find('input[name=' + i + ']:not([disabled])');
            if (!input.val()) {
                input.val(x).change();
            }
            var textarea = form.find('textarea[name=' + i + ']:not([disabled])');
            if (!textarea.val()) {
                textarea.val(x).change();
            }
        });
//        for (i in others) { // 不要忘记触发change()事件哦
//            form.find('input[name=' + i + ']:not([disabled])').val(others[i]).change();
//            form.find('textarea[name=' + i + ']:not([disabled])').val(others[i]).change();
//        }

        var checkboxs = data.checkboxs || {};
        $.each(checkboxs, function (i, chk) {
            var c = form.find('input[type=checkbox][name=' + i + ']:not([disabled])');
            if (chk !== c.prop('checked')) { // 如果两个不同，就要单击一下
                c.click();
            }
        });
//        for (i in checkboxs) {
//            var c = form.find('input[type=checkbox][name=' + i + ']:not([disabled])');
//            if (checkboxs[i] ^ c.prop('checked')) { // 如果两个不同，就要单击一下
//                c.click();
//            }
//        }

        var radios = data.radios || {};
        $.each(radios, function (i, rd) {
            form.find('input[name=' + i + '][type=radio][value=' + rd + ']:not([disabled])').click();
        });
//        for (i in radios) {
//            form.find('input[name=' + i + '][type=radio][value=' + radios[i] + ']:not([disabled])').click();
//        }

    };
    $.fn.saveAs = function (name) {
        var form = $(this);
        name = name || getName(form);
        var data = getData(form);
        saveToLocal(data, getLocalPath(name));
        return form;
    };
    $.fn.restoreFrom = function (name) {
        return $(this).each(function () {
            var form = $(this);
            name = getName(form);
            var data = readLocal(getLocalPath(name));
            fillForm(form, data);
        });
    };
    $(function () {
        $('body').find('form').restoreFrom();
        $('input,textarea,select').bind('click change keyup', function () {
            $(this).parents('form').saveAs(); // 这里的效率！！！ 似乎可以pushValueOfInput(input); save();
        });
    });
})(jQuery, window);
