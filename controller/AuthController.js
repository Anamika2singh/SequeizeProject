const model = require('../models')
const User = model.User
const Devices = model.Devices
const BasicInfo = model.BasicInfo
const {body, validationResult} = require("express-validator");
const Response = require('../helper/Response')
const Utill = require('../helper/Utility')
const Photos = model.Photos
const Interests = model.Interests
const logger = require('../utills/logger');

const {Validator} = require('node-input-validator');

exports.register = async (req, res) => {
    try {
        let v = await new Validator(req.body, {
            signup_type: 'required',
            plateform: 'required',
            device_token: 'required'

        })
        let check = await v.check()
        let signup_type = v.errors.signup_type ? v.errors.signup_type.message : ''
        let plateform = v.errors.plateform ? v.errors.plateform.message : ''
        let device_token = v.errors.device_token ? v.errors.device_token.message : ''
        if (!check) {
            res.status(422).json({
                'statusCode': 422,
                'message': signup_type + plateform + device_token
            })
        } else {
            if (!req.body.instagram_id && !req.body.mobile_number) {
                return Response.FailedResponseWithOutData(res, "Mobile Number or Instagram Id Required")
            }
            /* signup type==0 for mobile 1 for instagram */

            /* signup or login with mobile */
            if (req.body.signup_type == 0) {
                if (!req.body.mobile_number) {
                    return Response.FailedResponseWithOutData(res, "Mobile Number Required")
                }

                let checkExist = await User.findOne({
                    where: {mobile_number: req.body.mobile_number},
                })

                /* if user Exist return photos basic info   and interest length*/
                if (checkExist) {
                    let token = Utill.generateToken(checkExist.dataValues)
                    let {mobile_number, id, profile_created, country_code,otp_verified} = checkExist.dataValues
                    let user_details = formatDocument(mobile_number, id, token, profile_created, req.body.signup_type, country_code,otp_verified)
                    const photos = await getPhotos(id)
                    user_details.photos = photos
                    const BasicInfo = await getBasicInfo(id)
                    user_details.BasicInfo = BasicInfo
                    const getInterest=await getInterestLength(id)
                    user_details.selected_interest_length=getInterest
                    return Response.SuccessSignUp(res, "Login Successful", user_details, 200)
                }

                /* for new user signup with mobile*/
                console.log('new users')
                if (!req.body.country_code) {
                    return Response.FailedResponseWithOutData(res, "Country Code Required")
                }
                let insertData = {
                    mobile_number: req.body.mobile_number,
                    signup_type: req.body.signup_type,
                    country_code: req.body.country_code,
                }
                let createUsers = await User.create(insertData)
                let token = Utill.generateToken(createUsers.dataValues)
                let {mobile_number, id, profile_created, country_code,otp_verified} = createUsers.dataValues
                let device_details = {
                    userId: createUsers.dataValues.id,
                    plateform: req.body.plateform,
                    device_token: req.body.device_token,
                }
                await Devices.create(device_details)
                let user_details = formatDocument(mobile_number, id, token, profile_created, req.body.signup_type, country_code,otp_verified)
                user_details.selected_interest_length=0
                return Response.SuccessSignUp(res, "Signup Successful", user_details, 201)
            }

            /* signup or login with instagram */

            if (req.body.signup_type == 1) {
                if (!req.body.instagram_id) {
                    return Response.FailedResponseWithOutData(res, "Instagram Id Is Required")
                }
                let checkInstagramId = await User.findOne({
                    where: {instagram_id: req.body.instagram_id},
                })
                /* for   Existing user  return photos and basic info  */
                if (checkInstagramId) {
                    let token = Utill.generateToken(checkInstagramId.dataValues)
                    let {instagram_id, id, profile_created,otp_verified} = checkInstagramId.dataValues
                    let user_details = formatDocument(instagram_id, id, token, profile_created, req.body.signup_type, "",otp_verified)
                    const photos = await getPhotos(id)
                    const BasicInfo = await getBasicInfo(id)
                    user_details.photos = photos
                    user_details.BasicInfo = BasicInfo
                    const getInterest=await getInterestLength(id)
                    user_details.selected_interest_length=getInterest
                    return Response.SuccessSignUp(res, "Login Successfully", user_details, 200)
                }
                console.log('new users')
                /* for a new user */
                let insertDatas = {
                    instagram_id: req.body.instagram_id,
                    signup_type: req.body.signup_type,
                }
                let createNewUsers = await User.create(insertDatas)
                let token = Utill.generateToken(createNewUsers.dataValues)
                let {instagram_id, id, profile_created,otp_verified} = createNewUsers.dataValues
                let device_details = {
                    userId: createNewUsers.dataValues.id,
                    plateform: req.body.plateform,
                    device_token: req.body.device_token,
                }
                await Devices.create(device_details)
                let user_details = formatDocument(instagram_id, id, token, profile_created, req.body.signup_type, "",otp_verified)
                user_details.selected_interest_length=0
                return Response.SuccessSignUp(res, "SignUp Successfully", user_details, 201)
            } else {
                return Response.FailedResponseWithOutData(res, "SingUp Type Is Only  0 and 1 ")
            }
        }
    } catch (err) {
        logger.info(`AuthController ${err.message}`)
        return Response.SomethingWentWrong(res, err)
    }
}

const formatDocument = (mobile_number, id, token, profile_created, type, country_code,otp_verified) => {
    let user_details = {}
    if (type == 0) {
        user_details.mobile_number = mobile_number
        user_details.country_code = country_code
    } else user_details.instagram_id = mobile_number
    user_details.id = id
    user_details.profile_created = profile_created
    user_details.token = token
    user_details.otp_verified = otp_verified
    return user_details
}

const getPhotos = async (id) => {
    return await Photos.findAll({where: {userId: id}})
}

const getBasicInfo = async (id) => {
    return await BasicInfo.findOne({where: {userId: id}})
}
const getInterestLength=async (id)=>{
    let getInterest= await Interests.findAll({where: {userId: id}})
    return getInterest.length

}