/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { observer } from '@formily/react';
import {
  useIsAdminPage,
  useRequest,
  useCurrentUserSettingsMenu,
  DropdownVisibleContext,
  SelectWithTitle,
  useSystemSettings,
  useAPIClient,
} from '@nocobase/client';
import React, { createContext, useMemo, useContext, useState } from 'react';
import { MenuProps } from 'antd';
import { useT } from './locale';

const OrganizationContext = createContext<any>({});

const InternalProvider = (props) => {
  const organizationRequest = useRequest<any>({
    url: 'organization:list?paginate=false',
  });

  return (
    <OrganizationContext.Provider value={{ organizationRequest }}>
      <UserCenterOrganizationProvider>{props.children}</UserCenterOrganizationProvider>
    </OrganizationContext.Provider>
  );
};

const useCurrentOrganization = () => {
  const { organizationRequest } = useContext(OrganizationContext);
  const { data } = organizationRequest || {};
  return data?.data?.map((v) => {
    return {
      title: v.title,
      code: v.code,
      organizationUser: v.organizationUser,
    };
  });
};

export const useSwitchOrganization = (currentOrganization) => {
  const ctx = useContext(DropdownVisibleContext);
  const [visible, setVisible] = useState(false);
  const t = useT();
  const api = useAPIClient();
  const organizations = useCurrentOrganization();
  const result = useMemo<MenuProps['items'][0]>(() => {
    return {
      key: 'organization',
      eventKey: 'switchOrganization',
      onClick: () => {
        setVisible(true);
        ctx?.setVisible(false);
      },
      label: (
        <SelectWithTitle
          title={t('Switch organization')}
          fieldNames={{
            label: 'title',
            value: 'code',
          }}
          options={organizations}
          defaultValue={currentOrganization?.code}
          onChange={async (organizationName) => {
            await api.resource('users').setDefaultOrganization({ values: { organizationName } });
          }}
        />
      ),
    };
  }, [visible, organizations]);

  return result;
};

const OrganizationProvider = observer(
  (props) => {
    const isAdminPage = useIsAdminPage();

    if (!isAdminPage) {
      return <>{props.children}</>;
    }

    return <InternalProvider {...props} />;
  },
  {
    displayName: 'OrganizationProvider',
  },
);

const CurrentOrganizationContext = createContext({});

const UserCenterOrganizationProvider = (props) => {
  const organizations = useCurrentOrganization();
  const { data } = useSystemSettings() || {};
  const currentOrganization = organizations?.find?.((v) => v.organizationUser === data?.data?.id);
  const { addMenuItem } = useCurrentUserSettingsMenu();
  const organizationItem = useSwitchOrganization(currentOrganization);
  addMenuItem(organizationItem, { after: 'divider_1' });
  return (
    <CurrentOrganizationContext.Provider value={currentOrganization}>
      {props.children}
    </CurrentOrganizationContext.Provider>
  );
};

export { OrganizationContext, OrganizationProvider, CurrentOrganizationContext };
