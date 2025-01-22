/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'organization',
  autoGenId: false,
  migrationRules: ['skip'],
  fields: [
    {
      type: 'string',
      name: 'title',
    },
    {
      type: 'text',
      name: 'code',
      primaryKey: true,
    },
    // {
    //   type: 'hasMany',
    //   name: 'resources',
    //   target: 'dataSourcesRolesResources',
    //   sourceKey: 'name',
    //   foreignKey: 'organizationName',
    // },
    {
      type: 'belongsToMany',
      name: 'users',
      target: 'users',
      foreignKey: 'organizationName',
      otherKey: 'userId',
      onDelete: 'CASCADE',
      sourceKey: 'code',
      targetKey: 'id',
      through: 'organizationUsers',
    },
  ],
});
