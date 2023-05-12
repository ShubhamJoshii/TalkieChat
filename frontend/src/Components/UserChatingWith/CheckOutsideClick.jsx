import React,{useEffect, useRef} from 'react'

const CheckOutsideClick = ({props}) => {
    const ref = useRef(null);
    const { onClickOutside , children} = props;

    const handleClickOutside = (e) => {
        if(ref.current && !ref.current.contains(e.target)){
            onClickOutside && onClickOutside();
        }
    }
    useEffect(()=>{
        document.addEventListener("click",handleClickOutside,true);
        return () => {
            document.removeEventListener("click",handleClickOutside,true);
        }
    },[])
    if(!children){
        return null;
    }
  return (
    <div ref={ref}>{children}</div>
  )
}

export default CheckOutsideClick


