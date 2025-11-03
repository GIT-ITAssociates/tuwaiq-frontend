'use client';
import { delAttorney, fetchSpecialization, getAttorney, postAttorney, postSingleImage } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import React, { useState } from 'react'
import { Modal, Form, message } from "antd"
import Button from '@/app/components/common/button';
import FormInput, { HiddenInput } from '@/app/components/common/form/input';
import FormSelect from '@/app/components/common/form/select';
import Table, { TableImage } from '@/app/components/common/table/table';
import { useI18n } from '@/app/providers/i18n';
import MultipleImageInput from '@/app/components/common/form/multiImage';
import PageTitle from '@/app/components/common/title/title';


const Page = () => {
  const [data, getData, { loading }] = useFetch(getAttorney);
  const i18n = useI18n();
  const { languages, langCode } = useI18n();
  const [isEdit, setIsEdit] = useState(false);
  const [openmodal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  // const [specialization] = useFetch(fetchSpecialization);
      const [specialization] = useFetch(fetchSpecialization, { limit: 200 });
  
  const[submitLoading,setSubmitLoading]=useState(false);


  const columns = [
    {
      text: 'image',
      dataField: 'image',
      formatter: (_, d) => <TableImage url={d?.image ? d?.image : "/default.jpg"} />,
    },
    {
      text: 'Name',
      dataField: 'name',
      formatter: (name) => <span className='capitalize'>{name || 'N/A'}</span>,
    },
    {
      text: 'Email',
      dataField: 'email',
      formatter: (email) => <span >{email || 'N/A'}</span>,
    },
    {
      text: 'phone_no',
      dataField: 'phone_no',
      formatter: (phone_no) => <span >{phone_no || 'N/A'}</span>,
    },
    {
      text: 'Case Type',
      dataField: 'specialization',
      formatter: (_, d) => {
        const specilize = specialization?.docs?.map((i, index) => { if (i?._id == d?.specialization) { return i?.name } })
        return (
          <span>{specilize}</span>
        )
      }
    },
    {
      text: 'experience',
      dataField: 'experience',
      formatter: (experience) => <span className='capitalize'>{experience}</span>,
    },
  ];

  return (
    <div>
      <PageTitle title={i18n?.t('Attorney')} />
      <Table
        columns={columns}
        data={data}
        loading={loading}
        onReload={getData}
        action={
          <Button
            onClick={() => {
              form.resetFields();
              setOpenModal(true);
              setIsEdit(false);
            }}
          >
            {i18n?.t("Add Attorney")}
          </Button>
        }
        onEdit={(values) => {
          form.setFieldsValue({
            ...values,
            image: values?.image
              ? [
                {
                  uid: '-1',
                  name: 'image.png',
                  status: 'done',
                  url: typeof values.image === 'string' ? values.image : values.image[0].url || '',
                }
              ]
              : [],
          });
          setOpenModal(true);
          setIsEdit(true);
        }}
        onDelete={delAttorney}
        indexed
        pagination
        langCode={langCode}
      />
      <Modal width={800} open={openmodal} onCancel={() => setOpenModal(false)} title={isEdit ? i18n?.t("Edit Attorney") : i18n?.t("Add Attorney")} footer={null} destroyOnClose>
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            setSubmitLoading(true);
            if (values?.image[0]?.originFileObj) {
              const image = values?.image[0]?.originFileObj;
              const { data } = await postSingleImage({ image: image, image_name: 'coupon' });
              values.image = data;
            } else {
              values.image = values?.image[0]?.url;
            }
            const formattedValues = {
              ...values,
              image: values?.image,
              specialization: values?.specialization,
              languages: values?.languages,
              certification: values?.certification,
              isVerified: true,
            };

            try {
              if (isEdit) {
                await postAttorney(formattedValues);
                message.success("Attorney updated successfully");
              } else {
                await postAttorney(formattedValues);
                message.success("Attorney added successfully");
              }
              setSubmitLoading(false)
              setOpenModal(false);
              getData();
              form.resetFields();
            } catch (error) {
              setSubmitLoading(false);
              message.error(`Failed to ${isEdit ? 'update' : 'add'} attorney`);
            }
            finally{
              setSubmitLoading(false);

            }
          }}
          className='mt-5'
        >
          <div className="">
            {
              isEdit && (<HiddenInput name="_id" />)
            }

            <div className='grid md:grid-cols-2 gap-4'>
              <FormInput name="name" label="Name" placeholder="Enter attorney name" required />
              <FormInput name="email" label="Email" placeholder="Enter attorney email" required />
            </div>
            <div className='grid md:grid-cols-2 gap-4 items-center'>
              <FormInput name="password" label="Password" placeholder="Enter attorney password"  />
              <FormSelect
                options={specialization?.docs?.map(spa => ({
                  label: spa?.name,
                  value: spa?._id,
                }))}
                name="specialization"
                label={i18n?.t('Case Type')}
                placeholder={i18n?.t('Select Case Type')}
                required 
                className=""
                />
            </div>
            <div className='grid md:grid-cols-2 gap-4'>
              <FormInput name="phone_no" label="Phone Number" placeholder="Enter attorney phone number" required />
              <div className='grid md:grid-cols-2 gap-4'>
                <FormInput name="experience" type={"number"} rules={[
                  () => ({
                    validator(_, value) {
                      if (value > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(i18n?.t('Experience must be a number and greater than 0')));
                    },
                  })
                ]} label="Experience" placeholder={i18n?.t('Enter attorney experience')} required />
                <FormInput name='price' type={"number"} label={i18n?.t('Price')} placeholder="Enter attorney price" required />
              </div>
            </div>
            <div className="flex gap-4">
              <MultipleImageInput name="image" label={i18n?.t('Image')} required />
            </div>
          </div>
          <Button type='submit'loading={submitLoading}>{i18n?.t('submit')}</Button>
        </Form>
      </Modal>
    </div>
  )
}

export default Page