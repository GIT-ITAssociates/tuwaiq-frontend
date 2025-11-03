"use client"
import React from 'react'
import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { FaEye, FaReplyAll } from "react-icons/fa";
import { useFetch } from '@/app/helpers/hooks';
import { delContact, fetchContact } from '@/app/helpers/backend';
import Table from '@/app/components/common/table/table';



const Page = () => {
    const router = useRouter()
    const [contact, getContact, { loading, error }] = useFetch(fetchContact)

    const editHandleAction = (_id) => {
        router?.push(`/admin/contacts/${_id}`)
    }
    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            formatter: (name) => <span className='capitalize'>{name || 'N/A'}</span>,
        },
        {
            dataField: 'email',
            text: "Email",
            formatter: (email) => <span className=''>{email  || 'N/A'}</span>,
        },
        {
            dataField: 'caseType',
            text: "caseType",
            formatter: (_, d) => <span className=''>{d?.caseType  || 'N/A'}</span>,
        },
       
        {
            dataField: '_id', text: 'Reply Message', formatter: (_id, data) => (
                data?.status === false ?
                    <span className='inline-block bg-[#2C9FAF] p-[4px] rounded-[3px] text-white cursor-pointer' onClick={() => editHandleAction(_id)} title="Reply the email"><FaReplyAll /></span>
                    :
                    <span className='inline-block bg-green-700 p-[4px] rounded-[3px] text-white cursor-pointer' onClick={() => editHandleAction(_id)} title="View Details"><FaEye /></span>
            )
        }
    ]

    return (
        <>
            <Table
                columns={columns}
                data={contact}
                pagination={true}
                noActions={false}
                indexed={true}
                shadow={false}
                onDelete={delContact}
                onReload={getContact}
                error={error}
                loading={loading}
            />
        </>
    )
}

export default Page