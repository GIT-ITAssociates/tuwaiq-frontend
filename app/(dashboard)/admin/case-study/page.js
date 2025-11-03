'use client'
import Button from '@/app/components/common/button'
import FormDatePicker from '@/app/components/common/form/date_picker'
import FormInput, { HiddenInput } from '@/app/components/common/form/input'
import JodiEditor from '@/app/components/common/form/jodiEditor'
import Table, { TableImage } from '@/app/components/common/table/table'
import { delCaseStudy, getCaseStudyList, postCaseStudy, postSingleImage } from '@/app/helpers/backend'
import { useAction, useFetch } from '@/app/helpers/hooks'
import { columnFormatter, noSelected } from '@/app/helpers/utils'
import { useI18n } from '@/app/providers/i18n'
import { Form, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import MultipleImageInput from '@/app/components/common/form/multiImage'
import PageTitle from '@/app/components/common/title/title'

const Page = () => {
  const [data, getData, { loading }] = useFetch(getCaseStudyList)
  let { languages, langCode } = useI18n();
  const { push } = useRouter()
  const [form] = Form.useForm()
  const i18n = useI18n()
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedLang, setSelectedLang] = useState();
  const[submitLoading,setSubmitLoading]=useState(false);
  
  useEffect(() => {
    setSelectedLang(langCode)
  }, [langCode])


  const columns = [
    {
      text: "thumbnail image",
      dataField: "thumbnail",
      formatter: (_, d) => {
        return <TableImage url={d?.thumbnail || "/images/no-image.png"} />;
      },
    },
    {
      text: "Title",
      dataField: "title",
      formatter: (_, d) => {
        return <div>{columnFormatter(d?.title)}</div>;
      },
    },
    {
      text: "short description",
      dataField: "short_description",
      formatter: (_, d) => {
        return <div>{columnFormatter(d?.short_description)}</div>;
      }
    }
  ]
  const onFinish = async (values) => {
    try{
    setSubmitLoading(true);
    if (values?.image[0]?.originFileObj) {
      const image = values?.image[0]?.originFileObj;
      const { data } = await postSingleImage({ image: image, image_name: "Image" });
      values.image = data;
    } else {
      values.image = values?.image[0]?.url ? values?.image[0]?.url : values?.image;
    }

    if (values?.thumbnail[0]?.originFileObj) {
      const image = values?.thumbnail[0]?.originFileObj;
      const { data } = await postSingleImage({ image: image, image_name: "thumbnail" });
      values.thumbnail = data;
    } else {
      values.thumbnail = values?.thumbnail[0]?.url ? values?.thumbnail[0]?.url : values?.thumbnail;
    }

    const data = {
      title: values?.title,
      short_description: values?.short_description,
      description: values?.description,
      feature: values?.feature,
      image: values?.image,
      thumbnail: values?.thumbnail,
      challenges: {
        title: values?.challenges?.title,
        description: values?.challenges?.description,
      },
      solve: {
        title: values?.solve?.title,
        description: values?.solve?.description,
      },
      solved: {
        title: values?.solved?.title,
        description: values?.solved?.description,
      },
      solved_result: {
        title: values?.solved_result?.title,
        description: values?.solved_result?.description,
      },
      next_hearing: {
        date: dayjs(values?.next_hearing?.date).format('YYYY-MM-DD'),
        title: values?.next_hearing?.title,
        description: values?.next_hearing?.description,
      },
    };

    if (isEdit) {
      data._id = values._id;
    }

    useAction(postCaseStudy, data,
      () => {
        setSubmitLoading(false);

        setOpen(false);
        getData();
        form.resetFields();
      }
    );
  }
  catch(e){setSubmitLoading(false)}
  finally{setSubmitLoading(false)}
  };

  return (
    <div>
      <PageTitle title='Case Study' />
      <Table
        data={data}
        columns={columns}
        onView={(data) => push(`/admin/case-study/view/${data?._id}`)}
        onEdit={async (values) => {
          if (values.next_hearing && values?.next_hearing.date) {
            values.next_hearing.date = moment(values?.next_hearing.date);
          }
         
          form.setFieldsValue({
            ...values,
            values: values?.title[langCode],
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
            thumbnail: values?.thumbnail
            ? [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: typeof values.thumbnail === 'string' ? values.thumbnail : values.thumbnail[0].url || '',
              }
            ]
            : [],
            
          });
          setOpen(true);
          setIsEdit(true);
        }
        }
        action={
          <Button onClick={() => {
            form.resetFields();
            setOpen(true);
          }}>
            {i18n?.t("Add Case Study")}
          </Button>
        }
        loading={loading}
        onReload={getData}
        onDelete={delCaseStudy}
        langCode={langCode}
        indexed
        pagination
      />

      <Modal open={open} onCancel={() => {setOpen(false);setIsEdit(false)}} title={isEdit ? i18n?.t("Edit Case Study") : i18n?.t("Add Case Study")} footer={null} width={900}>
        <div className="flex justify-start flex-wrap gap-3 py-3">
          {languages?.map((l, index) => (
            <button
              onClick={() => setSelectedLang(l?.code)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l?.code === selectedLang
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              key={index}
            >
              {l?.name}
            </button>
          ))}
        </div>
        <div className="h-[600px] overflow-y-auto scroll-container">

        <Form layout='vertical' form={form} onFinish={onFinish}>
          {isEdit && <HiddenInput name="_id" />}
          {languages?.map((l, index) => (
            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>

              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormInput required label="Title" name={['title', l?.code]} />
                <FormInput required label="Short Description" name={['short_description', l?.code]} />
              </div>
            </div>
          ))
          }

          {languages?.map((l, index) => (
            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
              <FormInput required label="Description" textArea={true} name={['description', l?.code]} />
              <JodiEditor required label={i18n?.t('features')} name={['feature', l?.code]} />
            </div>
          ))}
          <h1 className='text-xl font-bold py-3 px-3 border rounded text-primary font-mono mb-3 border-primary'>{i18n?.t("Challenges")}</h1>
          {languages?.map((l, index) => (
            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormInput required label="Title" name={['challenges', 'title', l?.code]} />
                <FormInput required label="Description" name={['challenges', 'description', l?.code]} />
              </div>
            </div>
          ))}
          <h1 className='text-xl font-bold py-3 px-3 border rounded text-primary font-mono mb-3 border-primary'>{i18n?.t("Problem")}</h1>

          {
            languages?.map((l, index) => (
              <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                  <FormInput required label="Title" name={['solve', 'title', l?.code]} />
                  <FormInput required label="Description" name={['solve', 'description', l?.code]} />
                </div>
              </div>
            ))
          }
          <h1 className='text-xl font-bold py-3 px-3 border rounded text-primary font-mono mb-3 border-primary'>{i18n?.t("solved")}</h1>
          {languages?.map((l, index) => (
            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormInput required label="Title" name={['solved', 'title', l?.code]} />
                <FormInput required label="Description" name={['solved', 'description', l?.code]} />
              </div>
            </div>
          ))}

          <h1 className='text-xl font-bold py-3 px-3 border rounded text-primary font-mono mb-3 border-primary'>{i18n?.t("solved_result")}</h1>
          {languages?.map((l, index) => (
            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormInput required label="Title" name={['solved_result', 'title', l?.code]} />
                <FormInput required label="Description" name={['solved_result', 'description', l?.code]} />
              </div>
            </div>
          ))}
          <h1 className='text-xl font-bold py-3 px-3 border rounded text-primary font-mono mb-3 border-primary'>{i18n?.t("Next_hearing")}</h1>
          {languages?.map((l, index) => (
            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormInput required label="Title" name={['next_hearing', 'title', l?.code]} />
                <FormDatePicker label="Date" name={['next_hearing', 'date']} />
                <FormInput label="Description" name={['next_hearing', 'description', l?.code]} />
                <div className="flex gap-4">
                  <MultipleImageInput required label={i18n?.t("Image")} name="image" />
                  <MultipleImageInput required label={i18n?.t("Thumbnail")} name="thumbnail" />
                </div>
              </div>
            </div>
          ))}
          <Button type='submit'loading={submitLoading} onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n?.t("Submit")}</Button>
        </Form>
       </div>
      </Modal>
    </div>
  )
}

export default Page