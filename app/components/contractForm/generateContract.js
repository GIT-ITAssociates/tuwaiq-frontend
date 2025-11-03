"use client";
import React, { useState, useEffect } from "react";
import { Col, Form, Image, Input, Row, Space, Typography, message } from "antd";
import { useI18n } from "@/app/providers/i18n";
import Button from "@/app/components/common/button";
import { createNewContract } from "@/app/helpers/backend";
import { useRouter } from "next/navigation";

const GenerateContractForm = ({
  variant = "create",
  userName,
  caseID,
  data,
  handleAccept,
  handleDecline
}) => {
  const i18n = useI18n();
  const isViewMode = variant === "view";
  const [summary, setSummary] = useState("");
  const { push } = useRouter();
  const [form] = Form.useForm();

  // initial state only for create mode
  const [milestones, setMilestones] = useState(
    Array(5).fill({ description: "", amount: "", percentage: "" })
  );

  // If view mode → populate data from API
  useEffect(() => {
    if (isViewMode && data?.contract_milestone?.length) {
      setMilestones(
        data.contract_milestone.map((m) => ({
          description: m.milestone_summary,
          amount: m.amount,
          percentage: m.percentage,
          status: m.status,
        }))
      );
    }
  }, [data, isViewMode]);

  useEffect(() => {
    console.log("Contract Data in Form:", data?.contract_summary);
    if (isViewMode && data?.contract_summary) {
      form.setFieldsValue({ notes: data.contract_summary });
    }
  }, [data, isViewMode]);

  // Handle change (create mode only)
  const handleChange = (index, field, value) => {
    if (isViewMode) return; // disable editing in view mode
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  // Calculate totals (create mode only)
  const totalAmount = isViewMode
    ? data?.total_amount || 0
    : milestones.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const calculatePercentage = (amount) => {
    if (isViewMode || !totalAmount || !amount) return "";
    const percent = ((amount / totalAmount) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Handle submit
  const handleSubmit = async () => {
    const filled = milestones
      .filter((m) => m.description && m.amount)
      .map((m) => ({
        milestone_summary: m.description,
        amount: m.amount,
        percentage: ((m.amount / totalAmount) * 100).toFixed(1),
        status: "pending",
      }));

    const payload = {
      case_id: caseID,
      contract_summary: summary,
      contract_milestone: filled,
      total_amount: totalAmount.toString(),
    };

    let { data, error, msg } = await createNewContract(payload);
    console.log(":rocket: ~ data, error, msg:", data, error, msg);

    if (!!error) {
      message.error(msg || "Something went wrong");
      return;
    } else {
      message.success(msg || "Request sent successfully");
      push("/admin/our-cases");
    }
  };

  return (
    <div className="border rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 h-full bg-white shadow-sm">
      {/* Header Section */}
      <Row gutter={32} className="justify-between">
        <Col xs={24} lg={10}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {/* Logo */}
            <div className="logo-wrap mb-[50px] flex justify-center lg:justify-start">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={188}
                height={93}
                preview={false}
              />
            </div>
            <div className="border border-[#707070] rounded-md p-4 text-center font-semibold text-gray-700">
              {userName || "Client Name"}
            </div>
          </Space>
        </Col>

        <Col xs={24} lg={5}>
          <div className="border border-[#707070] rounded-md p-4 text-center text-[25px] font-semibold text-gray-800">
            Contract
          </div>
        </Col>
      </Row>

      {/* Case Milestones */}
      <Form form={form} className="mt-[40px]" onFinish={handleSubmit}>
        <Typography.Text strong className="text-[#4a5568] mb-3">
          Contract Summary
        </Typography.Text>
        <Form.Item name="notes">
          <Input.TextArea
            name="notes"
            value={summary}
            onChange={(e) => !isViewMode && setSummary(e.target.value)}
            readOnly={isViewMode}
            autoSize={{ minRows: 5, maxRows: 4 }}
            placeholder="Write your contract summary"
            className="border border-[#707070] rounded-md"
          />
        </Form.Item>

        <div className="rounded-[10px] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 bg-[#D8B35D] text-white font-normal text-xl px-6 py-2 rounded-[10px]">
            <div className="col-span-7">Case Milestones</div>
            <div className="col-span-3 text-center">Amount</div>
            <div className="col-span-2 text-center">Percentage</div>
          </div>

          {/* Rows */}
          <div className="bg-white">
            {milestones.map((item, index) => (
              <div key={index} className="grid grid-cols-12 py-2 px-0">
                {/* Description */}
                <div className="col-span-7">
                  <Input
                    placeholder="Description of Milestone"
                    value={item.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    readOnly={isViewMode}
                    className="border border-[#707070] rounded-md px-3 py-2"
                  />
                </div>

                {/* Amount */}
                <div className="col-span-3 px-3">
                  <Input
                    placeholder="SAR"
                    type="text"
                    value={item.amount}
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.value)
                    }
                    readOnly={isViewMode}
                    className="border border-[#707070] rounded-md text-right px-3 py-2"
                  />
                </div>

                {/* Percentage */}
                <div className="col-span-2 text-center">
                  {isViewMode
                    ? `${item.percentage}%`
                    : calculatePercentage(parseFloat(item.amount) || 0)}
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="flex flex-wrap justify-end items-center gap-3 px-6 py-4 rounded-b-[10px]">
            <span className="text-lg text-gray-700">Total Amount</span>
            <Input
              value={`${totalAmount.toLocaleString()}`}
              readOnly
              className="w-48 text-right text-lg border border-[#707070] rounded-md bg-white"
            />
          </div>

          {/* Buttons */}
          {!isViewMode && (
            <Row
              justify="end"
              gutter={12}
              style={{ marginTop: 28 }}
              className="p-5"
            >
              <Col>
               
              </Col>
              <Col>
                <Button type="submit">{i18n?.t("Send Contract")}</Button>
              </Col>
            </Row>
          )}

          {isViewMode && (
            <Row
              justify="end"
              gutter={12}
              style={{ marginTop: 28 }}
              className="p-5"
            >
              <Col>
                <button
                  type="button"
                  className="pill-btn ghost border lg:px-8 text-textMain !font-poppins md:px-4 h-fit py-2 px-2 whitespace-pre rounded-[8px] transition-all !font-medium duration-700 ease-in-out sm:text-base capitalize text-sm text-[#C7A87D] border-[#C7A87D]"
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </Col>
              <Col>
                <Button onClick={handleAccept}>{i18n?.t("Accept")}</Button>
              </Col>
            </Row>
          )}
        </div>
      </Form>
    </div>
  );
};

export default GenerateContractForm;