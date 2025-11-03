import { Upload } from "antd";
import { AiOutlineDownload } from "react-icons/ai";

const UploadFileComponent = ({ children, className, max = 1, name = "file", childClassName, onChange }) => {
  const props = {
    name: name,
    accept: ".pdf",
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        alert("Only PDF files are allowed!");
      }
      return isPDF || Upload.LIST_IGNORE;
    },
    multiple: max > 1,
    maxCount: max,
    onChange: ({ fileList }) => onChange && onChange(fileList),
  };

  return (
    <Upload {...props} className={className}>
      <div className={`flex gap-2 items-center text-base font-sans rounded-[10px] ${childClassName}`}>
        {children}
      </div>
    </Upload>
  );
};

export default UploadFileComponent; // ✅ Ensure default export
