
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
const PlayButton = ({videoOpen}) => {
  return (
    <button
      className="group relative w-[66px] h-[66px] rounded-full bg-[#C3976A] hover:bg-[#B38A5E] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C3976A] focus:ring-offset-2"
      aria-label="Play video"
    >
      {/* Ripple effect circles */}
      <div className="absolute inset-0 rounded-full animate-ripple ">
        <div className="absolute inset-0 rounded-full border-2 border-[#C3976A] animate-ripple-1"></div>
        <div className="absolute inset-0 rounded-full border-2 border-[#C3976A] animate-ripple-2"></div>
      </div>

      {/* Play icon */}
      <div className="relative z-10 flex items-center justify-center w-full h-full ">
        {
          videoOpen ?
          <FaPause
          className="text-[17.14px] text-white ml-1 transition-transform duration-300 group-hover:scale-110"
        />
         :
         <FaPlay
         className="text-[17.14px] text-white ml-1 transition-transform duration-300 group-hover:scale-110"
       />
       
        }
        
      </div>

    
    </button>
  )
}

export default PlayButton

