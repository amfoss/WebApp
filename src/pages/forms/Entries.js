import React, { useEffect, useState } from 'react';
import {Table, Icon, Button} from 'antd';
import {CSVDownload, CSVLink} from 'react-csv';
import dataFetch from '../../utils/dataFetch';
import Base from '../Base';
import TitleBar from '../../components/titlebar';
import EntryDetails from '../../modules/forms/entryDetails';

const Entries = props => {
  const formID = props.location.pathname.split("/")[2];
  const [data, setData] = useState('');
  const [fields, setFields] = useState([]);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const query = `query viewFormEntries($formID: Int!){
    viewEntries(formID: $formID)
    {
      id
      name
      submissionTime
      phone
      email
      formData
      {
        key
        value
      }
    }
  }`;

  const formFieldsQuery = `query getFromFields($formID: Int!){
   getFormFields(formID: $formID)
    {
      question
      key
      isImportant
    }
  }`;

  const fetchFields = async variables => dataFetch({ query: formFieldsQuery, variables });
  const fetchData = async variables => dataFetch({ query, variables });

  useEffect(() => {
    if (!isLoaded) {
      if (!isDataLoaded)
        fetchData({ formID }).then(r => {
          setDataLoaded(true);
          setData(r.data.viewEntries);
        });
      if (isDataLoaded && !isLoaded)
        fetchFields({ formID }).then(r => {
          setLoaded(true);
          setFields(r.data.getFormFields);
        });
    }
  });

  const routes = [
    {
      path: '/',
      name: 'Home',
    },
    {
      path: '/form/view-forms',
      name: 'Forms',
    },
    {
      path: `/form/${formID}`,
      name: `${formID}`,
    },
    {
      path: `#`,
      name: 'Entries',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: name => <b>{name}</b>,
    },
    {
      title: 'Submission Time',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      render: timestamp =>
        timestamp ? (
          new Date(timestamp).toLocaleString()
        ) : (
          <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
        ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  isLoaded && fields.length > 0 ? fields.map( f => {
    f.isImportant ? columns.push({
              title: f.question,
              dataIndex: f.key,
              key: f.key,
              sorter: (a, b) => a.name.localeCompare(b.name),
              render: (a,r) => r.formData.find(d=> d.key === f.key).value
            })
          : null;
  }) : null;


  const getExportData = isLoaded
    ? data.map(e => {
        const obj = {
          name: e.name,
          submissionTime: e.submissionTime,
          email: e.email,
          phone: e.phone,
        };
        fields.map(f => {
          obj[f.question] = e.formData.find(d => d.key === f.key).value;
          return null;
        });
        return obj;
      })
    : null;

  return (
    <Base title="View Forms | Forms" {...props}>
      <TitleBar
        routes={routes}
        title="View Entries"
        subTitle="View & manage entries to this form"
      />
      <div className="d-flex px-4 justify-content-end">
      {isLoaded ? (
        <CSVLink data={getExportData}>
          <Button type="primary">Export Data</Button>
        </CSVLink>
      ) : null}
      </div>
      <div className="p-4">
        <Table
          loading={!isLoaded}
          dataSource={data}
          columns={columns}
          expandedRowRender={e => <EntryDetails fields={fields} data={e} />}
        />
      </div>
    </Base>
  );
};

export default Entries;
