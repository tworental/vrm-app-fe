/* eslint-disable no-param-reassign, prefer-promise-reject-errors */
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import ActionConfirmComponent from './components/action-confirm';
import DeleteConfirmComponent from './components/delete-confirm';
import WarningComponent from './components/warning';

export default {
  install(app) {
    UIkit.use(Icons);

    UIkit.component('actionConfirm', ActionConfirmComponent);
    UIkit.component('deleteConfirm', DeleteConfirmComponent);
    UIkit.component('warningModal', WarningComponent);

    UIkit.dropdowns = {
      closeAll() {
        document.querySelectorAll('[uk-dropdown]')
          .forEach((element) => UIkit.dropdown(element).hide(false));
      },
    };

    UIkit.modals = {
      prompt(label, value) {
        return new Promise((resolve, reject) => {
          UIkit.modal.prompt(label, value).then((results) => {
            if (results) resolve(results);
            else reject();
          });
        });
      },

      confirm(message, options = {}) {
        return new Promise((resolve, reject) => {
          UIkit.modal.confirm(message, options).then(
            () => resolve(),
            (err) => reject(err),
          );
        });
      },

      deleteConfirm(message, options = {}) {
        return new Promise((resolve, reject) => {
          UIkit.modal.deleteConfirm(message, options).then(
            (dialog) => resolve(dialog),
            (err) => reject(err),
          );
        });
      },

      actionConfirm(message, options = {}) {
        return new Promise((resolve, reject) => {
          UIkit.modal.actionConfirm(message, options).then(
            (dialog) => resolve(dialog),
            (err) => reject(err),
          );
        });
      },

      warning(message, options = {}) {
        return new Promise((resolve, reject) => {
          UIkit.modal.warningModal(message, options).then(
            (dialog) => resolve(dialog),
            (err) => reject(err),
          );
        });
      },

      show(el, options = {}) {
        UIkit.modal(el, options).show();
      },

      hide(el, options = {}) {
        UIkit.modal(el, options).hide();
      },

      toggle(el, display) {
        if (display) {
          UIkit.modal(el).show();
        } else {
          UIkit.modal(el).hide();
        }
      },

      hideAll() {
        document.querySelectorAll('[uk-modal]')
          .forEach((element) => UIkit.modals.hide(element));
      },
    };

    UIkit.drawer = {
      show(el) {
        UIkit.offcanvas(el).show();
      },

      hide(el = '#drawer') {
        UIkit.offcanvas(el).hide();
      },

      toggle(el, display) {
        if (display) {
          UIkit.offcanvas(el).show();
        } else {
          UIkit.offcanvas(el).hide();
        }
      },

      hideAll() {
        document.querySelectorAll('[uk-offcanvas]')
          .forEach((element) => UIkit.drawer.hide(element));
      },
    };

    UIkit.accordions = {
      isOpen(el, index) {
        return UIkit.accordion(el).items[index]?.classList.contains('uk-open');
      },

      toggle(el, index, animate = true) {
        const accordion = UIkit.accordion(el);

        if (accordion.items[index]) {
          accordion.toggle(index, animate);
        }
      },
    };

    UIkit.notify = (status, text, opt = {}) => {
      UIkit.notification.closeAll(undefined, true);
      UIkit.notification(text, {
        status,
        pos: 'top-center',
        ...opt,
      });
    };

    UIkit.errorHandler = (err) => new Promise((resolve, reject) => {
      if (err) {
        const response = { status: err.status, message: err.message };

        switch (err.status) {
          case 400:
          case 422:
            return reject(response);
          case 401:
            return reject({ ...response, message: 'Unauuthorized' });
          case 402:
            return reject({ ...response, message: 'Payment Required' });
          case 403:
            return reject({ ...response, message: 'Forbidden' });
          case 404:
            return reject({ ...response, message: 'Not Found' });
          default:
            return reject({ ...response, message: 'Something went wrong. Try again latter.' });
        }
      }
      return resolve();
    });

    UIkit.util.on(document, 'beforeshow', ({ detail: [item] }) => {
      switch (item.$options.name) {
        // HACK: UIKit hack for off-canvas memory leack
        case 'offcanvas':
          item.$shown = item.$shown ? item.$shown + 1 : 1;

          if (item.$shown > 1) {
            item.$shown = 1;
            item.hide();
          }
          break;

        // HACK: UIKit hack for vertical center modals
        case 'modal':
          item.$el.classList.add('uk-flex-top', 'uk-flex');
          item.$el.querySelector('.uk-modal-dialog').classList.add('uk-margin-auto-vertical');
          break;

        default:
      }
    });

    UIkit.util.on(document, 'beforehide', ({ detail: [item] }) => {
      if (item.$options.name === 'offcanvas') {
        item.$shown = null;
      }
    });

    app.provide('UIKit', UIkit);
  },
};
