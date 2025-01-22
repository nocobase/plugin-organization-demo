/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Context, Next } from '@nocobase/actions';

export async function setDefaultOrganization(ctx: Context, next: Next) {
  const {
    values: { organizationName },
  } = ctx.action.params;

  const {
    db,
    state: { currentUser },
    action: {
      params: { values },
    },
  } = ctx;

  if (values.organizationName == 'anonymous') {
    return next();
  }

  const repository = db.getRepository('organizationUsers');

  await db.sequelize.transaction(async (transaction) => {
    await repository.update({
      filter: {
        userId: currentUser.id,
      },
      values: {
        default: false,
      },
      transaction,
    });
    await repository.update({
      filter: {
        userId: currentUser.id,
      },
      values: {
        default: organizationName,
      },
      transaction,
    });
  });

  ctx.body = 'ok';

  await next();
}
