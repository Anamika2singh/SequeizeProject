const model = require('../models')
const User = model.User
const Devices = model.Devices
const Photos = model.Photos
const BasicInfo = model.BasicInfo
const Locations = model.Locations
const Bio = model.Bio
const LikesDislikes = model.LikesDislikes
const HidePosts = model.HidePosts
const Interests = model.Interests
const {body, validationResult} = require("express-validator");
const Response = require('../helper/Response')
const Utill = require('../helper/Utility')
const CONSTANTS = require('../helper/Constant')
const {Op} = require("sequelize");
const logger = require('../utills/logger');
const Sequelize = require("sequelize")
const {Validator} = require('node-input-validator');
const moment = require('moment')
var cron = require('node-cron');

exports.uploadImage = [
    async (req, res) => {
        try {
            if (!req.files) {
                return Response.FailedResponseWithOutData(res, "Photos Is Required")
            }
            let result_arr = []
            let getOldPhotos = await Photos.findAll({where: {userId: req.userData.id}})
            for (const file of req.files) {
                let upload = await Utill.uploadFile(file.destination, file.filename, file.mimetype,
                    CONSTANTS.BUCKET + "/image")
                let insertData = {
                    userId: req.userData.id,
                    image_url: CONSTANTS.IMAGE_BASE_URL + file.filename,
                    image_name: file.filename
                }
                let createPhotos = await Photos.create(insertData)
                result_arr.push(createPhotos.dataValues)
            }
            if (getOldPhotos && getOldPhotos.length > 0) {
                result_arr.push(...getOldPhotos)
            }
            let updateUser = await User.update({profile_created: true}, {where: {id: req.userData.id}})
            return Response.SuccessContentData(res, "Image Uploaded Successfully", result_arr)
        } catch (err) {
            logger.info(`Upload Images err : ${err.message}`)
            return Response.SomethingWentWrong(res, err)

        }
    }
]

exports.basicInfo = [
    async (req, res) => {
        try {
            let fields = ['gender', 'origin_location', 'current_location', 'height', 'education', 'religion',
                'drinking_status', 'smoking_status', 'dates_purpose', 'latitude', 'longitude',
                'bio', 'name', 'age', 'exercise', 'snooze']
            let fetchData = {}
            for (const field of fields) {
                if (req.body[field]) {
                    fetchData[field] = req.body[field]
                }
            }
            let checkExist = await BasicInfo.findOne({where: {userId: req.userData.id}})
            if (!checkExist) {
                if (Object.keys(fetchData).length === 0) {
                    return Response.FailedResponseWithOutData(res, "Please Fill At Least One Field")
                }

                fetchData['userId'] = req.userData.id
                let createProfile = await BasicInfo.create(fetchData)
                let updateOtpStatus = await User.update({otp_verified: true}, {where: {id: req.userData.id}})
                return Response.SuccessContentData(res, "Basic Info Created", createProfile.dataValues)
            } else {
                console.log('update section')
                let [update] = await BasicInfo.update(fetchData, {where: {userId: req.userData.id}})
                if (!update) {
                    return Response.FailedResponseWithOutData(res, "Failed To Update Profile")
                }
                let getUpdatedData = await BasicInfo.findOne({where: {userId: req.userData.id}})
                return Response.SuccessContentData(res, "Profile Updated Successfully ", getUpdatedData)
            }
        } catch (err) {
            logger.info(`BasicInfo err : ${err.message}`)
            return Response.SomethingWentWrong(res, err)
        }
    }]

exports.getAllImage = [
    async (req, res) => {
        try {
            let getImages = await Photos.findAll({
                where: {userId: req.userData.id},
                attributes: ['id', 'image_url', 'image_name']
            })
            return Response.SuccessContentData(res, "Images Found Successfully ", getImages)
        } catch (err) {
            logger.info(`get All Image err : ${err.message}`)
            return Response.SomethingWentWrong(res, err)
        }
    }
]

exports.getBasicInfo = [
    async (req, res) => {
        try {
            let getBasicInfo = await BasicInfo.findOne({where: {userId: req.userData.id}})
            return Response.SuccessContentData(res, "Basic info  ", getBasicInfo)
        } catch (err) {
            logger.info(`get Basic info : ${err.message}`)
            return Response.SomethingWentWrong(res, err)

        }
    }
]

