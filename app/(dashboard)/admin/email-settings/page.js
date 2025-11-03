"use client"
import { Tabs, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useFetch } from '@/app/helpers/hooks';
import { fetchEmailSettings } from '@/app/helpers/backend';
import SendGridManageEmail from './sendgridProvider';
import GmailEmailProvider from './gmail';
import OtherProviderManageEmail from './otherServices';
import { useI18n } from '@/app/providers/i18n';


const EmailSettings = () => {
    const [form] = Form.useForm();
    const [settings, getSettings, { loading }] = useFetch(fetchEmailSettings)
    const [checkedValue, setCheckedValue] = useState(false);
    const i18n = useI18n();

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
        }
    }, [settings])

    return (
        <>
             <h1 className='pageTitle'>{i18n?.t("Email Settings")}</h1>
            <div className={'bg-white p-4 rounded'}>
                <Tabs defaultActiveKey="1" centered type="card">
                  {i18n?.t("SendGrid")}
                    <Tabs.TabPane tab={"SendGrid SMTP"} key="1">
                        <SendGridManageEmail settings={settings} getSettings={getSettings} loading={loading} checkedValue={checkedValue} setCheckedValue={setCheckedValue} />
                    </Tabs.TabPane>
                 {i18n?.t("Gmail Provider")}
                    <Tabs.TabPane tab={"Gmail Provider"} key="2">
                        <GmailEmailProvider settings={settings} getSettings={getSettings} loading={loading} checkedValue={checkedValue} setCheckedValue={setCheckedValue} />
                    </Tabs.TabPane>
                   {i18n?.t("Other Provider")}
                    <Tabs.TabPane tab={"Other Provider"} key="3">
                        <OtherProviderManageEmail settings={settings} getSettings={getSettings} loading={loading} checkedValue={checkedValue} setCheckedValue={setCheckedValue} />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>

    )
}

export default EmailSettings;