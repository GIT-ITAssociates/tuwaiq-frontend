import { useUser } from "@/app/context/userContext"
import Image from "next/image"


const MainLoader = () => {
    
    return (
        <div
            style={{ zIndex: 99999 }}
            className="fixed left-0 w-full top-0 h-screen flex justify-center items-center bg-gray-500 bg-opacity-25" id="main-loader">
            <Loader />
        </div>
    )
}

export const showLoader = () => document.getElementById("main-loader").classList.remove('hidden')
export const hideLoader = () => document.getElementById('main-loader').classList.add('hidden')


export default MainLoader

export const Loader = () => {
    const {settings} = useUser()
    return (
        <div aria-label="Loading..." role="status" className="flex items-center  duration-500">
            <Image src={settings?.loader_image} alt="loader" width={100} height={100} className="w-[100px] h-[100px] duration-500" />
        </div>

    )
}

