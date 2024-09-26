export const safePromise = async (callback: any, ...args: any) => {
  try {
    const res = await callback.apply(this, args);
    return [null, res];
  } catch (error) {
    return [error, null]; 
  }
};



// const safePromise2= (callback:any , ...args:any)=>{
//   try{

//     const res = await callback.apply(this, args);
//     return[null, res]
//   }catch(err){
//      return[err, null]
//   }
// }