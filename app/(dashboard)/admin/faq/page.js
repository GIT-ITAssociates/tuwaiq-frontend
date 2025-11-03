'use client';
import Button from '@/app/components/common/button';
import FormInput, { HiddenInput } from '@/app/components/common/form/input';
import Table from '@/app/components/common/table/table';
import PageTitle from '@/app/components/common/title/title';
import { delFaq, fetchFaq, postFaq } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import { columnFormatter, noSelected } from '@/app/helpers/utils';
import { useI18n } from '@/app/providers/i18n';
import { Form, message, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const i18n = useI18n()
    const [form] = Form.useForm();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchFaq);
    const[submitLoading,setSubmitLoading]=useState(false);

    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState(langCode);

    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])

    const columns = [
        { text: "Question", dataField: "question", formatter: (question) => <span className=''>{columnFormatter(question)}</span> },
        {
            text: "Answer", dataField: "answer",
            formatter: (answer) => <span className=''>{
                <Tooltip title={columnFormatter(answer)?.length > 40 ? columnFormatter(answer)?.slice(0, 40) + '...' : columnFormatter(answer)} placement="topLeft">
                    <span className='cursor-help'>
                        {columnFormatter(answer)?.length > 40 ? columnFormatter(answer)?.slice(0, 40) + '...' : columnFormatter(answer)}
                    </span>
                </Tooltip>
            }</span>,
        },

    ];

    const handleSubmit = (values) => {
        setSubmitLoading(true)
        postFaq(values).then((res) => {
            if (res?.error === false) {
                message.success(res?.msg);
                setOpen(false);
                getData();
                setSubmitLoading(false)

            }
        });
    };
    return (
        <div>
            <PageTitle title={i18n?.t("Frequently Ask Question")} />
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
                        }}>
                        {i18n?.t("Add New")}
                    </Button>
                }
                onEdit={(values) => {
                    form.resetFields();
                    form.setFieldsValue({
                        ...values,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delFaq}
                indexed
                pagination
                langCode={langCode}

            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={i18n?.t("Frequently Ask Question Details")}
                footer={null}>
                <div className="flex justify-start flex-wrap gap-3 mb-4 mt-4">
                    {languages?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                ? 'bg-primary text-white cursor-pointer'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                }`}
                            key={index}
                        >
                            {l.name}
                        </div>
                    ))}
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    {
                        isEdit && <HiddenInput name="_id" />
                    }

                    {languages?.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                placeholder={i18n?.t('Enter Question')}
                                name={['question', l.code]}
                                label={`${i18n?.t('Question')} (${l.name})`}
                                required={true}
                            />
                            <FormInput
                                placeholder={i18n?.t('Enter Answer')}
                                name={['answer', l.code]}
                                textArea
                                label={`${i18n.t('Answer')} (${l.name})`}
                                required={true}
                            />
                        </div>
                    ))}

                    <Button loading={submitLoading} type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n?.t("submit")}</Button>
                </Form>
            </Modal>
        </div>
    )
}

export default Page