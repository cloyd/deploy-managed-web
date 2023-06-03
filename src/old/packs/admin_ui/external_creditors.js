import { TaggingApp } from 'admin_ui/external_creditors';

const onDOMContentLoaded = ((commands) => {
  const actions = {
    tagging({ controls, targets }) {
      const app = new TaggingApp({ controls, targets });
      app.listen();
    },
    sendTags({ formId, taggedListId }) {
      const formEl = document.getElementById(formId);
      const taggedListEl = document.getElementById(taggedListId);

      formEl.addEventListener('submit', () => {
        for (let option of taggedListEl.options) {
          option.selected = true;
        }
      });
    },
  };

  return (eventData) => {
    for (let command of commands) {
      actions[command.action](command.params);
    }
  };
})(window.AdminUi.commandQueue);

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);
