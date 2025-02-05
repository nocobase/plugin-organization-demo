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
  useApp,
} from '@nocobase/client';
import React, { createContext, useMemo, useContext, useState, useEffect } from 'react';
import { MenuProps } from 'antd';
import { useT } from './locale';

const OrganizationContext = createContext<any>({});

const InternalProvider = (props) => {
  const organizationRequest = useRequest<any>({
    url: 'organization:list?paginate=false&appends[]=users',
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
      users: v.users,
    };
  });
};

export const useSwitchOrganization = (currentOrganization) => {
  const ctx = useContext(DropdownVisibleContext);
  const [visible, setVisible] = useState(false);
  const { organizationRequest } = useContext(OrganizationContext);
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
            location.reload();
            window.location.reload();
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

export const UserCenterOrganizationProvider = (props) => {
  const app = useApp();
  const organizations = useCurrentOrganization();
  const { data } = useSystemSettings() || {};
  const currentOrganization = organizations?.find?.((v) => v.users.find((k) => k.id === data?.data?.id));
  const { addMenuItem } = useCurrentUserSettingsMenu();
  const organizationItem = useSwitchOrganization(currentOrganization);
  addMenuItem(organizationItem, { after: 'divider_1' });
  useEffect(() => {
    if (currentOrganization) {
      app.setGlobalVarCtx('$organization', currentOrganization);
    }
  }, [currentOrganization, data?.data?.id]);
  return (
    <CurrentOrganizationContext.Provider value={currentOrganization}>
      {props.children}
    </CurrentOrganizationContext.Provider>
  );
};

export { OrganizationContext, OrganizationProvider, CurrentOrganizationContext, useCurrentOrganization };
