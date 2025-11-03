"use client";
import React from 'react';
import { Switch } from 'antd';
import { useRouter } from 'next/navigation';
import { PiTranslate } from "react-icons/pi";
import Button from '@/app/components/common/button';
import { useActionConfirm, useFetch } from '@/app/helpers/hooks';
import { delLanguage, fetchLanguages, postLanguage } from '@/app/helpers/backend';
import Table from '@/app/components/common/table/table';
import { useI18n } from '@/app/providers/i18n';
import PageTitle from '@/app/components/common/title/title';


const Languages = () => {
    const i18n = useI18n();
    const { push } = useRouter()
    const [languages, getLanguages, { loading }] = useFetch(fetchLanguages)
    let columns = [
        {
            text: 'Name',
            dataField: 'name',
            key: 'name',
        },
        { text: 'Flag', dataField: 'flag', key: 'flag' },
        { text: 'Code', dataField: 'code', key: 'code' },
        {
            text: 'Default', dataField: 'default', formatter: (_, d) => <Switch
                checkedChildren={i18n?.t('Active')}
                unCheckedChildren={i18n?.t('Inactive')}
              
                checked={d?.default}
                onChange={async (e) => {
                    await useActionConfirm(postLanguage, { _id: d._id, default: e }, getLanguages, (i18n?.t('Are you sure you want to change default language?')), i18n?.t('Yes, Change'));
                }}
                className='!bg-primary'
            />
        },
        {
            text: 'Status', dataField: 'active', formatter: (_, d) => <Switch
            checkedChildren={i18n?.t('Active')}
            unCheckedChildren={i18n?.t('Inactive')}
                checked={d?.active}
                onChange={async (e) => {
                    await useActionConfirm(postLanguage, { _id: d._id, active: e }, getLanguages, (i18n?.t('Are you sure you want to change status?')), i18n?.t('Yes, Change'));
                }}
                className='!bg-primary'
            />
        },
       
    ]

    let actions = ({ _id }) => (
        <button className="border border-primary text-primary p-2 rounded-full hover:bg-primary hover:text-white duration-500"
            title="Translate" onClick={() => {
                push('/admin/languages/translations/' + _id)
            }}>
            <PiTranslate size={12} />
        </button>
    )

    return (
        <div>
            <PageTitle title={i18n?.t('Languages')} />
            <Table
                columns={columns}
                data={{
                    ...languages,
                    docs: languages?.docs?.map(doc => ({
                        ...doc,
                        disableDelete: doc.code === 'en' ? 1 : 0,
                    })),
                }}
                onReload={getLanguages}
                loading={loading}
                pagination
                indexed
                action={(
                    <Button onClick={() => push('/admin/languages/add')}>{i18n?.t('Add Language')}</Button>
                )}
                onEdit={({ _id }) => push('/admin/languages/edit/' + _id)}
                onDelete={delLanguage}
                actions={actions}
            />
          
        </div>
    );
};

export default Languages;