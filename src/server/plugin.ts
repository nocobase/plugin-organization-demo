import { Plugin } from '@nocobase/server';
import { setDefaultOrganization } from './actions/setDefaultOrganization';

export class PluginOrganizationServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {
    this.registerACL();
  }

  async getCurrentOrganization(ctx) {
    console.log(88888,ctx)
    const {
      state: { currentUser },
    } = ctx;
    console.log(66666,currentUser)
    const currentOrg =
      (
        await this.db.getRepository('organization').findOne({
          filterByTk: currentUser?.organizationUser,
        })
      )?.toJSON() || {};
    return currentOrg;
  }
  async load() {
    this.app.db.registerGlobalVariables({ $organization: ()=>this.getCurrentOrganization(this) });
  }

  registerACL() {
    this.app.acl.allow('organization', 'list', 'loggedIn');
    this.app.acl.allow('organizationUsers', 'get', 'loggedIn');
    this.app.acl.allow('users', 'setDefaultOrganization', 'loggedIn');
    this.app.resourcer.registerActionHandler(`users:setDefaultOrganization`, setDefaultOrganization);
    this.app.acl.registerSnippet({
      name: `pm.${this.name}`,
      actions: ['organization:*', 'app:refresh'],
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginOrganizationServer;
