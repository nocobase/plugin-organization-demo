import { Plugin } from '@nocobase/server';
import { setDefaultOrganization } from './actions/setDefaultOrganization';

export class PluginOrganizationServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {
    this.app.acl.registerSnippet({
      name: `pm.${this.name}`,
      actions: ['organization:*', 'app:refresh'],
    });
    this.app.resourcer.registerActionHandler(`users:setDefaultOrganization`, setDefaultOrganization);
    this.app.acl.allow('users', 'setDefaultOrganization', 'loggedIn');
  }

  async load() {}

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginOrganizationServer;
