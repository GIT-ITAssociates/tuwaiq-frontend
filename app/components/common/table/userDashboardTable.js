"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Empty, Modal } from "antd";
import { Loader } from "../loader";
import Pagination from "../pagination/pagination";
import { useI18n } from "@/app/providers/i18n";
import Image from "next/image";
const UserDashboardTable = ({
    columns,
    data,
    indexed,
    loading = false,
    actions,
    onView,
    onEdit,
    onDelete,
    onReload,
    pagination = false,
}) => {
    const i18n = useI18n();
    const { langCode } = useI18n();

    const handleEditClick = (data) => {
        onEdit(data);

    };
    const handleDeleteClick = async (data) => {
        if (onDelete) {
            await useActionConfirm(
                onDelete,
                { _id: data._id },
                onReload,
                'Are you sure you want to delete this item?',
                'Yes, Delete'
            );
        }
    };

    let cols = columns
        ? columns
        : [
            ...columns,
            {
                text: "Action",
                dataField: "no_actions",
                className: "w-44 text-right",
                formatter: (noActions, data) => {
                    return (
                        <div className="flex justify-end gap-2.5">
                            {actions && actions(data)}
                            {onView && (
                                <button
                                    className="p-2 text-green-700 transition border border-green-700 rounded hover:bg-green-700 hover:text-white focus:shadow-none"
                                    title="View"
                                    onClick={() => onView(data)}
                                >
                                    <FaEye />
                                </button>
                            )}
                            {onEdit && data?.disableEdit !== 1 && (
                                <button
                                    className="p-2 text-indigo-700 transition border border-indigo-700 rounded hover:bg-indigo-700 hover:text-white focus:shadow-none"
                                    title="Edit"
                                    onClick={() => handleEditClick(data)}
                                >
                                    <FaPencilAlt size={12} />
                                </button>
                            )}
                            {onDelete && data?.disableDelete !== 1 && (
                                <button
                                    className="p-2 text-red-600 transition border border-red-700 rounded hover:bg-red-700 hover:text-white focus:shadow-none"
                                    title="Delete"
                                    onClick={() => handleDeleteClick(data)}
                                >
                                    <FaTrashAlt size={12} />
                                </button>
                            )}
                        </div>
                    );
                },
            },
        ];

    return (
        <div className={`table-arabic w-full   rounded-md mb-6`}
        >
            <div className="relative  py-4">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="text-[18px] font-medium leading-[21.11px] font-sans text-left text-[#818B8F] capitalize ">
                            <tr>
                                {indexed && (
                                    <th className="p-3 whitespace-nowrap">
                                        <div className="font-semibold">#</div>
                                    </th>
                                )}
                                {cols?.map((column, index) => (
                                    <th
                                        className={`p-3 whitespace-nowrap ${column?.className || ""
                                            }`}
                                        key={index}
                                    >
                                        <div className="font-semibold">
                                            {i18n?.t(column?.text)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-base font-sans text-gray-700 divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={cols.length} className="py-16">
                                        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                            <Loader />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                (pagination ? data?.docs : data)?.map(
                                    (row, index) => (
                                        <tr
                                            key={index}
                                            className="transition hover:bg-gray-100 hover:shadow-sm admin-switch"
                                        >
                                            {indexed && (
                                                <td className="p-3 text-gray-500 whitespace-nowrap">
                                                    {(pagination
                                                        ? (data?.page - 1) *
                                                        data.limit
                                                        : 0) +
                                                        index +
                                                        1}
                                                </td>
                                            )}
                                            {cols?.map((column, colIndex) => (
                                                <td
                                                    className={`p-3 whitespace-nowrap ${column?.className || ""
                                                        }`}
                                                    key={colIndex}
                                                >
                                                    {column.formatter
                                                        ? column.formatter(
                                                            row[
                                                            column
                                                                .dataField
                                                            ],
                                                            row
                                                        )
                                                        : row[
                                                        column.dataField
                                                        ] || "-"}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                )
                            )}
                            {!loading && data?.docs?.length === 0 && (
                                <tr >
                                    <td colSpan={cols.length} className="py-2">
                                        <Empty />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination && (
                    <div className="pt-4 mt-4 border-t">
                        <Pagination
                            page={data?.page}
                            total={data?.totalDocs}
                            onSizeChange={(limit) =>
                                onReload({ limit, langCode })
                            }
                            limit={data?.limit}
                            totalPages={data?.totalPages}
                            onPageChange={(page) =>
                                onReload({ page, langCode })
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboardTable;


export const TableImage = ({ url }) => {
    const [image, setImage] = useState();
    return (
        <div className='h-8 w-14'>
            <Image height={32} width={56}
                role='button'
                src={url}
                alt='Image'
                className="object-cover w-full h-full"
                onClick={() => setImage(url)}
            // style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            <Modal
                width={800}
                open={image}
                onCancel={() => setImage(undefined)}
                footer={null}
                style={{ padding: 0, zIndex: 60 }}
                closeIcon={
                    <FaTimes
                        size={18}
                        className='  rounded hover:!bg-none text-primary'
                    />
                }
            >
                <div className="flex items-center justify-center" >

                    <Image height={100} width={100} className='w-100 ' style={{ minHeight: 400 }} src={image} alt='' />
                </div>
            </Modal>
        </div>
    );
};

