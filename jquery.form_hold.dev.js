/** 保存和恢复form中填的数据
 * 用法：只需要在页面中包含这个js文件即可
 * 这是dev版，也就是最新版
 * using JSON so IE8+
 * using localStorage so IE10+, that's unecceptable! 或者说这个功能属于附属的奖励功能？
 * 每个页面有自己的不同的数据
 * by: Ryan
 * version: 0.0.1
 */

(function ($) {
    if (JSON===undefined || window.localStorage ===undefined) return;
    var getName = function (form) {
        return form.prop('name') || form.prop('id') || form.find('form').prop('name') || 'unique';
    };
    var getLocalPath = function (name) {
        return ['form_hold',location.pathname,name].join('.');
    };
    var getData = function (form) {
        var data = {radios:{},checkboxes:{},others:{}};
        form.find('input,textarea,select').each(function () {
            var name = $(this).prop('name');
            switch ($(this).prop('type')) {
                case 'radio':
                    if ($(this).is(':checked')) data.radios[name] = $(this).val();
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
        var allData = window.localStorage[pathArr[0]];
        allData = JSON.parse(allData);
        var pageData = allData[pathArr[1]] || {};
        return pageData[pathArr[2]] || {};
    };
    var fillForm = function (form, data) {
        var others = data.others || {};
        for (i in others) { // 不要忘记触发change()事件哦
            form.find('input[name='+i+']:not([disabled])').val(others[i]).change();
            form.find('textarea[name='+i+']:not([disabled])').val(others[i]).change();
        }

        var checkboxs = data.checkboxs || {};
        for (i in checkboxs) {
            var c = form.find('input[type=checkbox][name='+i+']:not([disabled])');
            if (checkboxs[i] ^ c.prop('checked')) { // 如果两个不同，就要单击一下
                c.click();
            }
        }

        var radios = data.radios || {};
        for (i in radios) {
            form.find('input[name='+i+'][type=radio][value='+radios[i]+']:not([disabled])').click();
        }
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
    $('body').find('form').restoreFrom();
    $(function () {
        $('input,textarea,select').bind('click change keyup', function () {
            $(this).parents('form').saveAs();
        });
    });
})(jQuery);
