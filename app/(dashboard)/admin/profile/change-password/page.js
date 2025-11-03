'use client';
import { Form, Input, message } from 'antd';
import React from 'react';
import Button from '@/app/components/common/button';
import { useAction } from '@/app/helpers/hooks';
import { updatepassword } from '@/app/helpers/backend';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/userContext';
import { useI18n } from '@/app/providers/i18n';

const AdminChangePassword = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { setUser } = useUser();
    const i18n=useI18n();
    return (
        <div className='mx-auto lg:w-3/5 w-full rounded bg-white px-10 py-10 '>
            <h1 className='text-2xl font-bold md:text-xl '>{i18n.t('Change Password')}</h1>
            <hr className='border-Font2_Color w-full mt-5' />
            <div className='mx-auto bg-white py-8'>
                <Form
                    layout='vertical'
                    form={form}
                    onFinish={async (values) => {
                        const payload = {
                            oldPassword: values?.oldPassword,
                            newPassword: values?.newPassword,
                        }

                        useAction(updatepassword, payload, () => {
                            localStorage.removeItem("token");
                            message.success("Sign out successfully");
                            setUser({});
                            router.push('/');

                        });
                    }}
                >
                    <div className='flex flex-col gap-5'>
                        <Form.Item
                            name='oldPassword'
                            label={
                                <p className="text-base font-medium text-[#242628] ">
                                    {i18n.t('Old Password')}
                                </p>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: i18n.t('Please input your old password!'),
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder={'Enter Your Old Password'}
                                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                            />
                        </Form.Item>
                        <Form.Item
                            name='newPassword'
                            label={
                                <p className="text-base font-medium text-[#242628] ">
                                    {i18n.t('New Password')}
                                </p>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: i18n.t('Please input your password!'),
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                placeholder={'Enter Your New Password'}
                                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                            />
                        </Form.Item>
                        <Button type='submit' className='w-fit'>
                            {i18n.t('Change Password')}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AdminChangePassword;
