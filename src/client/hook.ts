import { useContext } from 'react';
import { CurrentOrganizationContext } from './OrganizationProvider';
import { useT } from './locale';

export const useGetCurrentOrganization = () => {
  const t = useT();
  const { currentOrganization }: any = useContext(CurrentOrganizationContext);
  console.log(currentOrganization);
  if (currentOrganization) {
    return {
      name: '$organization',
      title: '{{t("Current organization")}}',
      value: '$organization',
      label: '{{t("Current organization")}}',
      children: [
        {
          label: t('Title'),
          value: 'title',
        },
        {
          label: t('Code'),
          value: 'code',
        },
      ],
    };
  }

  return null;
};
