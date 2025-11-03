// import React, { useEffect, useState } from "react";
// import { Upload, Button, Form } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { useI18n } from "@/app/providers/i18n";

// const UploadFileComponent = ({ max = 5, name = "file", label, fileList, setFileList, className, rules }) => {
//   const handleChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };
//   const i18n = useI18n();
//   const handleBeforeUpload = (file) => {
//     const isPDF = file.type === "application/pdf";
//     if (!isPDF) {
//       return Upload.LIST_IGNORE;
//     }
//     return true;
//   };

//   return (
//     <Form.Item label={label} name={name} rules={rules}>
//       <Upload
//         name={name}
//         accept=".pdf"
//         fileList={fileList}
//         beforeUpload={handleBeforeUpload}
//         onChange={handleChange}
//         maxCount={max}
//       >
//         <div className={`w-full border p-2 ${className} rounded-lg gap-2 flex`}><UploadOutlined />{i18n?.t('Click to Upload')}</div>
//       </Upload>
//     </Form.Item>
//   );
// };

// export default UploadFileComponent;



import React from "react";
import { Upload, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useI18n } from "@/app/providers/i18n";

const UploadFileComponent = ({
  max = 1,
  name = "evidence",
  label,
  fileList,
  setFileList,
  className = "",
  rules = [],
}) => {
  const i18n = useI18n();

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList ?? [];
  };

  const handleBeforeUpload = (file) => {
    const isPdf =
      file.type === "application/pdf" ||
      (file.name && file.name.toLowerCase().endsWith(".pdf"));
    if (!isPdf) {
      return Upload.LIST_IGNORE; // skip non-PDFs
    }
    return false; // prevent auto-upload
  };

  const handleChange = ({ fileList: newFileList }) => {
    if (max && newFileList.length > max) {
      newFileList = newFileList.slice(0, max);
    }
    setFileList?.(newFileList);
  };

  const handleRemove = (file) => {
    const next = (fileList || []).filter((f) => f.uid !== file.uid);
    setFileList?.(next);
    return true;
  };

  return (
    <Form.Item
      label={label}
      name={name}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={rules}
    >
      <Upload
        multiple
        accept=".pdf,application/pdf"
        listType="text"
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        onRemove={handleRemove}
        maxCount={max}
      >
        <div
          className={`w-full border p-2 rounded-lg gap-2 flex items-center cursor-pointer ${className}`}
        >
          <UploadOutlined />
          <span className="ml-2">{i18n?.t("Click to Upload")}</span>
        </div>
      </Upload>
    </Form.Item>
  );
};

export default UploadFileComponent;
