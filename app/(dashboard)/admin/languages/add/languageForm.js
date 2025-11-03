import Button from '@/app/components/common/button';
import FormInput, { HiddenInput } from '@/app/components/common/form/input';
import FormSelect from '@/app/components/common/form/select';
import { postLanguage } from '@/app/helpers/backend';
import { useAction } from '@/app/helpers/hooks';
import { Card, Form } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LanguageForm = ({ title, form }) => {
    // const i18n = useI18n();
    const { push } = useRouter();
    const[submitLoading,setSubmitLoading]=useState(false);
    
    return (
        <>
            <Card>
                <h6 className="mb-4 text-xl">Language Information</h6>

                <div className="body">
                    <Form form={form} layout="vertical" onFinish={(values) => {
                        setSubmitLoading(true);
                        return useAction(
                            values?._id ? postLanguage : postLanguage,
                            values, () => {
                                push('/admin/languages');
                                setSubmitLoading(false);

                            })
                    }}>
                        {
                            title !== "Add Languages" && <HiddenInput name="_id" />
                        }
                        <div className="md:w-1/2">
                            <FormInput placeholder={'Enter Name'} name="name" label={("Name")} required/>
                        </div>
                        <div className="md:w-1/2">
                            <FormInput placeholder={'Enter Code '} name="code" label={("Code")} required />
                        </div>
                        <div className="md:w-1/2">
                            <FormInput placeholder={'Enter Flag'} name="flag" label={("Flag")} required />
                        </div>
                        <div className="md:w-1/2 multi">
                            <FormSelect placeholder={'Select Rtl'} name="rtl" label={("Rtl Support")}
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false }
                                ]}
                                required
                            />
                        </div>
                        <div className="md:w-1/2 multi">
                            <FormSelect placeholder={'Select Status'} name="active" label={"Status"}
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false }
                                ]}
                                required
                            />
                        </div>
                        <Button type='submit' loading={submitLoading}>
                            {/* {i18n?.t(title === "Add Languages" ? "Submit" : "Update")} */}
                            {title === "Add Languages" ? "Submit" : "Update"}
                        </Button>
                    </Form>
                </div>
            </Card>
        </>
    );
}

export default LanguageForm