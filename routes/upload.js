var fs = require('fs');
var express = require('express');
var multer = require('multer');

var router = express.Router();
var upload = multer({dest: 'upload_tmp/'});

router.post('/', upload.any(), function(req, res, next)
{
    console.log(req.files[0]);
    var des_file = "./public/videos/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function(err, data)
    {
        fs.writeFile(des_file, data, function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originname
                };
                console.log(response);
                res.send(JSON.stringify(response));
            }
        });
    });
});

module.exports = router;
