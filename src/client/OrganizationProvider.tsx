/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { observer } from '@formily/react';
import { useIsAdminPage, useRequest } from '@nocobase/client';
import React, { createContext } from 'react';

const OrganizationContext = createContext<any>({});

const InternalProvider = (props) => {
  const organizationRequest = useRequest<any>({
    url: 'organization?paginate=false',
  });
  return <OrganizationContext.Provider value={{ organizationRequest }}>{props.children}</OrganizationContext.Provider>;
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

export { OrganizationContext, OrganizationProvider };
