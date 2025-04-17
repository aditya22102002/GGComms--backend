const asyncHandler=(fn)=>async (req,res,next)=>{
    try {
       return  await fn(req,res,next)
    } catch (error) {
        return res.status(error.statuscode||500).json({
            success:false,
            message:error.message
        })
    }
}

// const asyncHandler=(requestHandler)=>{
//     (req,res,next)=>{
//         Promise.resolve.apply(requestHandler(req,res,next)).catch((err)=>next(err))
//     }
// }


export {asyncHandler}