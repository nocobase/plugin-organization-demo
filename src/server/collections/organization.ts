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
      type: 'string',
      name: 'code',
      primaryKey: true,
    },
    {
      type: 'hasMany',
      name: 'users',
      target: 'users',
      foreignKey: 'organizationUser',
      onDelete: 'CASCADE',
      targetKey: 'id',
      sourceKey:'code'
    },
  ],
});
