/**
 * Created by Administrator on 2016/9/30.
 */
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
app = express();
var bodyParser = require("body-parser");
var router = express.Router();
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use('/files',express.static(__dirname + '/files'));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res, next) {
  console.info(req.query)
  res.render('index', {title: 'Express'});
});
app.post('/file_upload', function (req, res, next) {
  var form = new multiparty.Form({uploadDir: './files/'});
  //上传完成后处理
  form.parse(req, function (err, fields, files) {
    var filesTmp = JSON.stringify(files, null, 2);
    if (err) {
      console.log('parse error: ' + err);
    } else {
      console.log('filesTmp: ' + filesTmp);
      var inputFile = files.inputFile[0];
      var uploadedPath = inputFile.path;
      var dstPath = './files/' + inputFile.originalFilename;
      //重命名为真实文件名
      fs.rename(uploadedPath, dstPath, function (err) {
        if (err) {
          console.log('rename error: ' + err);
        } else {
          console.log('rename ok');
        }
      });
    }
    res.send(fields.username[0] + '上传成功,他的密码是：' + fields.pwd[0] +'<br><img src="'+dstPath+'" />');
  });
});
var server = app.listen(3000, function () {
  console.log(server.address());
});