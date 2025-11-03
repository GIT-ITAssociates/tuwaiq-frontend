"use client";
import { fetchPaymentMethod } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import { useI18n } from '@/app/providers/i18n';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { PaymentMethodForm } from '../../add/page';
import PageTitle from '@/app/components/common/title/title';


const EditPaymentMethod = ({ params }) => {
    const [form] = Form.useForm()
    const i18n = useI18n();
    const [data, getData] = useFetch(fetchPaymentMethod, {}, false);
    const [selectedMethod, setSelectedMethod] = useState('');

    useEffect(() => {
        getData({ _id: params?._id });
        if (data) {
            form.setFieldsValue({
                ...data,
                image: data?.image
                    ? [
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: typeof data.image === 'string' ? data.image : data.image[0].url || '',
                        }
                    ]
                    : [],
            });
            setSelectedMethod(data?.type)
        }
    }, [data?._id]);
    return (
        <div>
            <PageTitle title="Edit Payment Method" />
            <PaymentMethodForm title={i18n?.t('Edit Method')} form={form} selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
        </div>
    );
};

export default EditPaymentMethod;