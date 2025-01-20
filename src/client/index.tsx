import { Plugin } from '@nocobase/client';
import { OrganizationPage } from './OrganizationPage';
import { OrganizationProvider } from './OrganizationProvider';

export class PluginOrganizationClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    console.log(this.app);
    this.app.pluginSettingsManager.add('organization', {
      title: this.t('Organization manager'),
      icon: 'TableOutlined',
      Component: OrganizationPage,
    });
    // this.app.addGlobalVar('$env', useGetEnvironmentVariables);
    this.app.use(OrganizationProvider);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
  }
}

export default PluginOrganizationClient;