exports.createInterest = async (req, res) => {
    try {
        let response_arr = []
        let userId = req.userData.id
        let count = 0

        let deleteInterest = await Interests.destroy({where: {userId: req.userData.id}})
        if (req.body.creativity) {
            count++
            let creativity = req.body.creativity
            let response = await addData(userId, "creativity", creativity, res)
            // response_arr.push(response)
        }
        if (req.body.sports) {
            count++
            let sports = req.body.sports
            let response = await addData(userId, "sports", sports, res)
            // response_arr.push(response)
        }
        if (req.body.going_out) {
            count++
            let going_out = req.body.going_out
            let response = await addData(userId, "going_out", going_out, res)
            // response_arr.push(response)

        }
        if (req.body.staying_in) {
            count++
            let staying_in = req.body.staying_in
            let response = await addData(userId, "staying_in", staying_in, res)
            // response_arr.push(response)

        }
        if (req.body.film_tv) {
            count++
            let film_tv = req.body.film_tv
            let response = await addData(userId, "film_tv", film_tv, res)
            // response_arr.push(response)
        }
        if (count === 0) {
            return Response.FailedResponseWithOutData(res, "All Interests Is Empty")
        }
        let getInterest = await Interests.findAll({where: {userId: req.userData.id}})
        return Response.SuccessContentData(res, "Interests Added Successfully", getInterest)
    } catch (err) {
        return Response.SomethingWentWrong(res, err)

    }
}

const addData = async (userId, category, bodyData, res) => {
    try {
        let insert_arr = []
        for (let i = 0; i < bodyData.length; i++) {
            let insert_data = {
                userId: userId,
                category: category,
                value: bodyData[i]
            }
            insert_arr.push(insert_data)
        }
        return await Interests.bulkCreate(insert_arr)
    } catch (err) {
        return Response.SomethingWentWrong(res, err)
    }

}

exports.getInterest = async (req, res) => {
    try {
        let getInterest = await Interests.findAll({
            where: {userId: req.userData.id},
        })
        return Response.SuccessContentData(res, "Interest List Is", getInterest)

    } catch (err) {
        return Response.SomethingWentWrong(res, err)

    }
}

/* four section i.e basic info,photos,interest,bio each of  100/4=  25 points
*
* basic info ->consist of 10 points 25/10=2.5 of each field
*
* interest  -> divide into five category  sports, creativity, going_out, staying_in, film_tv  25/5= 5 of each point
*
* photos   ->maximum 6 photos 25/6= 4.16 of each photos
*
*bio ->one fields 25 points
*
*    */

exports.calculatePercentage = async (req, res) => {
    try {
        let points = 0, c = 0, bio_points, basic_info
        let getBasicInfo = await BasicInfo.findOne({where: {userId: req.userData.id}})
        let fields = ['gender', 'origin_location', 'current_location', 'height', 'education', 'religion',
            'drinking_status', 'smoking_status', 'dates_purpose', 'exercise', 'bio']
        if (getBasicInfo) {
            for (const value of fields) {
                if (!getBasicInfo[value]) console.log(value)
                if (getBasicInfo[value]) {
                    if (value === 'bio') {
                        c++
                        points = points + 25
                    } else {
                        c++
                        points = points + 2.5
                    }
                }
            }
        } else {
            points = 0
        }
        let getPhotosInfo = await Photos.findAll({where: {userId: req.userData.id}})
        let photos = getPhotosInfo.length
        points = points + photos * 6
        console.log(points)
        let getInterests = await Interests.findAll({
            where: {userId: req.userData.id},
            group: ['category']
        })
        points = points + getInterests.length * 5
        console.log(points)
        return Response.SuccessContentData(res, "Profile Calculation ", points)
    } catch (err) {
        return Response.SomethingWentWrong(res, err)

    }
}

exports.deleteImage = [
    async (req, res) => {
        try {
            /* get image name  from db */
            let getDetail = await Photos.findOne({where: {id: req.params.id, userId: req.userData.id}})
            if (!getDetail) {
                return Response.FailedResponseWithOutData(res, "No Photos Found")
            }
            let deleteS3 = await Utill.deleteS3File(getDetail.dataValues.image_name, CONSTANTS.BUCKET + "/image")
            console.log(deleteS3)
            let imageDelDb = await Photos.destroy({where: {id: req.params.id, userId: req.userData.id}})
            if (!imageDelDb) {
                return Response.FailedResponseWithOutData(res, "Failed To Delete Image")
            }
            return Response.SuccessResponseWithOutData(res, "Image Deleted Successfully")
        } catch (err) {
            logger.info(`delete Image  err : ${err.message}`)
            return Response.SomethingWentWrong(res, err)

        }
    }
]

