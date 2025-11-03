"use client";
import Button from "@/app/components/common/button";
import FormInput, { HiddenInput } from "@/app/components/common/form/input";
import JodiEditor from "@/app/components/common/form/jodiEditor";
import MultipleImageInput from "@/app/components/common/form/multiImage";
import UploadFileComponent from "@/app/components/common/form/pdfUpload";
import Table, { TableImage } from "@/app/components/common/table/table";
import PageTitle from "@/app/components/common/title/title";
import {
  delService,
  getServiceList,
  pdfFileUpload,
  postService,
  postSingleImage,
} from "@/app/helpers/backend";
import { useAction, useFetch } from "@/app/helpers/hooks";
import { columnFormatter, noSelected } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import { Form, Modal } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const page = () => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  let { languages, langCode } = useI18n();
  const [data, getData, { loading }] = useFetch(getServiceList);

  const [isEdit, setIsEdit] = useState(false);
  const [selectedLang, setSelectedLang] = useState(langCode);
  const [open, setOpen] = useState(false);
  const [formData, setFromData] = useState([]);
  const [fileLists, setFileLists] = useState({});
  const {push}=useRouter();

  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  const columns = [
    {
      text: i18n?.t("Create At"),
      dataField: "createdAt",
      formatter: (_, d) => {
        return <div>{dayjs(d?.createdAt).format("MMM DD, YYYY")}</div>;
      },
    },
    {
      text: i18n?.t("icon"),
      dataField: "icon",
      formatter: (_, d) => {
        return <TableImage url={d?.icon || "/images/no-image.png"} />;
      },
    },
    {
      text: i18n.t("image"),
      dataField: "image",
      formatter: (_, d) => {
        return <TableImage url={d?.image || "/images/no-image.png"} />;
      },
    },
    {
      text: i18n.t("Name"),
      dataField: "name",
      formatter: (value) => columnFormatter(value),
    },
    {
      text: i18n.t("Description"),
      dataField: "description",
      formatter: (_, value) => {
        return <div className="line-clamp-1">{columnFormatter(value?.description)?.slice(0,40)}</div>;
      },
    },
  ];

  const handleFileListChange = (index, newFileList) => {
    setFileLists((prev) => ({
      ...prev,
      [index]: newFileList,
    }));
  };

  const handleSubmit = async (values) => {
    setSelectedLang(langCode);
    let imageUrl, iconUrl, feature;

    if (values?.image?.[0]?.originFileObj) {
      const image = values.image[0]?.originFileObj;
      const { data } = await postSingleImage({ image, image_name: "image" });
      imageUrl = data;
    } else {
      imageUrl = values?.image?.[0]?.url || "";
    }

    if (values?.icon?.[0]?.originFileObj) {
      const icon = values.icon[0]?.originFileObj;
      const { data } = await postSingleImage({
        image: icon,
        image_name: "icon",
      });
      iconUrl = data;
    } else {
      iconUrl = values?.icon?.[0]?.url || "";
    }

    const multiLangFields = ["name", "description", "otherDescription"];
    const formattedData = multiLangFields.reduce((acc, field) => {
      acc[field] = {};
      languages.forEach((lang) => {
        if (values[field] && values[field][lang.code]) {
          acc[field][lang.code] = values[field][lang.code];
        }
      });
      return acc;
    }, {});

    if (values?.feature) {
      feature = await Promise.all(
        values.feature.map(async (i) => {
          if (i?.file?.fileList?.[0]?.originFileObj ) {
            const { error, data } = await pdfFileUpload({
              files: i?.file?.fileList?.[0]?.originFileObj || i?.file,
            });

            if (error) {
              return { name: i?.name, file: i?.file, description: i?.description };
            }

            return {
              name: i?.name,
              file: data || i?.file,
              description: i?.description,
            };
          }
          return {
            name: i?.name,
            file: i?.file,
            description: i?.description,
          };
        })
      );
      feature = feature?.filter((f) => {
       return f?.name[langCode] || f?.description[langCode] || f?.file
      });
    }
    

    return useAction(
      values?._id ? postService : postService,
      { ...formattedData, feature, icon: iconUrl, image: imageUrl,_id:values?._id },
      () => {
        setOpen(false);
        getData();
      }
    );
  };

  return (
    <div>
      <PageTitle title={i18n?.t("Service")} />
      <Table
        columns={columns}
        data={data}
        loading={loading}
        onReload={getData}
        onView={(values)=>{
          push(`/admin/service/${values?._id}`)
        }}
        action={
          <Button
            onClick={() => {
              form.resetFields();
              setOpen(true);
              setIsEdit(false);
              setFileLists({});
            }}
          >
            {i18n?.t("Add Service")}
          </Button>
        }
        onEdit={(values) => {
          setOpen(true);
          setIsEdit(true);
        
          const initialFileLists = {};
          
          values?.feature?.forEach((item, index) => {
            if (item?.file) {
              initialFileLists[index] = [
                {
                  uid: "-1",
                  name: `service-${index+1}.pdf`,
                  status: "done",
                  url: item?.file,
                },
              ];
            }
          });
          setFileLists(initialFileLists);
        
          form.setFieldsValue({
            ...values,
            _id: values?._id,
            image: values?.image
              ? [
                  {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: values.image,
                  },
                ]
              : [],
            icon: values?.icon
              ? [
                  {
                    uid: "-1",
                    name: "icon.png",
                    status: "done",
                    url: values.icon,
                  },
                ]
              : [],
            feature: values?.feature?.map((item) => ({
              ...item,
              name: item?.name,
              description: item?.description,
            })) || [],
          });
        }}
        onDelete={delService}
        indexed
        pagination
        langCode={langCode}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={i18n?.t(
          isEdit
            ? i18n?.t("Edit Service")
            : i18n?.t(
                "Add Service"
              )
        )}
        footer={null}
        destroyOnClose={true}
        width={1000}

      >
        <div className="flex justify-start flex-wrap gap-3 py-3">
          {languages?.map((l, index) => (
            <button
              onClick={() => setSelectedLang(l.code || langCode)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              key={index}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div className="h-[600px] overflow-y-auto scroll-container">
         <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-5"
        >
         <HiddenInput name="_id" />
          {languages?.map((l, index) => (
            <div
              key={index}
              style={{ display: l.code === selectedLang ? "block" : "none" }}
            >
              <FormInput
                name={["name", l.code]}
                label={i18n.t("Name")}
                placeholder={i18n.t("Name")}
                key={index}
                required
              />

              <FormInput
                name={["description", l.code]}
                label={i18n.t("Description")}
                placeholder={i18n.t("Description")}
                textArea
                key={index}
                required
              />
              <div className="mt-6">
                <p className="text-sm text-[#4A5568] font-medium">
                  {i18n?.t("Other Description")}{" "}
                  <span className="text-primary">*</span>
                </p>
                <JodiEditor name={["other_description", l.code]} required />
              </div>
            </div>
          ))}
          <p className="my-3 font-medium text-sm text-[#4A5568] capitalize">{i18n?.t("feature")}</p>
          <Form.List name={"feature"}>
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ name, key }, index) => (
        <div key={key} className="flex flex-col gap-4 border p-3">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            {languages?.map((lang, langIndex) => (
              <div
                key={langIndex}
                style={{ display: lang?.code === selectedLang ? "block" : "none" }}
              >
                <FormInput
                  name={[name, "name", lang?.code]}
                  label={"Name"}
                  rules={[
                    {
                      validator(_, value) {
                        if (value?.trim()) {
                          return Promise.resolve();
                        }
                        if (value < 0) {
                          return Promise.reject(
                              new Error(i18n?.t("please enter name"))
                          );
                        }
                      
                        return Promise.reject(
                          new Error(i18n?.t("Please enter name"))
                        );
                      }
                    }
                  ]}
                />
              </div>
            ))}

            <UploadFileComponent
              max={1}
              name={[name, "file"]}
              label={i18n?.t("Upload PDF File")}
              fileList={fileLists[index] || []}
              setFileList={(newFileList) => handleFileListChange(index, newFileList)} 
              className={'p-2'}
            />
          </div>

          {languages?.map((lang, langIndex) => (
            <div
              key={langIndex}
              className="!border !p-3"
              style={{ display: lang?.code === selectedLang ? "block" : "none" }}
            >
              <p className="text-sm text-[#4A5568] font-medium">
                {i18n?.t("Description")} <span className="text-primary">*</span>
              </p>
              <JodiEditor
                name={[name, "description", lang?.code]}
              />
            </div>
          ))}

          {fields.length > 1 && (
            <div className="mb-6">
              <FaMinusCircle
                className="text-red-600 text-xl"
                onClick={() => remove(index)}
              />
            </div>
          )}
        </div>
      ))}

      <div
        className={`${
          fields.length > 1 ? "mt-0" : "mt-6"
        } bg-slate-500 text-white flex items-center justify-start gap-2 px-3 py-2 ml-auto rounded-full w-fit cursor-pointer`}
        onClick={() => add()}
      >
        <FaPlusCircle /> {i18n?.t("Add Feature")}
      </div>
    </>
  )}
          </Form.List>
          <div className="flex gap-4">
          <MultipleImageInput name="icon" label={i18n?.t("icon")} max={1} required />
          <MultipleImageInput name="image" label={i18n?.t("image")} max={1} required />
          </div>
   
          <Button
            type="submit"
            onClick={() => noSelected({ form, setSelectedLang })}
            className="mt-2.5"
          >
            {i18n?.t("Submit")}
          </Button>
        </Form>
        </div>
      </Modal>
    </div>
  );
};

export default page;
