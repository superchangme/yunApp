//Step 1. 取消下面的注释开启simple插件，注意需要先进行插件安装 npm install -g fis-postpackager-simple
fis.config.set('modules.postpackager', 'simple');

//通过pack设置干预自动合并结果，将公用资源合并成一个文件，更加利于页面间的共用

//Step 2. 取消下面的注释开启pack人工干预
fis.config.set('pack', {
     './pkg/lib.js': [
          'js/vendor/jquery-1.10.2.min.js',
          'js/vendor/zepto.touch.js',
          'js/vendor/zepto.fx.js',
          'js/vendor/jquery-1.10.2c.min.js',
          'js/vendor/hammer.min.js',
          'js/vendor/hammer.fakemultitouch.js',
          'js/vendor/hammer.showtouches.js',
          'js/vendor/jcanvas.min.js',
          'js/plugins.js',
          'js/main.js'
     ],
     './pkg/lib.css':[
         "css/normalize.css",
         "css/main.css",
          "css/app2.css"
     ]
});


//Step 3. 取消下面的注释可以开启simple对零散资源的自动合并
// fis.config.set('settings.postpackager.simple.autoCombine', true);


//Step 4. 取消下面的注释开启图片合并功能
fis.config.set('roadmap.path', [{
     reg: '**.css',
     useSprite: true
}]);
fis.config.set("settings.spriter.csssprites",{scale:0.5,margin:20})
