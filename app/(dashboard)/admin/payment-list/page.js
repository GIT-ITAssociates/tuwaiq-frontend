"use client";
import Table, {
  DetailTable,
  TableImage,
} from "@/app/components/common/table/table";
import PageTitle from "@/app/components/common/title/title";
import { paymentList } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { getStatusClass } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import { Modal } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const Page = () => {
  const [data, getData] = useFetch(paymentList);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const i18n = useI18n();
  const handleView = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setIsModalOpen(false);
  };

                     const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

    const currentLanguage = i18n?.languages?.find(
  (lang) => lang?._id === langFromLocalStorage
)?.name;

  const columns = [
  
    {
      text: "image",
      dataField: "user",
      formatter: (_, d) => {
        return d?.user?.image ? (
          <TableImage url={d?.user?.image || "/images/defaultimg.jpg"} />
        ) : (
          <TableImage url="/images/defaultimg.jpg" />
        );
      },
    },
    {
      text: "Name",
      dataField: "user",
      formatter: (_, d) => (
        <span className="line-clamp-2 w-[150px] text-wrap sm:w-[250px]">
          {d?.user?.name}
        </span>
      ),
    },
     
    {
      text: "Attorney",
      dataField: "attorney",
      formatter: (_, d) => (
        <span className="line-clamp-2 w-[150px] text-wrap sm:w-[250px]">
          {d?.attorney?.name}
        </span>
      ),
    },
    {
  text: currentLanguage === "Arabic" ? "المبلغ" : "Amount",
  dataField: "payment",
  formatter: (_, d) => (
    <span className="line-clamp-2 w-[150px] text-wrap sm:w-[250px]">
      ${d?.payment?.amount || 0}
    </span>
  ),
},
{
  text: currentLanguage === "Arabic" ? "طريقة الدفع" : "Payment Method",
  dataField: "payment",
  formatter: (_, d) => (
    <span className="line-clamp-2 w-[150px] text-wrap sm:w-[250px]">
      {d?.payment?.method}
    </span>
  ),
},
{
  text: currentLanguage === "Arabic" ? "تاريخ الدفع" : "Payment Date",
  dataField: "createdAt",
  formatter: (_, d) => (
    <span className="line-clamp-2 w-[150px] text-wrap sm:w-[250px]">
      {dayjs(d?.createdAt).format("DD-MMM-YYYY HH:mm A")}
    </span>
  ),
},
     {
      text: "payment status",
      dataField: "payment",
      formatter: (_, d) => (
        <span className={`${getStatusClass(d?.payment?.status)}`}>
          {d?.payment?.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageTitle title={i18n.t("Payment List")} />
      <Table
        data={data}
        pagination
        indexed
        onView={handleView}
        columns={columns}
        onReload={getData}
      />
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onCancel={closeModal}
          width={800}
          footer={null}
          onClose={closeModal}
        >
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            <DetailTable
              data={selectedRow}
              title={"User Details"}
              columns={[
                {
                  text: "Image",
                  dataField: "user ",
                  formatter: (_, d) => {
                    return d?.user?.image ? (
                      <TableImage
                        url={d?.user?.image || "/images/defaultimg.jpg"}
                      />
                    ) : (
                      <TableImage url="/images/defaultimg.jpg" />
                    );
                  },
                },
                {
                  text: "Name",
                  dataField: "user",
                  formatter: (_, d) => (
                    <span className="capitalize">{d?.user?.name}</span>
                  ),
                },
                {
                  text: "Email",
                  dataField: "user",
                  formatter: (_, d) => (
                    <span className="capitalize">{d?.user?.email}</span>
                  ),
                },
                {
                  text: "Phone",
                  dataField: "user",
                  formatter: (_, d) => (
                    <span className="capitalize">{d?.user?.phone_no}</span>
                  ),
                },
                {
                  text: "Address",
                  dataField: "user",
                  formatter: (_, d) => (
                    <span className="capitalize">{d?.user?.per_address}</span>
                  ),
                },
              ]}
            />
            <DetailTable
              data={selectedRow}
              title={"Attorney Details"}
              columns={[
                {
                  text: "Image",
                  dataField: "attorney ",
                  formatter: (_, d) => {
                    return d?.attorney?.image ? (
                      <TableImage
                        url={d?.attorney?.image || "/images/defaultimg.jpg"}
                      />
                    ) : (
                      <TableImage url="/images/defaultimg.jpg" />
                    );
                  },
                },
                {
                  text: "Name",
                  dataField: "attorney",
                  formatter: (_, d) => (
                    <span className="capitalize">{d?.attorney?.name}</span>
                  ),
                },
                {
                  text: "Email",
                  dataField: "attorney",
                  formatter: (_, d) => (
                    <span className="capitalize">{d?.attorney?.email}</span>
                  ),
                },
                {
                  text: "Phone",
                  dataField: "attorney",
                  formatter: (_, d) => (
                    <span className="capitalize">{d?.attorney?.phone_no}</span>
                  ),
                },
                {
                  text: "Designation",
                  dataField: "attorney",
                  formatter: (_, d) => (
                    <span className="capitalize">
                      {d?.attorney?.designation}
                    </span>
                  ),
                },
              ]}
            />
          </div>
          <DetailTable
            data={selectedRow}
            title={"Payment Details"}
            columns={[
              {
                text: "Payment Method",
                dataField: "payment ",
                formatter: (_, d) => (
                  <span className="capitalize">{d?.payment?.method} </span>
                ),
              },
              {
                text: "Payment Date",
                dataField: "createdAt",
                formatter: (_, d) => (
                  <span className="capitalize">
                    {dayjs(d?.createdAt).format("DD-MMM-YYYY HH:mm A")}
                  </span>
                ),
              }
              ,
              {
                text: "Payment Status",
                dataField: "payment",
                formatter: (_, d) => (
                  <span className={`${getStatusClass(d?.payment?.status)}`}>
                    {d?.payment?.status}
                  </span>
                ),
              },
              {
                text: "Amount",
                dataField: "payment",
                formatter: (_, d) => (
                  <span className="capitalize">{d?.payment?.amount}</span>
                ),
              },
              {
                text: "Transaction Id",
                dataField: "payment",
                formatter: (_, d) => (
                  <span className="capitalize">
                    {d?.payment?.transaction_id}
                  </span>
                ),
              },
            ]}
          />
        </Modal>
      )}
    </div>
  );
};

export default Page;
