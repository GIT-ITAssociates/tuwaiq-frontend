'use client';
import { useState } from 'react';
import { Form,  Modal, Rate, Switch } from 'antd';
import { useAction, useActionConfirm, useFetch } from '@/app/helpers/hooks';
import Table from '@/app/components/common/table/table';
import { delAdminTestimonial, detailsTestimonial, fetchAdminTestimonial, postAdminTestimonial, postSingleImage, postUserTestimonial } from '@/app/helpers/backend';
import { useI18n } from '@/app/providers/i18n';
import Image from 'next/image';
import Button from '@/app/components/common/button';
import PageTitle from '@/app/components/common/title/title';
import FormInput from '@/app/components/common/form/input';
import MultipleImageInput from '@/app/components/common/form/multiImage';

const Page = () => {
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchAdminTestimonial);
    const [details, getDetails] = useFetch(detailsTestimonial, {}, false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const [submitLoading,setSubmitLoading]=useState(false)

    const onFinish = async (values) => {
        try{
        setSubmitLoading(true)
        if (values?.image[0]?.originFileObj) {
                      const image = values?.image[0]?.originFileObj;
                      const { data } = await postSingleImage({ image: image, image_name: 'image' });
                      values.image = data;
                    } else {
                      values.image = values?.image[0]?.url;
                    }
        const formData ={
            image: values?.image,
            name: values?.name,
            email: values?.email,
            description: values?.description,
            rating: values?.rating,
        }
        useAction(postUserTestimonial, formData).then((res) => {
            setSubmitLoading(false)
             getData();
            form.resetFields();
            setOpen(false);
        });
        }
        catch(e){setSubmitLoading(false)}
        finally{setSubmitLoading(false)}

    };

    const columns = [
        {
            text: 'Description',
            dataField: 'description',
            formatter: (_, d) => (
                <span className='line-clamp-2 w-[150px] text-wrap sm:w-[250px]'>{_}</span>
            ),
        },
        {
            text: 'rating',
            dataField: 'rating',
            formatter: (_, d) => (
                <Rate className='!text-primary' disabled defaultValue={d?.rating} />
            ),
        },
        {
            text: 'active',
            dataField: 'active',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Active')}
                    unCheckedChildren={i18n?.t('Inactive')}
                    checked={d?.active}
                    onChange={async (e) => {
                        await useActionConfirm(postAdminTestimonial, { _id: d._id, active: e });
                        getData();
                    }}
                    className='!bg-primary'
                />
            ),
        },
    ];

    return (
        <div>
            <PageTitle title='Testimonial' />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                indexed
                pagination
                onDelete={delAdminTestimonial}
                onView={(data) => {
                    getDetails({ _id: data._id });
                    openModal();
                }}
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                        }}
                    >
                        {i18n?.t('Add Testimonial')}
                    </Button>
                }
            />

            <Modal open={open} onCancel={() => setOpen(false)} title={i18n?.t('Add Testimonial')} footer={null} centered width={600}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label={i18n?.t('User Name')}
                        name="name"
                        required
                    />

                    <FormInput
                        label={i18n?.t('User Email')}
                        name="email"
                        required
                    />
                   <FormInput
                        label={i18n?.t('Description')}
                        name="description"
                        required
                    />

                    <FormInput
                        label={i18n?.t('Rating')}
                        name="rating"
                        type="number"
                        rules={[
                            {
                              validator(_, value) {
                                if (value === undefined || value === null || value === "") {
                                  return Promise.reject(
                                      new Error(i18n?.t("Please enter a valid rating"))
                                  );
                                }
                                if (value < 0) {
                                  return Promise.reject(
                                      new Error(i18n?.t("Rating cannot be negative"))
                                  );
                                }
                                if (value > 5) {
                                  return Promise.reject(
                                      new Error(i18n?.t("Rating cannot be greater than 5"))
                                  );
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}
                    />
                    </div>
                    <MultipleImageInput name="image" label={i18n?.t('Image')} required />
                    <Button
                        className="mt-4"
                        type="submit"
                        loading={loading}
                    >
                        {i18n?.t('submit')}
                    </Button>
                </Form>
            </Modal> 
            <Modal
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
                centered
                width={600}
                className="rounded-lg"
            >
                <div className="flex items-center mb-6">
                    <Image
                        src={details?.image || '/images/defaultimg.jpg'}
                        alt={details?.name}
                        width={1000}
                        height={1000}
                        className="rounded-full border-2 border-primary h-[60px] w-[60px] object-cover"
                    />
                    <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-800">{details?.name}</h2>
                        <p className="text-sm text-gray-500">{details?.email}</p>
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <Rate disabled value={details?.rating} className="!text-primary" />
                </div>

                <div className="text-gray-700 mb-4 leading-relaxed">
                    <p>{details?.description}</p>
                </div>

                <div className="flex items-center justify-end mt-6">
                    <Button className="ml-4"loading={submitLoading} onClick={closeModal}>{i18n?.t('Close')}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Page;