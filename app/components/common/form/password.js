"use client";
import { useI18n } from "@/app/providers/i18n";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const FormPassword = ({
  setPasswordLength,
  password,
  setPassword,
  name,
  label,
  placeholder,
  confirm,
  rules = [], // ✅ accept custom rules
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const i18n = useI18n();

  // Password strength calc
  const calculateStrength = (pass) => {
    let hasLower = /[a-z]/.test(pass);
    let hasUpper = /[A-Z]/.test(pass);
    let hasNumber = /[0-9]/.test(pass);
    let hasSpecial = /[^A-Za-z0-9]/.test(pass);

    let typesCount = hasLower + hasUpper + hasNumber + hasSpecial;

    if (pass?.length < 8) return 0; // Too short
    if (typesCount === 1) return 1; // Weak
    if (typesCount === 2) return 2; // Medium
    if (typesCount >= 3) return 3; // Strong

    return 0;
  };

  const strengthLabels = ["too short", "weak", "medium", "strong"];
  const strengthColors = ["#ff4d4f", "#ff4d4f", "#faad14", "#28A745"];
  const passwordStrength = calculateStrength(password);

  useEffect(() => {
    setPasswordLength?.(password.length);
  }, [password.length]);

  const defaultRules = [
  {
    required: true,
    message: i18n?.t("Please enter your password"),
  },
  {
    validator: (_, value) => {
      if (!value) {
        // Let the required rule handle empty case
        return Promise.resolve();
      }

      if (value.length < 8) {
        return Promise.reject(
          new Error(i18n?.t("Password must be at least 8 characters"))
        );
      }

      if (calculateStrength(value) < 2) {
        return Promise.reject(new Error(i18n?.t("Password is too weak")));
      }

      return Promise.resolve();
    },
  },
];


  return (
    <Form.Item
      name={name}
      label={
        <p className="text-base font-medium text-[#242628]">
          {label || i18n?.t("Password")}
        </p>
      }
      rules={[...defaultRules, ...rules]} // ✅ merge custom rules
    >
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || "**************"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {password && !confirm && (
        <div className="space-y-1 pt-[12px] w-full">
          <div className="flex gap-4 h-[6px]">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    index < passwordStrength
                      ? strengthColors[passwordStrength]
                      : "#e8e8e8",
                }}
              />
            ))}
          </div>
          <div className="text-xs text-black flex justify-between pt-1 gap-[16px]">
            {strengthLabels.slice(1).map((i, index) => (
              <div
                key={index}
                className={`w-1/3 text-xs font-medium capitalize ${
                  index + 1 === passwordStrength
                    ? "text-[#28A745]"
                    : "text-[#818B8F]"
                }`}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      )}
    </Form.Item>
  );
};

export default FormPassword;



// "use client";
// import { useI18n } from "@/app/providers/i18n";
// import { Form } from "antd";
// import { useEffect, useState } from "react";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// const FormPassword = ({setPasswordLength,password, setPassword, noCurrent, required, min, confirm, label, checkPassword, placeholder, name }) => {
//     const [showPassword, setShowPassword] = useState(false);
//     const i18n=useI18n();
//       const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);

//     // Password strength calculation
//     const calculateStrength = (pass) => {
//         let hasLower = /[a-z]/.test(pass);
//         let hasUpper = /[A-Z]/.test(pass);
//         let hasNumber = /[0-9]/.test(pass);
//         let hasSpecial = /[^A-Za-z0-9]/.test(pass);

//         let typesCount = hasLower + hasUpper + hasNumber + hasSpecial;

//         if (pass?.length < 8) return 0; // Too short (weak)
//         if (typesCount === 1) return 1; // Weak
//         if (typesCount === 2) return 2; // Medium
//         if (typesCount >= 3) return 3; // Strong

//         return 0;
//     };

//     const strengthLabels = ["too short", "weak", "medium", "strong"];
//     const strengthColors = ["#ff4d4f", "#ff4d4f", "#faad14", "#28A745"];
//     const passwordStrength = calculateStrength(password);
//     let rules = [
//         { required, message: "Please enter a password" },
//         { min: confirm ? 0 : min, message: "Password must be at least 8 characters" },
//     ];
//     useEffect(()=>{
//         setPasswordLength(password.length)
//     },[password.length]);
    
//      return (
//         <Form.Item
//             name={name}
//             label={<p className="text-base font-medium text-[#242628]">{label || "Password"}</p>}
//             rules={password ? rules : []}
//         >
//             <div className="relative">
//                 <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder={placeholder || "**************"}
//                     onChange={(e) =>  setPassword(e.target.value)}
//                     className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px]"
//                 />
//                 <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className={`absolute ${defaultLang?.rtl?"left-3":"right-3"} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600`}
//                 >
//                     {showPassword ?<FiEye size={16} />  : <FiEyeOff size={16} />}
//                 </button>
//             </div>

//             {/* Password Strength Indicator */}
//             {password && !confirm && (
//                 <div className="space-y-1 pt-[12px] w-full">
//                     <div className="flex gap-4 h-[6px]">
//                         {[...Array(3)].map((_, index) => (
//                             <div
//                                 key={index}
//                                 className="flex-1 rounded-full transition-all duration-300"
//                                 style={{
//                                     backgroundColor: index < passwordStrength ? strengthColors[passwordStrength] : "#e8e8e8",
//                                 }}
//                             />
//                         ))}
//                     </div>
//                     <div className="text-xs text-black flex justify-between pt-1 gap-[16px]">
//                         {strengthLabels.slice(1).map((i, index) => (
//                             <div
//                                 key={index}
//                                 className={`w-1/3 text-xs font-medium capitalize ${
//                                     index + 1 === passwordStrength ? "text-[#28A745]" : "text-[#818B8F]"
//                                 }`}
//                             >
//                                 {i}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </Form.Item>
//     );
// };

// export default FormPassword;