exports.nearLocation = [
    async (req, res) => {
        try {
            let lat = 30.7390, lng = 76.7660
            let get = await BasicInfo.findAll({
                    where: {
                        [Op.and]: [
                            {gender: 'male'},
                            {
                                age: {
                                    [Op.between]: [20, 40]
                                }
                            },
                            Sequelize.where(Sequelize.literal("6371 * acos(cos(radians(" + lat + ")) * cos(radians(latitude)) * cos(radians(" + lng + ") - radians(longitude)) + sin(radians(" + lat + ")) * sin(radians(latitude)))"), '<=', 500),
                        ],
                    }
                }
            )
            res.json(get)
        } catch (err) {
            res.json(err.message)

        }
    }
]

exports.datesFilter = async (req, res) => {
    try {
        let v = await new Validator(req.body, {
            gender: 'required',
            age_lower: 'required|integer',
            age_higher: 'required|integer',
            distance: 'required|integer'
        })
        let check = await v.check()
        let gender = v.errors.gender ? v.errors.gender.message : ''
        let age_lower = v.errors.age_lower ? v.errors.age_lower.message : ''
        let age_higher = v.errors.age_higher ? v.errors.age_higher.message : ''
        let distance = v.errors.distance ? v.errors.distance.message : ''
        if (!check) {
            res.status(422).json({
                'statusCode': 422,
                'message': gender + age_lower + age_higher + distance
            })
        } else {
            let page = 1, limit = 10, skip
            if (req.params.page)
                page = parseInt(req.params.page)
            skip = (page - 1) * limit
            let filter = []
            if (req.body.gender)
                filter.push({gender: req.body.gender})

            if (req.body.age_higher && req.body.age_lower)
                filter.push({age: {[Op.between]: [parseInt(req.body.age_lower), parseInt(req.body.age_higher)]}})

            let lat = 30.7390, lng = 76.7660
            let filter_search = {}
            filter_search[Op.and] = [
                ...filter,
                {snooze: 0},
                Sequelize.where(Sequelize.literal("6371 * acos(cos(radians(" + lat + ")) * cos(radians(latitude)) * cos(radians(" + lng + ") - radians(longitude)) + sin(radians(" + lat + ")) * sin(radians(latitude)))"), '<=', parseInt(req.body.distance)),
            ]
            console.log(filter_search)
            /* get lat lng from Basic Profile */

            let getHidePost = await checkHide(req.userData.id)

            let hideProfile = getHidePost.map((ele) => ele.hide_user_id)
            console.log(hideProfile)
            let like = [72, 27]
            let getProfile = await User.findAll({
                where: {
                    id: {
                        [Op.notIn]: hideProfile,
                        [Op.ne]: req.userData.id

                    },
                },
                include: [
                    {
                        model: BasicInfo,
                        attributes: ['gender', 'age', [Sequelize.literal("6371 * acos(cos(radians(" + lat + ")) * cos(radians(latitude)) * cos(radians(" + lng + ") - radians(longitude)) + sin(radians(" + lat + ")) * sin(radians(latitude)))"), 'distance'],
                            'origin_location', 'current_location', 'height', 'education', 'drinking_status', 'smoking_status', 'religion', 'bio', 'age', 'snooze'],
                        where: filter_search
                    },
                    {
                        model: Photos,
                        attributes: ['image_url', 'image_name', ['id', 'photo_id']]
                    },
                    {
                        model: Interests,
                        attributes: ['category', 'value']
                    }

                ],
                limit: limit,
                offset: skip
            })
            return Response.SuccessContentData(res, "filter Profile", getProfile)
        }
    } catch (err) {
        logger.info(`dates filter err : ${err.message}`)
        return Response.SomethingWentWrong(res, err)

    }
}

