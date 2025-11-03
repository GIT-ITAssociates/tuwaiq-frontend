"use client";
import {FiSearch} from "react-icons/fi";
const SearchBar = ({className, wrapperClassName, value, onChange,style, placeholder}) => {


    return (
<div className={`relative flex mr-2  mb-[40px] items-center  searchBar  ${wrapperClassName || ''}`} style={style}>
    <FiSearch className="absolute right-3 text-[#818B8F] text-[24px] pointer-events-none" />
    <input
        className={`form-input w-full  text-base sm:text-sm border   px-[24px] py-[19px] rounded-lg border-[#E0E0E0] focus:outline-none transition-all duration-200 ease-in-out ${className || ''}`}
       
       
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Search here...'}
    />
</div>


    )
}
export default SearchBar
