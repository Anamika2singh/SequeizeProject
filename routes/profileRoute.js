const express = require('express')
const router = express.Router()
const ProfileController = require('../controller/ProfileController')
const JwtMiddleWere = require('../middlewere/jwtVerify')
const path=require("path")
const multer = require("multer")
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/images/'), function (err, succ) {
            if (err)
                throw err

        });
    },
    filename: function (req, file, cb) {
        var name = (Date.now() + Date.now() + file.originalname);
        name = name.replace(/ /g, '-');
        cb(null, name, function (err, succ1) {
            if (err)
                throw err

        });
    }
});
const uploads = multer({storage: storage});

/*   upload Photos    */

router.post('/upload-photos',JwtMiddleWere,uploads.any() ,ProfileController.uploadImage)

/*    get  photos    */

router.get('/get-photos',JwtMiddleWere,ProfileController.getAllImage)

/*      basic info   */

router.post('/basic-info',JwtMiddleWere,ProfileController.basicInfo)

/*      get basic info   */

router.get('/get-basic-info',JwtMiddleWere,ProfileController.getBasicInfo)

/*      insert interest */

router.post('/interest',JwtMiddleWere,ProfileController.createInterest)


router.get('/get-interest',JwtMiddleWere,ProfileController.getInterest)

/*      delete photos    */

router.delete('/delete-image/:id',JwtMiddleWere,ProfileController.deleteImage)


router.get('/profile-percentage',JwtMiddleWere,ProfileController.calculatePercentage)

/*      dates filter   */

router.post('/date-filter',JwtMiddleWere,ProfileController.datesFilter)


router.post('/date-filter/:page',JwtMiddleWere,ProfileController.datesFilter)

/*     hide or block */

router.post('/hide-post',JwtMiddleWere,ProfileController.hidePost)

/*     like dislike the profile */

router.post('/likes-dislike',JwtMiddleWere,ProfileController.likesDislikes)

/*      write crone function */

router.get('/delete-likes-dislike',ProfileController.deleteLikes)


router.get('/location',ProfileController.nearLocation)


router.post('/test',ProfileController.test)


module.exports = router