import { Plugin } from '@nocobase/server';
import { setDefaultOrganization } from './actions/setDefaultOrganization';

export class PluginOrganizationServer extends Plugin {
  async afterAdd() {}
  registerACL() {
    this.app.acl.allow('organization', 'list', 'loggedIn');
    this.app.acl.registerSnippet({
      name: `pm.${this.name}`,
      actions: ['organization:*', 'app:refresh'],
    });

   
  }

  async beforeLoad() {
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
