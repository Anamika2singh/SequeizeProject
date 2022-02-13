module.exports = {
    SuccessWithData: (res,message,data) => {
        return res.status(200).json({
            statusCode: 200,
            message: message,
            user_details: data,
        });
    },
    SuccessResponseWithData: (res, msg, data) => {
        return res.status(200).json({
            statusCode: 200,
            message: msg,
            user_details: data,
        });
    },
    SuccessResponseWithOutData: (res, msg) => {
        return res.status(200).json({
            statusCode: 200,
            message: msg,

        });
    },
     SuccessResponseData: (res, data) => {
        return res.status(200).json({
            statusCode: 200,
            details: data,

        });
    },
    SuccessContentData: (res,message, data) => {
        return res.status(200).json({
            statusCode: 200,
            message: message,
            data: data,
        });
    },
    FailedResponseWithData: (res, msg, data) => {
        return res.status(400).json({
            statusCode: 400,
            message: msg,
            data: data

        });
    },

    FailedResponseWithOutData: (res, msg) => {
        return res.status(400).json({
            statusCode: 400,
            message: msg,

        });
    },
    InternalServerError: (res, e) => {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            error: e.message,
        });
    },
    SomethingWentWrong: (res, e) => {
        return res.status(400).json({
            statusCode: 400,
            message: "Something Went Wrong",
            error: e.message
        });
    },
    SessionTimeOut: (res, e) => {
        return res.status(400).json({
            statusCode: 400,
            message: "SessionTimeOut Login Again",
            error: e.message
        });
    },
    UnAuthorized: (res, msg) => {
        return res.status(401).json({
            statusCode: 401,
            message: msg,
        });

    },
    NotFound: (res, msg) => {
        return res.status(404).json({
            statusCode: 404,
            message: msg,
        });
    },
    Duplicate: (res) => {
        return res.status(400).json({
            statusCode: 400,
            message: "Duplicate Email It Is Already Register",
        });
    },
    ValidationError: (res, err) => {
        return res.status(422).json({
            statusCode: 422,
            message: err,
        });
    },
    LoginSuccessFull: (res, data) => {
        return res.status(200).json({
            statusCode: 200,
            message: "Login SuccessFull",
            user_details: data,
        });
    },
    SignUpSuccessFull: (res, data) => {
        return res.status(200).json({
            statusCode: 200,
            message: "SignUp SuccessFull",
            user_details: data,
        });
    },
    SignUpFailed: (res,message) => {
        return res.status(400).json({
            statusCode: 400,
            message: message,
        });
    },
    LoginFailed: (res, message) => {
        return res.status(400).json({
            statusCode: 400,
            message: message
        });
    },
    validationErrorWithData: (res, data) => {
        return res.status(400).json({
            statusCode: 400,
            validationError: data,

        });

    },

    SuccessSignUp: (res, message,data,statusCode) => {
        return res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            data:data,

        });
    },
};



