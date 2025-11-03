
import React from 'react';
import { postMessages } from '@/app/helpers/backend';
import Button from '@/app/components/common/button';
import { useI18n } from '@/app/providers/i18n';
import { Form, Input, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useAction } from '@/app/helpers/hooks';

const Messsage = ({ open, setOpen, data, setIsAppointmentOpen }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const {push} = useRouter()
    console.log("==================>>", data)
    return (
        <Modal
            open={open}
            title={<span className='text-center'>{i18n.t('Send Message')}</span>}
            onCancel={() => setOpen(false)}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={((values) => {
                    useAction(postMessages, { to: data, ...values }, () => {
                        setOpen(false);
                        form.resetFields()
                        setIsAppointmentOpen(false)
                        push('/user/message')
                    });
                    setOpen(false);
                    form.resetFields()
                })}
            >
                <div className='mt-5 '>
                    <Form.Item
                        name='message'
                    >
                        <Input placeholder='Enter your message...' className=' py-3  ' />
                    </Form.Item>
                    <Button type='submit' className='!mt-5'>{i18n.t('Send Message')}</Button>
                </div>
            </Form>
        </Modal>
    );
};

export default Messsage;