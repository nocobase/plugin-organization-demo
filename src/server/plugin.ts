import { Plugin } from '@nocobase/server';

export class PluginOrganizationServer extends Plugin {
  async afterAdd() {}
  registerACL() {
    this.app.acl.allow('organization', 'list', 'loggedIn');
    this.app.acl.registerSnippet({
      name: `pm.${this.name}`,
      actions: ['organization:*', 'app:refresh'],
    });
  }

  async beforeLoad() {}

  async load() {}

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginOrganizationServer;
