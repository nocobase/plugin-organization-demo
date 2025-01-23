/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DeleteOutlined, DownOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  Checkbox,
  FormButtonGroup,
  FormDrawer,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Reset,
  Submit,
} from '@formily/antd-v5';
import { createSchemaField, useField } from '@formily/react';
import { SchemaComponent, SchemaComponentOptions, useAPIClient } from '@nocobase/client';
import { Alert, App, Button, Card, Flex, Space, Table } from 'antd';
import React, { useContext, useState } from 'react';
import { OrganizationContext } from './OrganizationProvider';
import { useT } from './locale';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Checkbox,
    Radio,
  },
});

const schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: `{{ t("Title") }}`,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    code: {
      type: 'string',
      title: `{{ t("Code") }}`,
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-disabled': '{{ !createOnly }}',
    },
  },
};

export function OrganizationList({ request, setSelectRowKeys }) {
  const { modal } = App.useApp();
  const t = useT();
  const api = useAPIClient();
  const { data, loading, refresh } = request || {};

  const resource = api.resource('organization');

  const handleDelete = (data) => {
    modal.confirm({
      title: t('Delete variable'),
      content: t('Are you sure you want to delete it?'),
      async onOk() {
        await resource.destroy({
          filterByTk: data.code,
        });
        refresh();
      },
    });
  };

  const handleEdit = async (initialValues) => {
    const drawer = FormDrawer({ title: t('Edit') }, () => {
      return (
        <FormLayout layout={'vertical'}>
          <SchemaComponentOptions scope={{ createOnly: false, t }}>
            <SchemaField schema={schema} />
          </SchemaComponentOptions>
          <FormDrawer.Footer>
            <FormButtonGroup align="right">
              <Reset
                onClick={() => {
                  drawer.close();
                }}
              >
                {t('Cancel')}
              </Reset>
              <Submit
                onSubmit={async (data) => {
                  await api.request({
                    url: `organization:update?filterByTk=${initialValues.code}`,
                    method: 'post',
                    data: {
                      ...data,
                    },
                  });
                  request.refresh();
                }}
              >
                {t('Submit')}
              </Submit>
            </FormButtonGroup>
          </FormDrawer.Footer>
        </FormLayout>
      );
    });
    drawer.open({
      initialValues: { ...initialValues },
    });
  };

  return (
    <div>
      <Table
        loading={loading}
        size="middle"
        rowKey={'code'}
        dataSource={data?.data}
        pagination={false}
        columns={[
          {
            title: t('Title'),
            dataIndex: 'title',
            ellipsis: true,
          },

          {
            title: t('Code'),
            dataIndex: 'code',
            ellipsis: true,
          },
          {
            title: t('Actions'),
            width: 200,
            render: (record) => (
              <Space>
                <a onClick={() => handleEdit(record)}>{t('Edit')}</a>
                <a onClick={() => handleDelete(record)}>{t('Delete')}</a>
              </Space>
            ),
          },
        ]}
        rowSelection={{
          type: 'checkbox',
          onChange: (rowKeys, selectedRows) => {
            setSelectRowKeys(rowKeys);
          },
        }}
      />
    </div>
  );
}

export function OrganizationPage() {
  const api = useAPIClient();
  const t = useT();
  const { modal } = App.useApp();
  const { organizationRequest } = useContext(OrganizationContext);
  const [selectRowKeys, setSelectRowKeys] = useState([]);
  const resource = api.resource('organization');

  const handelBulkDelete = () => {
    if (selectRowKeys.length > 0) {
      modal.confirm({
        title: t('Delete variable'),
        content: t('Are you sure you want to delete it?'),
        async onOk() {
          await resource.destroy({
            filterByTk: selectRowKeys,
          });
          organizationRequest?.refresh?.();
        },
      });
    }
  };
  const handelRefresh = () => {
    organizationRequest?.refresh?.();
  };

  const filterOptions = [
    {
      name: 'title',
      title: t('title'),
      operators: [
        { label: '{{t("contains")}}', value: '$includes', selected: true },
        { label: '{{t("does not contain")}}', value: '$notIncludes' },
        { label: '{{t("is")}}', value: '$eq' },
        { label: '{{t("is not")}}', value: '$ne' },
      ],
      schema: {
        type: 'string',
        title: t('Title'),
        'x-component': 'Input',
      },
    },

    {
      name: 'code',
      title: t('Code'),
      operators: [
        { label: '{{t("contains")}}', value: '$includes', selected: true },
        { label: '{{t("does not contain")}}', value: '$notIncludes' },
        { label: '{{t("is")}}', value: '$eq' },
        { label: '{{t("is not")}}', value: '$ne' },
      ],
      schema: {
        type: 'string',
        title: t('Code'),
        'x-component': 'Input',
      },
    },
  ];
  const useFilterActionProps = () => {
    const field = useField<any>();
    const { run } = organizationRequest;

    return {
      options: filterOptions,
      onSubmit: async (values) => {
        run(values);

        field.setValue(values);
      },
      onReset: (values) => {
        field.setValue(values);
      },
    };
  };

  const handelAddNew = () => {
    FormDrawer(t('Add organization'), () => {
      return (
        <FormLayout layout={'vertical'}>
          <SchemaComponentOptions scope={{ createOnly: true, t }}>
            <SchemaField schema={schema} />
          </SchemaComponentOptions>
          <FormDrawer.Footer>
            <FormButtonGroup align="right">
              <Reset>{t('Cancel')}</Reset>
              <Submit
                onSubmit={async (data) => {
                  await api.request({
                    url: 'organization:create',
                    method: 'post',
                    data: {
                      ...data,
                    },
                  });
                  organizationRequest.refresh();
                }}
              >
                {t('Submit')}
              </Submit>
            </FormButtonGroup>
          </FormDrawer.Footer>
        </FormLayout>
      );
    })
      .open({
        initialValues: {},
      })
      .then(console.log)
      .catch(console.log);
  };
  return (
    <div>
      <Card>
        <div style={{ float: 'left' }}>
          <SchemaComponent
            schema={{
              name: 'filter',
              type: 'object',
              title: '{{ t("Filter") }}',
              default: {
                $and: [{ name: { $includes: '' } }],
              },
              'x-component': 'Filter.Action',

              enum: filterOptions,
              'x-use-component-props': useFilterActionProps,
            }}
            scope={{ t }}
          />
        </div>
        <Flex justify="end" style={{ marginBottom: 16 }}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handelRefresh}>
              {t('Refresh')}
            </Button>

            <Button icon={<DeleteOutlined />} onClick={handelBulkDelete}>
              {t('Delete')}
            </Button>
            <Button type='primary'  icon={<DeleteOutlined />} onClick={handelAddNew}>
              {t('Add new')}
            </Button>
          </Space>
        </Flex>
        <OrganizationList request={organizationRequest} setSelectRowKeys={setSelectRowKeys} />
      </Card>
    </div>
  );
}
