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
import { registerValidateRules } from '@formily/core';
import { createSchemaField, useField } from '@formily/react';
import { SchemaComponent, SchemaComponentOptions, useAPIClient } from '@nocobase/client';
import { Alert, App, Button, Card, Dropdown, Flex, Space, Table, Tag } from 'antd';
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
    name: {
      type: 'string',
      title: `{{ t("Name") }}`,
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

  const typEnum = {
    default: {
      label: t('Plain text'),
      color: 'green',
    },
    secret: {
      label: t('Encrypted'),
      color: 'red',
    },
  };

  const resource = api.resource('organization');

  const handleDelete = (data) => {
    modal.confirm({
      title: t('Delete variable'),
      content: t('Are you sure you want to delete it?'),
      async onOk() {
        await resource.destroy({
          filterByTk: data.name,
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
                    url: `organization:update?filterByTk=${initialValues.name}`,
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
        rowKey={'name'}
        dataSource={data?.data}
        pagination={false}
        columns={[
          {
            title: t('Name'),
            dataIndex: 'name',
            ellipsis: true,
          },
          {
            title: t('Type'),
            dataIndex: 'type',
            render: (value) => <Tag color={typEnum[value].color}>{typEnum[value].label}</Tag>,
          },
          {
            title: t('Value'),
            ellipsis: true,
            render: (record) => <div>{record.type === 'default' ? record.value : '******'}</div>,
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
      name: 'name',
      title: t('Name'),
      operators: [
        { label: '{{t("contains")}}', value: '$includes', selected: true },
        { label: '{{t("does not contain")}}', value: '$notIncludes' },
        { label: '{{t("is")}}', value: '$eq' },
        { label: '{{t("is not")}}', value: '$ne' },
      ],
      schema: {
        type: 'string',
        title: t('Name'),
        'x-component': 'Input',
      },
    },
    {
      name: 'type',
      title: t('Type'),
      operators: [
        {
          label: '{{t("is")}}',
          value: '$match',
          selected: true,
          schema: {
            'x-component': 'Select',
            'x-component-props': { mode: 'tags' },
          },
        },
        {
          label: '{{t("is not")}}',
          value: '$notMatch',
          schema: {
            'x-component': 'Select',
            'x-component-props': { mode: 'tags' },
          },
        },
      ],
      schema: {
        type: 'string',
        title: t('Type'),
        'x-component': 'Select',
        enum: [
          {
            value: 'default',
            label: '{{t("Plain text")}}',
          },
          {
            value: 'secret',
            label: '{{t("Encrypted")}}',
          },
        ],
      },
    },
    {
      name: 'value',
      title: t('Value'),
      operators: [
        { label: '{{t("contains")}}', value: '$includes', selected: true },
        { label: '{{t("does not contain")}}', value: '$notIncludes' },
        { label: '{{t("is")}}', value: '$eq' },
        { label: '{{t("is not")}}', value: '$ne' },
      ],
      schema: {
        type: 'string',
        title: t('Value'),
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
            <Button icon={<DeleteOutlined />} onClick={handelAddNew}>
              {t('Add new')}
            </Button>
          </Space>
        </Flex>
        <OrganizationList request={organizationRequest} setSelectRowKeys={setSelectRowKeys} />
      </Card>
    </div>
  );
}
