"use client";
import { Form, message } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/providers/i18n';
import PageTitle from '@/app/components/common/title/title';
import FormInput, { HiddenInput } from '@/app/components/common/form/input';
import FormSelect from '@/app/components/common/form/select';
import Button from '@/app/components/common/button';
import { postPaymentMethod, postSingleImage } from '@/app/helpers/backend';
import MultipleImageInput from '@/app/components/common/form/multiImage';

const AddPaymentMethods = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [selectedMethod, setSelectedMethod] = useState('');
    return (
        <div>
            <PageTitle title="Add Payment Method" />
            <PaymentMethodForm title={i18n?.t('Add Method')} form={form} selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
        </div>
    );
};

export default AddPaymentMethods;

export const PaymentMethodForm = ({ title, form, selectedMethod, setSelectedMethod }) => {
    const { push } = useRouter()
    const i18n = useI18n()

    const handleFinish = async (values) => {
        const config = values.config;
        if (values?.image[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ image: image, image_name: 'Payment Method' });
            values.image = data;
        } else {
            values.image = values?.image[0]?.url;
        }
        const payload = {
            ...values,
            config: config,
            image: values?.image
        }
        const res = await postPaymentMethod(payload)
        if (res?.error === false) {
            message.success(res?.msg)
            push('/admin/payment-method')
        } else {
            message.error(res?.msg)
        }
    }
    return (
        <>
            <div className="body bg-white shadow-md rounded-md p-4">
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    {
                        title !== "Add Method" && <HiddenInput name="_id" />
                    }
                    <div className="md:w-1/2">
                        <FormInput name="name" label={i18n.t("Name")} required placeholder={i18n.t('Enter Name')} />
                    </div>
                    <div className="md:w-1/2">
                        <FormSelect name="type"
                            label={i18n.t('Method Type')}
                            placeholder={i18n.t('Select Method Type')}
                            onChange={(e) => {
                                setSelectedMethod(e)
                            }}
                            options={[
                                {
                                    value: 'paypal',
                                    label: i18n?.t('Paypal')
                                },
                                {
                                    value: 'stripe',
                                    label: i18n?.t('Stripe')
                                },
                                {
                                    value: 'razorpay',
                                    label: i18n?.t('Razorpay')
                                },
                                {
                                    value: 'mollie',
                                    label: i18n?.t('Mollie')
                                },
                            ]}
                            allowClear
                            required
                        />
                    </div>
                    {
                        selectedMethod === 'paypal' &&
                        <>
                            <div className="md:w-1/2">
                                <FormInput required name={['config', 'clientId']} label={i18n.t('Paypal Client ID')} placeholder={i18n.t('Enter Client Id')} />
                                <FormInput required name={['config', 'clientSecret']} label={i18n.t('Paypal Client Secret')} placeholder={i18n.t('Enter Client Secret')} />
                                <FormSelect required name={['config', 'mode']} label={i18n.t("Paypal Mode")} placeholder={i18n.t('Select Mode')} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                            </div>
                        </>
                    }
                    {
                        selectedMethod === 'stripe' &&
                        <>
                            <div className="md:w-1/2">
                                <FormInput required name={['config', 'clientId']} label={i18n?.t('Stripe Secret Key')} placeholder={i18n.t('Enter Secret Key')} />
                                <FormInput required name={['config', 'clientSecret']} label={i18n.t('Stripe Webhook Endpoint secret')} placeholder={i18n.t('Enter Webhook Endpoint secret')} />
                                <FormSelect required name={['config', 'mode']} label={i18n.t('Stripe Mode')} placeholder={i18n.t('Select Mode')} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                            </div>
                        </>
                    }
                    {
                        selectedMethod === 'razorpay' &&
                        <>
                            <div className="md:w-1/2">
                                <FormInput required name={['config', 'clientId']} label={i18n?.t('Razorpay Key ID')} placeholder={i18n?.t('Enter Key ID')} />
                                <FormInput required name={['config', 'clientSecret']} label={i18n?.t('Razorpay Key Secret')} placeholder={''} />
                                <FormSelect required name={['config', 'mode']} label={i18n?.t('Razorpay Mode')} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                            </div>
                        </>
                    }
                    {
                        selectedMethod === 'mollie' &&
                        <>
                            <div className="md:w-1/2">
                                <FormInput required name={['config', 'clientId']} label={i18n.t('Mollie API Key')} placeholder={i18n.t('Enter API Key')} />
                                <FormSelect required name={['config', 'mode']} label={i18n.t('Mollie Mode')} placeholder={i18n.t('Select Mode')} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                            </div>
                        </>
                    }
                    <MultipleImageInput name="image" label={i18n.t("Image")} required />

                    <Button type='submit' className='mt-5'>
                        {title === "Add Method" ? i18n?.t("submit") : i18n?.t("Update")}
                    </Button>
                </Form>
            </div>
        </>
    )
}