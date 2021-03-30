import {validate} from "class-validator";
import {plainToClass} from "class-transformer";
//validation middleware
export const validateBody=<T>(cls:any,skipMissingProperties=false)=>{
  return  async (req,res,next)=>{

    let obj=plainToClass(cls,req.body);

    let errors=await validate(obj,{skipMissingProperties});
    if(errors.length>0)
      {
        let errlist:object[]= errors.map(er=>Object.values(er.constraints))
        res.status(400).send(errlist)
      }
      else{
        next();
     }


  }
}

