import React, { useState, useEffect } from 'react';
import { Form, Input, Switch } from 'antd';
import { useAction } from '@/app/helpers/hooks';
import { postEmailSettings } from '@/app/helpers/backend';
import { Loader } from '@/app/components/common/loader';
import Button from '@/app/components/common/button';
import { HiddenInput } from '@/app/components/common/form/input';
import { useI18n } from '@/app/providers/i18n';

const GmailEmailProvider = ({ settings, getSettings, loading, setCheckedValue }) => {
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');
    const i18n = useI18n();
    const[submitLoading,setSubmitLoading]=useState(false);

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                gmail: {
                    emailUsername: settings?.gmail?.emailUsername,
                    emailPassword: settings?.gmail?.emailPassword,
                }
            })

            if (settings?.serviceProvider === 'gmail') {
                setDefaultEmail('gmail');
                form.setFieldsValue({ default: 'gmail' });
                setCheckedValue(true);
            } else {
                setDefaultEmail('');
                form.setFieldsValue({ default: '' });
                setCheckedValue(false);
            }
        }
    }, [settings])


    const onFinish = async (values) => {
        setSubmitLoading(true)
        const postData = {
            _id: values._id,
            serviceProvider: "gmail",

            sendgrid: {
                emailHost: settings?.sendgrid?.emailHost,
                emailPort: settings?.sendgrid?.emailPort,
                emailUsername: settings?.sendgrid?.emailUsername,
                emailPassword: settings?.sendgrid?.emailPassword,
                senderEmail: settings?.sendgrid?.senderEmail,

            },
            
            gmail: {
                emailUsername: values?.gmail?.emailUsername,
                emailPassword: values?.gmail?.emailPassword,
                status: values?.default,
            },
            other: {
                emailHost: settings?.other?.emailHost,
                emailPort: settings?.other?.emailPort,
                emailAddress: settings?.other?.emailAddress,
                emailPassword: settings?.other?.emailPassword,
            },
        }
        return useAction(postEmailSettings, { ...postData }, () => {
            getSettings();
            setSubmitLoading(false)

        })
    };

    if (loading) {
        return <div className='flex justify-center items-center h-[300px]'>
            <Loader />
        </div>
    }

    return (
        <div className='pt-0'>

            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
            >
                <div className='p-3'>
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">
                        {i18n?.t("Gmail SMTP")}
                    </p>

                    <HiddenInput name="_id" />

                    <Form.Item
                        name={['gmail', 'emailUsername']}
                        label={i18n?.t("Email Username")}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email username!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t("Please input email username")} type='text' />
                    </Form.Item>
                    <Form.Item
                        name={['gmail', 'emailPassword']}
                        label={i18n?.t("Email Password")}
                        className='mt-1'
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email password!'),
                            },
                        ]}
                    >
                        <Input.Password placeholder={i18n?.t("Please input email password!")} type='password' />

                    </Form.Item>

                    {/* <Form.Item

                        className='mt-1'
                        name={['gmail', 'service_provider']}
                        label={"Service Provider"}
                        rules={[
                            {
                                required: true,
                                message: 'Please input service provider!',
                            },
                        ]}
                    >
                        <Input placeholder={"Please input service provider"} />
                    </Form.Item> */}
                    <Form.Item
                        className='mt-1'
                        name='default'
                        label={i18n?.t("Set Default")}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please enable status!'),
                            },
                        ]}
                    >
                        <Switch
                            checked={defaultEmail === 'gmail'}
                            onChange={(checked) => {
                                setDefaultEmail(checked ? 'gmail' : '')
                            }}
                            className={defaultEmail === 'gmail' ? 'bg-primary' : 'bg-blue-500'}
                            checkedChildren={<span className="text-white">{i18n?.t("On")}</span>}
                            unCheckedChildren={<span className="text-white">{i18n?.t("Off")}</span>}
                        />
                    </Form.Item>

                    <div className='relative mt-2'>
                        <Button type='submit'loading={submitLoading} className="mt-2.5">{i18n?.t("submit")}</Button>
                    </div>
                </div>
            </Form>

        </div>
    );
};


export default GmailEmailProvider;