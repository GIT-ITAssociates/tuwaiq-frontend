"use client";
import { Form } from 'antd';
import React, { useEffect } from 'react';

// import PageTitle from '../../../../components/common/page-title';
// import { useFetch } from '../../../../../helpers/hooks';
// import { fetchLanguage } from '../../../../../helpers/backend';
import LanguageForm from '../../add/languageForm';
import { useFetch } from '@/app/helpers/hooks';
import { fetchLanguages } from '@/app/helpers/backend';
const EditLanguages = ({ params }) => {
    const [form] = Form.useForm();
    const [data, getData] = useFetch(fetchLanguages, {}, false);
   
    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id });
        }
    }, [params]);

    useEffect(() => {
        if (data?.docs) {
            const language = data?.docs?.find(doc => doc?._id === params?._id);
            if (language) {
                form.setFieldsValue({
                    ...language,
                    rtl: language?.rtl ? true : false,
                    default: language?.default ? true : false,
                    flag: language?.flag,
                    name: language?.name,
                    code: language?.code,
                    active: language?.active ? true : false
                });
            }
        }
    }, [data, params._id]);

    return (
        <>
            {/* <PageTitle title="Edit Languages" /> */}
            <LanguageForm title="Edit Languages" form={form} />
        </>
    );
};

export default EditLanguages;