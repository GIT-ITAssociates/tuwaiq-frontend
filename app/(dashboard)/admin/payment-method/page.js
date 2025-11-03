"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/app/helpers/hooks";
import { delPaymentMethod, fetchPaymentMethods } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import PageTitle from "@/app/components/common/title/title";
import Table, { TableImage } from "@/app/components/common/table/table";
import Button from "@/app/components/common/button";

const PaymentMethods = () => {
  const { push } = useRouter();
  const i18n = useI18n();
  const [paymentMethod, getPaymentMethod, { loading }] =
    useFetch(fetchPaymentMethods);
  const columns = [
    {
      text: "image",
      dataField: "image",
      formatter: (_, d) => {
        return d?.image ? (
          <TableImage url={d?.image || "/images/defaultimg.jpg"} />
        ) : (
          <TableImage url={d?.image || "/images/no-image.jpg"} />
        );
      },
    },
    { text: "name", dataField: "name" },
    {
      text: "type",
      dataField: "type",
      formatter: (_, d) => <span className="capitalize">{d?.type}</span>,
    },
  ];
  return (
    <div>
      <PageTitle title={i18n.t("Payment Method List")} />
      <Table
        columns={columns}
        data={paymentMethod}
        action={
          <Button onClick={() => push("/admin/payment-method/add")}>
            {i18n?.t("Add Payment Method")}
          </Button>
        }
        onEdit={({ _id }) => push("/admin/payment-method/edit/" + _id)}
        onDelete={delPaymentMethod}
        onReload={getPaymentMethod}
        loading={loading}
        pagination
        indexed
      />
    </div>
  );
};

export default PaymentMethods;
