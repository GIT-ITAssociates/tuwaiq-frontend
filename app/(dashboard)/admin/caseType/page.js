"use client";
import Button from '@/app/components/common/button';
import FormInput, { HiddenInput } from '@/app/components/common/form/input';
import Table from '@/app/components/common/table/table';
import PageTitle from '@/app/components/common/title/title';
import { delSpecialization, fetchSpecialization, postSpecialization, } from '@/app/helpers/backend';
import { useAction, useFetch } from '@/app/helpers/hooks';
import { columnFormatter, noSelected } from '@/app/helpers/utils';
import { useI18n } from '@/app/providers/i18n';
import { Form, Modal } from 'antd';
import React, { useState } from 'react';


const Specialization = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    // const [data, getData, { loading }] = useFetch(fetchSpecialization);
    const [data, getData, { loading }] = useFetch(fetchSpecialization, { limit: 200 });
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const[submitLoading,setSubmitLoading]=useState(false);
    const columns = [
        {
            text: 'Name',
            dataField: "name",
            formatter: (value) => (value),
        },
    ];

    const handleSubmit = (values) => {
        setSubmitLoading(true);
        return useAction(
            values?._id ? postSpecialization : postSpecialization,
            {
                name: values?.name,
                _id: values?._id,
            },
            () => {
                setOpen(false);
                getData();
                setSubmitLoading(false);

            }
        );
    };

    return (
        <div>
            <PageTitle title={('Attorney case types')} />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                            setIsEdit(false);
                        }}
                    >
                        {i18n?.t("Add New")}
                    </Button>
                }
                onEdit={(values) => {
                    form.setFieldsValue({
                        ...values,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delSpecialization}
                indexed
                pagination
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={i18n?.t(isEdit ? i18n?.t("Edit Case Type") : i18n?.t("Add Case Type"))}
                footer={null}
            >

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    {
                        isEdit && <HiddenInput name="_id" />
                    }
                    <div className="mt-4">

                        <FormInput
                            placeholder={i18n?.t('Enter Name')}
                            name='name'
                            label={i18n?.t("Name")}
                            required={true}
                            className="mt-2.5"
                        />
                    </div>
                    <Button type='submit'loading={submitLoading} className="mt-2.5">{i18n?.t("Submit")}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Specialization;