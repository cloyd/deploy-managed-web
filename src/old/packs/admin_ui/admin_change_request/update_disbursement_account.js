import {
  BankAccountApp,
  BankAccountDetailsRenderer,
  ChangeRequestApp,
} from 'admin_ui/admin_change_request/update_disbursement_account';

const onDOMContentLoaded = ((commands) => {
  const actions = {
    createChangeRequest({ assembly, userRequest, backendApi }) {
      const app = new ChangeRequestApp({ assembly, userRequest, backendApi });
      app.listen();
    },
    displayBankAccountDetails({ parts, bankAccountDictionary, template }) {
      const renderer = new BankAccountDetailsRenderer(
        bankAccountDictionary,
        template
      );

      for (let partSpec of parts) {
        const app = new BankAccountApp({ renderer, ...partSpec });
        app.render();
        app.listen();
      }
    },
  };

  return (eventData) => {
    for (let command of commands) {
      actions[command.action](command.params);
    }
  };
})(window.AdminUi.commandQueue);

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
