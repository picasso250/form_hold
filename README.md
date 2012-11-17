form_hold
=========

ATTATION: this is alpha version, not good enough for daily use. only for test. please help me to improve it.

form_hold 做什么 (What it does)
-------------------------------

hold住整个form. 在刷新页面时也可以保证表单中的值不被清空。只需要在页面中包括一个js文件就可以做到这一点。支持IE8+, FireFox, Chrome等

注：如果一个页面中包含多个表单，只需给每个表单赋予不同的name属性即可。

jquery.form_hold.js auto save the form date user input. It's a single javascript file will hold values of all fields of all forms from certain page when refreshing or after reopen the browser.
Support IE8+, Firefox, Chrome, .etc.

If you want to include more forms in one page, you must name each form with a different name.

How it works:
Auto save values of fields to loacal storage when user input or choose an option.
Using JSON and window.localStorage

There is another [jQuery autosave plug-in](http://rikrikrik.com/jquery/autosave/), also maintained [here](https://github.com/sg552/auto_save),  but it saves data to cookie, which is of course more universal meanwhile not so light weight. They are old and reliable than mine.

为什么用这个方法？ (Why use this way, the JavaScript way, rather than PHP way?)
-------------------------------------------------------------------------------

你会说，我们可以使用php来达到一样的效果。是的，除了一点点：那就是如果不提交表单，用户填写的值就会被清空。而form_hold可以做到即使不提交表单，内容已经在本地存储了。（类似新浪微博的发表框，也类似一些浏览器插件）

Yes, we can use php to do the same thing except that form content will lost if user has not submit.

用法 Usage
----------

在页面中包含jquery.form_hold.js这个js文件

Include file jquery.form_hold.js, That's it.

* jquery.form_hold.js 最新的稳定版
* jquery.form_hold.dev.js 开发中的最新版

TODO List
---------
1. 将值改为只获取当前值，并推入数据
