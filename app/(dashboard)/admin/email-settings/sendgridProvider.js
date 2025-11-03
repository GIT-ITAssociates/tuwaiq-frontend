import React, { useState, useEffect } from 'react';
import { Form, Input, Switch } from 'antd';
import { useAction } from '@/app/helpers/hooks';
import { postEmailSettings } from '@/app/helpers/backend';
import { Loader } from '@/app/components/common/loader';
import Button from '@/app/components/common/button';
import { HiddenInput } from '@/app/components/common/form/input';
import { useI18n } from '@/app/providers/i18n';



const SendGridManageEmail = ({ settings, getSettings, loading, setCheckedValue }) => {
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');
    const i18n = useI18n();
    const[submitLoading,setSubmitLoading]=useState(false);

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                sendgrid: {
                    emailHost: settings?.sendgrid?.emailHost,
                    emailPort: settings?.sendgrid?.emailPort,
                    emailUsername: settings?.sendgrid?.emailUsername,
                    emailPassword: settings?.sendgrid?.emailPassword,
                    senderEmail: settings?.sendgrid?.senderEmail,
                    status: settings?.sendgrid?.status,
                }
            })

            if (settings?.serviceProvider === 'sendgrid') {
                setDefaultEmail('sendgrid');
                form.setFieldsValue({ default: 'sendgrid' });
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
           serviceProvider: "sendgrid",
           sendgrid: {
                emailHost: values?.sendgrid?.emailHost,
                emailPort: values?.sendgrid?.emailPort,
                emailUsername: values?.sendgrid?.emailUsername,
                emailPassword: values?.sendgrid?.emailPassword,
                senderEmail: values?.sendgrid?.senderEmail,
                status:values?.default
            },
            gmail: {
                emailUsername: settings?.gmail?.emailUsername,
                emailPassword: settings?.gmail?.emailPassword,
              
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
            <Loader/>
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
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">{i18n?.t("SendGrid SMTP")}</p>
                    <HiddenInput name="_id" />
                    <Form.Item
                        name={['sendgrid', 'emailHost']}
                        label={i18n?.t('Email Host')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email host!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input email host')} />
                    </Form.Item>
                    <Form.Item
                        name={['sendgrid', 'emailPort']}
                        label={i18n?.t('Email Port')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email port!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={"Please input email port"} />
                    </Form.Item>
                    <Form.Item
                        name={['sendgrid', 'emailUsername']}
                        label={i18n?.t('Email Username')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email username!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input email username')} />
                    </Form.Item>
                    <Form.Item
                        name={['sendgrid', 'emailPassword']}
                        label={i18n?.t('Email Password')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email password!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={'Please input email password'} type='password' />
                    </Form.Item>
                    <Form.Item
                        name={['sendgrid', 'senderEmail']}
                        label={i18n?.t('Sender Email')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input sender email!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input sender email')} />
                    </Form.Item>
                 
                    <Form.Item
                        name='default'
                        label={i18n?.t('Set Default')}
                    >
                        <Switch
                            checked={defaultEmail === 'sendgrid'}
                            onChange={(checked) => {
                                setDefaultEmail(checked ? 'sendgrid' : '')
                            }}
                            className={defaultEmail === 'sendgrid' ? 'bg-primary mt-1' : 'bg-blue-500 mt-1'}
                            checkedChildren={<span className="text-white">{i18n?.t('On')}</span>}
                            unCheckedChildren={<span className="text-white">{i18n?.t('Off')}</span>}
                        />
                    </Form.Item>
                    <div className='relative'>
                        <Button type='submit' loading={submitLoading} className="mt-2.5">{i18n?.t('submit')}</Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default SendGridManageEmail;