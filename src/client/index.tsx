import { Plugin } from '@nocobase/client';
import { OrganizationPage } from './OrganizationPage';
import { OrganizationProvider } from './OrganizationProvider';
import { useGetCurrentOrganization } from './hook';

export class PluginOrganizationClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.pluginSettingsManager.add('organization', {
      title: this.t('Organization manager'),
      icon: 'TableOutlined',
      Component: OrganizationPage,
    });
    this.app.addGlobalVar('$organization', useGetCurrentOrganization);
    this.app.use(OrganizationProvider);

  }
}

export default PluginOrganizationClient;