exports.hidePost = async (req, res) => {
    try {
        let v = await new Validator(req.body, {
            hide_user_id: 'required|integer',
        })
        let check = await v.check()
        let hide_user_id = v.errors.hide_user_id ? v.errors.hide_user_id.message : ''
        if (!check) {
            res.status(422).json({
                'statusCode': 422,
                'message': hide_user_id
            })
        } else {
            let insert = {
                hide_by: req.userData.id,
                hide_user_id: req.body.hide_user_id,
                message: req.body.message ? req.body.message : '',
            }
            let insertData = await HidePosts.create(insert)
            return Response.SuccessResponseWithOutData(res, "Profile Reported Successfully")
        }

    } catch (err) {
        logger.info(`Hide Profile ${err.message}`)
        return Response.SomethingWentWrong(res, err)
    }
}

exports.likesDislikes = async (req, res) => {
    try {
        let v = await new Validator(req.body, {
            opponent_user_id: 'required|integer',
        })
        let check = await v.check()
        let opponent_user_id = v.errors.opponent_user_id ? v.errors.opponent_user_id.message : ''
        if (!check) {
            res.status(422).json({
                'statusCode': 422,
                'message': opponent_user_id
            })
        } else {
            let insertData = {
                action_user_id: 115,
                opponent_user_id: parseInt(req.body.opponent_user_id),
            }
            let create = await LikesDislikes.create(insertData)
            console.log(create)
            //  return res.end()
            //  let opponent_user_id = parseInt(req.body.opponent_user_id)
            //  let current_user = req.userData.id
            let getMatched = await LikesDislikes.findAll(
                {
                    where: {
                        [Op.or]: [
                            {
                                [Op.and]: [
                                    {action_user_id: 115},
                                    {opponent_user_id: 116},
                                ]
                            },
                            {
                                [Op.and]: [
                                    {action_user_id: 116},
                                    {opponent_user_id: 115}
                                ]
                            }
                        ]
                    },
                })

            let matchProfile = 0
            if (getMatched.length === 2) {
                let ids = getMatched.map(ele => ele.id)
                await LikesDislikes.update({status: 1}, {where: {id: ids}});
                matchProfile++
            }
            //

            //if length==2 then go to chat section status= 1
            //create table match preference and store both id
            //write crone function to delete it in 24 hrs

            console.log(getMatched.length)
            res.json(getMatched)
            //return Response.SuccessResponseWithOutData(res, "Profile Liked Successfully")
        }
    } catch (err) {
        logger.info(`Likes Dislikes  ${err.message}`)
        return Response.SomethingWentWrong(res, err)
    }
}

exports.test = async (req, res) => {
    try {
        let v = await new Validator(req.body, {
            mobile: 'required',
            password: 'required',

        })
        let check = await v.check()
        let mobile = v.errors.mobile ? v.errors.mobile.message : ''
        let password = v.errors.password ? v.errors.password.message : ''
        if (!check) {
            res.status(422).json({
                'statusCode': 422,
                'message': mobile + password
            })
        } else {
            console.log('test')
        }
    } catch (e) {


    }
}

//add route to handle this
exports.deleteLikes2 = async (req, res) => {
    try {
        let getAllLikes = await LikesDislikes.findAll({
            where: {
                status: 0,
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('HOUR'),
                        Sequelize.col('createdAt'),Sequelize.literal('CURRENT_TIMESTAMP'),
                        ), '>=', 6)
                ],
            }
        })
        // console.log(getAllLikes)
        res.json(getAllLikes)
    } catch (e) {
        res.json(e.message)

    }
}

const checkHide = async (id) => {
    return await HidePosts.findAll({where: {hide_by: id}, attributes: ['hide_user_id']})
}

cron.schedule('00 59 * * * *', () => {
    console.log('running a task an Hour');
});


// let getAllLikes = await LikesDislikes.findAll({
//         where:[Op.and]:[
//             Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '=', '2021-09-27')
//     ]
// })


// let getAllLikes = await LikesDislikes.findAll({
//     attributes: [
//         Sequelize.fn('TIMESTAMPDIFF', 'HOUR', 'CURRENT_TIMESTAMP', Sequelize.col('createdAt'))            ]
// })


exports.deleteLikes = async (req, res) => {
    try {
        let getAllLikes = await LikesDislikes.findAll({
            attributes: ['id','status','action_user_id','opponent_user_id', [Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('HOUR'),
                Sequelize.col('createdAt'), Sequelize.literal('CURRENT_TIMESTAMP'),
                ), "hours"]
            ],
        })
        //console.log(getAllLikes)
        res.json(getAllLikes)
    } catch (e) {
        res.json(e.message)

    }
}


