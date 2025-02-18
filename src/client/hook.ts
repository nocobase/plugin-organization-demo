import { useContext } from 'react';
import { CurrentOrganizationContext, OrganizationContext, useCurrentOrganization } from './OrganizationProvider';
import { useT } from './locale';

export const useGetCurrentOrganization = () => {
  const t = useT();
  return {
    name: '$organization',
    title: t('Current organization'),
    value: '$organization',
    label: t('Current organization'),
    children: [
      {
        label: t('Title'),
        value: 'title',
        title: t('Title'),
        name: 'title',
      },
      {
        label: t('Code'),
        value: 'code',
        title: t('Code'),
        name: 'code',
      },
    ],
  };
};
