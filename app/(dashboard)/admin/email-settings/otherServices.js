"use client";
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Switch } from 'antd';
import { useAction } from '@/app/helpers/hooks';
import { postEmailSettings } from '@/app/helpers/backend';
import { Loader } from '@/app/components/common/loader';
import { HiddenInput } from '@/app/components/common/form/input';
import Button from '@/app/components/common/button';
const { Option } = Select;



const OtherProviderManageEmail = ({ settings, getSettings, loading, setCheckedValue }) => {
   
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');
    const[submitLoading,setSubmitLoading]=useState(false);

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                serviceProvider:settings?.serviceProvider,
                other: {
                    emailHost: settings?.other?.emailHost,
                    emailPort: settings?.other?.emailPort,
                    emailAddress: settings?.other?.emailAddress,
                    emailPassword: settings?.other?.emailPassword,
                }
            });

            if (settings?.serviceProvider === 'others') {
                setDefaultEmail('others');
                form.setFieldsValue({ default: 'others' });
                setCheckedValue(true);
            } else {
                setDefaultEmail('');
                form.setFieldsValue({ default: '' });
                setCheckedValue(false);
            }
        }
    }, [settings]);


    const onFinish = async (values) => {
        setSubmitLoading(true)
        const postData = {
            _id: values._id,
            serviceProvider: values?.other?.provider_name,

            sendgrid: {
                emailHost: settings?.sendgrid?.emailHost,
                emailPort: settings?.sendgrid?.emailPort,
                emailUsername: settings?.sendgrid?.emailUsername,
                emailPassword: settings?.sendgrid?.emailPassword,
                senderEmail: settings?.sendgrid?.senderEmail,

            },
            
            gmail: {
                emailUsername: settings?.gmail?.emailUsername,
                emailPassword: settings?.gmail?.emailPassword,
                
            },
            other: {
                emailHost: values?.other?.emailHost,
                emailPort: values?.other?.emailPort,
                emailAddress: values?.other?.emailAddress,
                emailPassword: values?.other?.emailPassword,
                status: values?.default,
            }
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
                        Other Provider
                    </p>

                    <HiddenInput name="_id" />

                    <Form.Item
                        name={['other', 'emailHost']}
                        label={'Email Host'}
                        rules={[
                            {
                                required: true,
                                message: "Please input email host!",
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={'Please input email host'} />
                    </Form.Item>

                    <Form.Item
                        name={['other', 'emailPort']}
                        label={("Email Port")}
                        rules={[
                            {
                                required: true,
                                message: ("Please input email port!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={'Please input email port'} />
                    </Form.Item>

                    <Form.Item
                        name={['other', 'emailAddress']}
                        label={("Email Address")}
                        rules={[
                            {
                                required: true,
                                message: ("Please input email address!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={'Please input email address'} />
                    </Form.Item>

                    <Form.Item
                        name={['other', 'emailPassword']}
                        label={("Email Password")}
                        rules={[
                            {
                                required: true,
                                message: ("Please input email password!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={'Please input email password'} type='password' />
                    </Form.Item>

                    <Form.Item
                        name={['other', 'provider_name']}
                        label={("Service Provider")}
                        rules={[
                            {
                                required: true,
                                message: ("Please input service provider!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Select
                            placeholder={'Please input service provider'}
                            allowClear
                        >
                            <Option value="gmail">{'Gmail'}</Option>
                            <Option value="sendgrid">{'SendGrid'}</Option>
                            <Option value="other">{'Other'}</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='default'
                        label={("Set Default")}
                        className='mt-1'
                    >
                        <Switch
                            checked={defaultEmail === 'others'}
                            onChange={(checked) => {
                                setDefaultEmail(checked ? 'others' : '')
                            }}
                            className={defaultEmail === 'others' ? 'bg-primary mt-1' : 'bg-blue-500 mt-1'}
                            checkedChildren={<span className="text-white">{'On'}</span>}
                            unCheckedChildren={<span className="text-white">{'Off'}</span>}
                        />
                    </Form.Item>
                    <div className='relative'>
                        <Button type='submit'loading={submitLoading} className="mt-2.5">Submit</Button>
                    </div>
                </div>
            </Form>

        </div>
    );
};


export default OtherProviderManageEmail;