"use client";

import React, { useMemo, useState } from "react";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Image,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getMyClients } from '@/app/helpers/backend';
import { useFetch } from "@/app/helpers/hooks";


const currency = "SAR";

const formatSAR = (value) =>
    `${currency} ${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function InvoiceFormPage() {
    const [form] = Form.useForm();


    const [data, getData, { loading }] = useFetch(getMyClients);

    const [items, setItems] = useState([
        { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
    ]);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [sending, setSending] = useState(false);

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, it) =>
                    sum + (Number(it.quantity) || 0) * (Number(it.rate) || 0),
                0
            ),
        [items]
    );
    const total = useMemo(
        () => Math.max(0, subtotal - (discount || 0) + (tax || 0)),
        [subtotal, discount, tax]
    );
    const balanceDue = useMemo(
        () => Math.max(0, total - (amountPaid || 0)),
        [total, amountPaid]
    );

    const addLineItem = () => {
        setItems((prev) => [
            ...prev,
            { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
        ]);
    };

    const removeLineItem = (id) => {
        setItems((prev) =>
            prev.length === 1 ? prev : prev.filter((i) => i.id !== id)
        );
    };

    const updateItem = (id, patch) => {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    };

    const onFinish = async (values) => {
        try {
            setSending(true);

            const payload = {
                type: values.type,
                number: values.number,
                clientId: values.clientId,
                dueDate: values.dueDate ? dayjs(values.dueDate).format("DD-MM-YYYY") : "",
                poNumber: values.poNumber || "",
                from: values.from || "",
                items: items.map((i) => ({
                    description: i.description,
                    quantity: i.quantity,
                    currency,
                    amount: i.rate,
                })),
                notes: values.notes || "",
                terms: values.terms || "",
                subtotal: Number(subtotal.toFixed(2)),
                discount: Number((discount || 0).toFixed(2)),
                total: Number(total.toFixed(2)),
                amountPaid: Number((amountPaid || 0).toFixed(2)),
                balanceDue: Number(balanceDue.toFixed(2)),
            };

            // Example POST (replace with your backend API URL)
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Network response was not ok");
            message.success("Sent successfully!");
        } catch (err) {
            message.error(err?.message || "Failed to send");
        } finally {
            setSending(false);
        }
    };

    const resetAll = () => {
        form.resetFields();
        setItems([{ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }]);
        setDiscount(0);
        setTax(0);
        setAmountPaid(0);
    };

    const clientData = {
        "error": false,
        "msg": "Successfully retrieved users with case stats",
        "data": {
            "docs": [
                {
                    "_id": "68a8223284d8f4fe17e4f7e6",
                    "name": "Hamza Islam",
                    "email": "hamzaislam1@yopmail.com",
                    "role": "user",
                    "status": "active",
                    "dob": "2005-12-31T00:00:00.000Z",
                    "availability": [],
                    "createdAt": "2025-08-22T07:54:26.507Z",
                    "country": "PK",
                    "image": "https://legalmanagment.s3.us-east-1.amazonaws.com/undefined-storage/image/TB5XJ3UW-closed_marker.png",
                    "per_address": "Lahore",
                    "phone_no": "+923005678956",
                    "pre_address": "Lahore",
                    "active_cases": 0,
                    "success_cases": 0,
                    "pending_cases": 0
                },
                {
                    "_id": "68a6e0a0ac5bfa31852e8be8",
                    "name": "M Zeeshan",
                    "email": "zeeshantest@yopmail.com",
                    "role": "user",
                    "status": "active",
                    "dob": "2001-01-31T00:00:00.000Z",
                    "availability": [],
                    "createdAt": "2025-08-21T09:02:24.503Z",
                    "country": "PK",
                    "per_address": "Lahore",
                    "phone_no": "+923055585855",
                    "pre_address": "Lahore",
                    "active_cases": 1,
                    "success_cases": 0,
                    "pending_cases": 0
                }
            ],
            "totalDocs": 2,
            "page": 1,
            "limit": 10,
            "totalPages": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    };


    return (
        <div >
            <div className=" m-6">
                {/* <Card className="sheet"> */}
                {/* Top bar */}
                <Row justify="end" gutter={16} className="top-right-controls">
                    <Col>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Row justify="end" gutter={16} className="top-right-controls">
                                <Col>
                                    <Form.Item
                                        name="type"
                                        initialValue="INVOICE"
                                        className="compact-label"
                                    >
                                        <Select
                                            popupMatchSelectWidth={false}
                                            className="top-select"
                                            options={[
                                                { value: "INVOICE", label: "INVOICE" },
                                                { value: "Quotation", label: "Quotation" },
                                                { value: "Estimate", label: "Estimate" },
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item name="number" className="compact-label">
                                        <Input className="top-number" placeholder="#" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>

                {/* Main form */}
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={32}>
                        {/* Left Column */}
                        <Col xs={24} lg={16}>
                            <Space direction="vertical" size={16} style={{ width: "100%" }}>

                                {/* Logo */}
                                <div className="logo-wrap">
                                    <Image
                                        src="/images/logo.png"
                                        alt="Logo"
                                        width={120}
                                        height={60}
                                    // className="object-contain"
                                    />
                                </div>

                                <Form.Item name="from" label={false}>
                                    <Input placeholder="Who is this from?" className="rounded-input" />
                                </Form.Item>

                                <Typography.Text strong>Bill to</Typography.Text>
                                <Form.Item
                                    name="clientId"
                                    rules={[{ required: true, message: "Please select a client" }]}
                                >
                                    <Select
                                        placeholder="Select Client"
                                        className="rounded-input"
                                        // loading={loading} // show loader while fetching
                                        options={clientData?.data?.docs?.map((client) => ({
                                            value: client._id,
                                            label: client.name,
                                        })) || []}
                                    />
                                </Form.Item>



                                {/* Items */}
                                <div className="items-wrap">

                                    <div className="items-header">
                                        <div className="items-header-left">Item</div>
                                        <div className="items-header-right">
                                            <span>Quantity</span>
                                            <span>Rate</span>
                                            <span>Amount</span>
                                        </div>
                                    </div>

                                    {items.map((it) => {
                                        const lineTotal =
                                            (Number(it.quantity) || 0) * (Number(it.rate) || 0);
                                        return (
                                            <div className="item-row" key={it.id}>
                                                <Input
                                                    placeholder="Description of item/service"
                                                    className="desc"
                                                    value={it.description}
                                                    onChange={(e) =>
                                                        updateItem(it.id, { description: e.target.value })
                                                    }
                                                />
                                                <InputNumber
                                                    min={0}
                                                    className="qty"
                                                    value={it.quantity}
                                                    onChange={(v) =>
                                                        updateItem(it.id, { quantity: Number(v || 0) })
                                                    }
                                                />
                                                <div className="rate-wrap">
                                                    <span className="currency">{currency}</span>
                                                    <InputNumber
                                                        min={0}
                                                        className="rate"
                                                        value={it.rate}
                                                        onChange={(v) =>
                                                            updateItem(it.id, { rate: Number(v || 0) })
                                                        }
                                                    />
                                                </div>
                                                <div className="amount">{formatSAR(lineTotal)}</div>
                                                {items.length > 1 && (
                                                    <Button
                                                        type="text"
                                                        danger
                                                        className="remove-btn"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => removeLineItem(it.id)}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}

                                    <Button
                                        icon={<PlusOutlined />}
                                        size="small"
                                        className="line-btn"
                                        onClick={addLineItem}
                                    >
                                        Line Item
                                    </Button>
                                </div>

                                <Typography.Text strong>Notes</Typography.Text>
                                <Form.Item name="notes">
                                    <Input.TextArea
                                        autoSize={{ minRows: 2, maxRows: 4 }}
                                        placeholder="Notes – any relevant information not already covered"
                                        className="rounded-input"
                                    />
                                </Form.Item>

                                <Typography.Text strong>Terms</Typography.Text>
                                <Form.Item name="terms">
                                    <Input.TextArea
                                        autoSize={{ minRows: 2, maxRows: 4 }}
                                        placeholder="Terms and conditions – late fees, payment methods, delivery schedule"
                                        className="rounded-input"
                                    />
                                </Form.Item>
                            </Space>
                        </Col>

                        {/* Right Column */}
                        <Col xs={24} lg={8}>
                            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                                <Row gutter={12}>
                                    <Col span={24}>
                                        <Form.Item label="Date" name="date">
                                            <DatePicker className="rounded-input" style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>

                                        <Form.Item label="Payment Terms" name="paymentTerms">
                                            <Input className="rounded-input" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Due Date"
                                            name="dueDate"
                                            rules={[{ required: true, message: "Required" }]}
                                        >
                                            <DatePicker className="rounded-input" style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="PO Number" name="poNumber">
                                            <Input className="rounded-input" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider />

                                <div className="totals">
                                    <div className="row">
                                        <span>Subtotal</span>
                                        <span>{formatSAR(subtotal)}</span>
                                    </div>

                                    <div className="row">
                                        <span className="linklike">+ Discount</span>
                                        <InputNumber
                                            min={0}
                                            value={discount}
                                            onChange={(v) => setDiscount(Number(v || 0))}
                                            className="numeric"
                                        />
                                    </div>

                                    <div className="row">
                                        <span className="linklike">+ Tax</span>
                                        <InputNumber
                                            min={0}
                                            value={tax}
                                            onChange={(v) => setTax(Number(v || 0))}
                                            className="numeric"
                                        />
                                    </div>

                                    <div className="row total">
                                        <span>Total</span>
                                        <span>{formatSAR(total)}</span>
                                    </div>

                                    <div className="row">
                                        <span>Amount Paid</span>
                                        <InputNumber
                                            min={0}
                                            value={amountPaid}
                                            onChange={(v) => setAmountPaid(Number(v || 0))}
                                            className="numeric"
                                        />
                                    </div>

                                    <div className="row">
                                        <span>Balance Due</span>
                                        <span>{formatSAR(balanceDue)}</span>
                                    </div>
                                </div>
                            </Space>
                        </Col>
                    </Row>

                    <Row justify="end" gutter={12} style={{ marginTop: 28 }}>
                        <Col>
                            <Button onClick={resetAll} className="pill-btn ghost">
                                Cancel
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                className="pill-btn primary"
                                htmlType="submit"
                                loading={sending}
                            >
                                Send
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            {/* </Card> */}


            <style jsx>{`
        .page-wrap {
          padding: 24px;
          background: #f4f7f9;
          min-height: 100dvh;
        }
        .sheet {
          max-width: 980px;
          margin: 0 auto;
          border-radius: 14px;
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04),
            0 8px 24px rgba(0, 0, 0, 0.05);
          padding: 18px 18px 24px;
        }
        .top-right-controls {
          margin-bottom: 4px;
        }
        .top-select,
        .top-number {
          border-radius: 10px !important;
          width: 160px;
          height: 44px;
        }
        .logo-wrap {

          padding-top: 0;
          padding-bottom: 6px;
          margin-top: -50px;
        }
        .rounded-input :global(.ant-input),
        .rounded-input :global(.ant-select-selector),
        .rounded-input :global(.ant-picker) {
          border-radius: 10px !important;
          height: 42px;
        }
        .rounded-input :global(textarea.ant-input) {
          border-radius: 10px !important;
        }
        .items-wrap {
          border: 1px solid #e6e6e6;
          border-radius: 8px;
          overflow: hidden;
          width: 100%;
        }

        .items-header {
          display: flex;
          align-items: center;
          background: #d6ad57;
          color: #fff;
          font-weight: 600;
          padding: 12px;
          font-size: 13px;
          width: 100%;
        }

        .item-description-header {
          flex: 5;
          padding-right: 10px;
        }

        .item-quantity-header {
          flex: 1;
          text-align: center;
          padding: 0 10px;
        }

        .item-rate-header {
          flex: 2;
          text-align: center;
          padding: 0 10px;
        }

        .item-amount-header {
          flex: 2;
          text-align: right;
          padding: 0 10px;
        }

        .item-action-header {
          flex: 0.5;
          text-align: center;
        }

        .item-row {
          display: flex;
          align-items: center;
          padding: 12px;
          border-top: 1px solid #f1f1f1;
          width: 100%;
        }

        .item-description {
          flex: 5;
          margin-right: 10px;
        }

        .item-quantity {
          flex: 1;
          margin: 0 10px;
        }

        .item-rate {
          flex: 2;
          display: flex;
          align-items: center;
          margin: 0 10px;
        }

        .currency {
          margin-right: 5px;
          color: #888;
        }

        .rate-input {
          flex: 1;
        }

        .item-amount {
          flex: 2;
          text-align: right;
          padding: 0 10px;
          color: #444;
          font-weight: 500;
        }

        .remove-btn {
          flex: 0.5;
          display: flex;
          justify-content: center;
        }

        // .items-header {
        //   display: grid;
        //   grid-template-columns: 1fr 360px;
        //   align-items: center;
        //   background: #d6ad57;
        //   color: #fff;
        //   font-weight: 600;
        //   padding: 8px 10px;
        //   font-size: 13px;
        // }
        .items-header-right {
          display: grid;
          grid-template-columns: 100px 130px 130px;
          justify-items: end;
          gap: 10px;
          padding-right: 8px;
        }
        .item-row {
          display: grid;
          grid-template-columns: 1fr 100px 130px 130px 34px;
          gap: 10px;
          align-items: center;
          padding: 10px 10px 8px;
          border-top: 1px solid #f1f1f1;
        }
        .rate-wrap {
          display: grid;
          grid-template-columns: 40px 1fr;
          align-items: center;
          gap: 6px;
        }
        .amount {
          justify-self: end;
          color: #444;
        }
        .remove-btn {
          justify-self: end;
        }
        .line-btn {
          margin: 10px;
          border-radius: 6px;
        }
        .totals {
          display: grid;
          gap: 10px;
        }
        .totals .row {
          display: grid;
          grid-template-columns: 1fr 160px;
          align-items: center;
          gap: 12px;
        }
        .totals .numeric :global(.ant-input-number) {
          width: 160px;
          border-radius: 8px;
          height: 38px;
        }
        .totals .total {
          font-weight: 600;
        }
        .linklike {
          color: #c4932f;
        }

        // Corrected button styles
        :global(.ant-btn.pill-btn) {
          border-radius: 50px !important;
          height: 40px !important;
          font-weight: bold !important;
          font-size: 14px !important;
          padding: 0 24px !important;
          box-shadow: none !important;
        }

        :global(.ant-btn.pill-btn.ghost) {
          border-color: #d6ad57 !important;
          color: #d6ad57 !important;
        }

        :global(.ant-btn.pill-btn.primary) {
          background-color: #d6ad57 !important;
          border-color: #d6ad57 !important;
          color: #fff !important;
        }
      `}</style>
        </div>
    );
}




