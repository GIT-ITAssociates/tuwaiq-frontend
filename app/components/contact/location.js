"use client";
const Location = () => {
    return (
        <div className='w-full custom-container xl:mb-[150px] md:mb-14 mb-[60px]'>
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49471.03598205848!2d89.52891534741151!3d22.84108963684329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff9b952e7b24af%3A0xae7655bcfe3f6c35!2sAppstick!5e0!3m2!1sen!2sbd!4v1738438245621!5m2!1sen!2sbd"
                width="100%"
                height="508"
                style={{ border: "0" ,borderRadius:"40px",padding:"20px"}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
};

export default Location;

