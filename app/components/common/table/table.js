import {
  FaEye,
  FaPencilAlt,
  FaRegEdit,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { message, Modal } from "antd";
import { useState } from "react";
import Pagination from "../pagination/pagination";
import { useI18n } from "@/app/providers/i18n";
import SearchInput from "../form/search";
import { useActionConfirm } from "@/app/helpers/hooks";
import { Loader } from "../loader";
import { MdDeleteForever } from "react-icons/md";

const Table = ({
  columns,
  data,
  indexed,
  loading = false,
  noActions,
  actions,
  action,
  onView,
  onSendContract,
  onEdit,
  onDelete,
  onReload,
  pagination = false,
  shadow = true,
  title,
  noHeader = false,
  afterSearch,
  onSearchChange,
  langCode,
}) => {
  const i18n = useI18n();

  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;

  const currentLanguage = i18n?.languages?.find(
    (lang) => lang?._id === langFromLocalStorage
  )?.name;

  const handleEditClick = (data) => {
    onEdit(data);
  };

  const handleDeleteClick = async (data) => {
    if (onDelete) {
      await useActionConfirm(
        onDelete,
        { _id: data._id },
        onReload,
        "Are you sure you want to delete this item?",
        "Yes, Delete"
      );
    }
  };

  let cols = noActions
    ? columns
    : [
        ...columns,
        {
          text: i18n?.t("Action"),
          dataField: "no_actions",
          className: "w-44 text-right",
          formatter: (noActions, data) => {
            return (
              <div className="flex justify-end gap-2">
                {actions && actions(data)}
                {data?.status === "accept" && data?.appointment_id && (
                  <button
                    className="bg-primary text-white px-3 py-2 rounded-[10px] font-medium text-sm hover:opacity-90 transition"
                    onClick={() => {
                      // 👉 Place your scheduling logic here
                      console.log("Schedule Appointment clicked for:", data?._id);
                      onSendContract(data);
                    }}
                  >
                    {currentLanguage === "Arabic"
                      ? "إرسال العقد"
                      : "Send Contract"}
                  </button>
                )}
                {onView && (
                  <button
                    className="border  rounded-full hover:bg-green-600 border-green-700 text-green-700 hover:text-white duration-300 px-2 py-2 flex items-center justify-center"
                    title="View"
                    onClick={() => onView(data)}
                  >
                    <FaEye size={20} />
                  </button>
                )}
                {data.disableEdit === 1 &&
                  !onView &&
                  data.disableDelete === 1 &&
                  !actions &&
                  "-"}
                {onEdit && data?.disableEdit !== 1 && (
                  <button
                    className="border border-yellow-600 rounded-full hover:border-yellow-600 text-yellow-600  hover:bg-yellow-600 hover:text-white duration-300 !px-2 p-1 flex items-center justify-center"
                    title="Edit"
                    onClick={() => handleEditClick(data)}
                  >
                    <FaPencilAlt size={12} />
                  </button>
                )}
                {onDelete && data?.disableDelete !== 1 && (
                  <button
                    className="border border-red-500 rounded-full hover:border-red-600 text-red-500 p-1  hover:bg-red-400 hover:text-white duration-300  flex items-center justify-center"
                    title="Delete"
                    onClick={() => handleDeleteClick(data)}
                  >
                    <MdDeleteForever size={20} />
                  </button>
                )}
              </div>
            );
          },
        },
      ];

  return (
    <>
      <div
        className={`w-full bg-white ${
          shadow ? "shadow-lg" : ""
        } rounded-md mb-4 `}
      >
        {noHeader || (
          <header className="px-4 pt-3 pb-2 border-b gap-3 border-gray-100 flex justify-between flex-wrap">
            {title ? (
              <>
                {typeof title === "string" ? (
                  <h4 className="text-base font-medium text-[#003049]">
                    {i18n?.t(title)}
                  </h4>
                ) : (
                  title
                )}
              </>
            ) : (
              <div className="flex flex-wrap">
                <SearchInput
                  className="w-44"
                  onChange={(e) => {
                    const search = e.target.value || undefined;
                    onReload({ search, langCode, page: 1 });
                    onSearchChange && onSearchChange(search, langCode);
                  }}
                />
                {afterSearch}
              </div>
            )}
            {action}
          </header>
        )}
        <div className={`px-3 pt-3 pb-1 relative `}>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase bg-gray-50 text-gray-500">
                <tr>
                  {indexed && (
                    <th className="p-2 whitespace-nowrap !work-font">
                      <div className="font-semibold text-left">#</div>
                    </th>
                  )}
                  {cols?.map((column, index) => (
                    <th
                      className={`p-1 whitespace-nowrap text-left`}
                      key={index}
                    >
                      <div
                        className={`font-semibold ${column?.className || ""}`}
                      >
                        {i18n?.t(column?.text)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td className="h-96 pb-16">
                      <div
                        style={{ height: 200 }}
                        className="absolute w-full flex justify-center duration-500"
                      >
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {(pagination ? data?.docs : data)?.map((row, index) => (
                      <tr key={index}>
                        {indexed && (
                          <td className="p-2 whitespace-nowrap text-gray-500">
                            {(pagination ? (data?.page - 1) * data.limit : 0) +
                              index +
                              1}
                          </td>
                        )}
                        {cols?.map((column, index) => (
                          <td
                            className={`p-2 whitespace-nowrap text-gray-700 ${
                              column?.className || ""
                            }`}
                            key={index}
                          >
                            {column.formatter
                              ? column.formatter(row[column.dataField], row)
                              : row[column.dataField] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="pt-3 mt-3 border-t">
              <Pagination
                page={data?.page}
                total={data?.totalDocs}
                onSizeChange={(limit) => onReload({ limit, langCode })}
                limit={data?.limit}
                totalPages={data?.totalPages}
                onPageChange={(page) => onReload({ page, langCode })}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;

export const DetailTable = ({ data, columns, title, actions }) => {
  const i18n = useI18n();
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      {!!title && (
        <div className="text-xl font-semibold mb-4">{i18n?.t(title)}</div>
      )}
      <div className="body">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <tbody>
              {columns?.map((column, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-2 px-4 font-medium">
                    {i18n?.t(column?.text)}
                  </td>
                  <td className="py-2 px-4 text-sm">
                    {!!data
                      ? !!column?.formatter
                        ? column?.formatter(data[column.dataIndex], data)
                        : data[column.dataIndex]
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {actions}
      </div>
    </div>
  );
};

export const TableImage = ({ url }) => {
  const [image, setImage] = useState();
  return (
    <div className="w-inline-block h-8">
      <img
        role="button"
        src={url}
        className="object-cover w-fit h-fit "
        alt="Image"
        onClick={() => setImage(url)}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
      <Modal
        width={800}
        open={image}
        onCancel={() => setImage(undefined)}
        footer={null}
        bodyStyle={{ padding: 0, zIndex: 60 }}
        closeIcon={
          <FaTimes
            size={18}
            className="  rounded hover:!bg-none text-primary"
          />
        }
      >
        <div className="flex justify-center items-center">
          <img
            className="w-100 "
            style={{ minHeight: 400 }}
            src={image}
            alt=""
          />
        </div>
      </Modal>
    </div>
  );
};
