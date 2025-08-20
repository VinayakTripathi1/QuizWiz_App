import {toast} from 'react-toastify';
export const handleSuccess=(msg)=>
{
    toast.success(msg,{
        position:'top-right'
    })
}

export const handleError=(msg)=>{
    toast.error(msg,{
        position:'top-right'
    })
}

export const handlePleaseLogin=(msg)=>{
    toast.warn(msg,{
          position:'top-center'
    })
}