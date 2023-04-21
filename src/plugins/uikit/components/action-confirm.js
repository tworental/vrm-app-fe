/* eslint-disable no-param-reassign */
import {
  addClass, assign, css, Deferred, hasClass, height, html, isString, on, removeClass,
} from 'uikit/src/js/util';

import i18n from '@/plugins/i18n';

function install({ modal }) {
  function openDialog(tmpl, options, hideFn) {
    const opts = assign({ bgClose: false, escClose: true, labels: modal.labels }, options);

    const dialog = modal.dialog(tmpl(opts), opts);
    const deferred = new Deferred();

    let resolved = false;

    on(dialog.$el, 'submit', 'form', (e) => {
      e.preventDefault();
      deferred.resolve(dialog);
      resolved = true;
    });

    on(dialog.$el, 'hide', () => !resolved && hideFn(deferred));

    deferred.promise.dialog = dialog;

    return deferred.promise;
  }

  modal.actionConfirm = (message) => openDialog(
    () => (
      `<form class="action-modal">
          <div class="uk-modal-body">
            <div class="action-modal__heading">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" class="--no-stroke">
                  <g clip-path="url(#clip0)">
                    <path d="M34.554 37.0946C34.4892 37.0946 34.4229 37.0915 34.3582 37.0823H3.62966C3.56645 37.09 3.50324 37.0931 3.44003 37.0931C2.62603 37.0931 1.93999 36.5119 1.81049 35.7102C1.7442 35.3017 1.83207 34.8869 2.0587 34.5416L17.6157 3.43078C18.0643 2.53198 18.7287 2.4364 18.9939 2.4364C19.3238 2.4364 19.9405 2.5659 20.3722 3.43078L35.9291 34.5432C36.4086 35.2724 36.2251 36.2729 35.5144 36.7847C35.2323 36.9867 34.9008 37.0946 34.554 37.0946ZM3.41537 35.2785C3.39687 35.314 3.37682 35.3494 3.35216 35.3818C3.33366 35.408 3.32749 35.4342 3.33212 35.462C3.34137 35.5175 3.3907 35.5514 3.43387 35.5514C3.49399 35.5422 3.53562 35.5391 3.57724 35.5391H34.4106C34.4522 35.5391 34.4938 35.5422 34.5354 35.5499C34.5401 35.5499 34.5432 35.5499 34.5478 35.5499C34.5786 35.5499 34.5956 35.5437 34.6125 35.5314C34.6603 35.4974 34.6711 35.4312 34.6372 35.3834C34.6141 35.3525 34.5925 35.3171 34.574 35.2801L18.9939 4.1199L3.41537 35.2785Z" fill="#5A80F9"/>
                    <path d="M18.994 27.0675C18.5685 27.0675 18.2231 26.7221 18.2231 26.2966V15.505C18.2231 15.0795 18.5685 14.7341 18.994 14.7341C19.4195 14.7341 19.7648 15.0795 19.7648 15.505V26.2966C19.7648 26.7221 19.4195 27.0675 18.994 27.0675Z" fill="#5A80F9"/>
                    <path d="M19.0154 30.922C18.3802 30.9204 17.8638 30.4302 17.8391 29.8043C17.8329 29.4851 17.9455 29.1907 18.1582 28.9671C18.371 28.7436 18.6577 28.6156 18.966 28.611C19.6197 28.6234 20.1269 29.1151 20.15 29.7303C20.1562 30.0494 20.0437 30.3439 19.8309 30.5674C19.6182 30.7909 19.3314 30.9174 19.0231 30.9235C19.0215 30.922 19.0185 30.922 19.0154 30.922Z" fill="#5A80F9"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="37" height="37" fill="white" transform="translate(0.5 0.120605)"/>
                    </clipPath>
                  </defs>
                </svg>

                <div class="action-modal__title">${i18n.global.t('core.shared.actionConfirm.title')}</div>
            </div>
          </div>
          <div class="uk-modal-footer action-modal__footer">
              <div class="action-modal__text">
                ${isString(message) ? message : html(message)}
              </div>
              <div class="uk-text-right">
                <button class="uk-button uk-button-link uk-margin-right uk-modal-close" type="button">${i18n.global.t('core.shared.actionConfirm.cancel')}</button>
                <button class="uk-button action-modal__submit">
                  <span>${i18n.global.t('core.shared.actionConfirm.yes')}</span>
                </button>
              </div>
          </div>
       </form>`
    ),
    { stack: true },
    (deferred) => deferred.reject(),
  );
}

export default {
  install,
  mixins: [],
  data: {
    clsPage: 'uk-modal-page',
    selPanel: '.uk-modal-dialog',
    selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full',
  },
  events: [
    {
      name: 'show',
      self: true,
      handler() {
        if (hasClass(this.panel, 'uk-margin-auto-vertical')) {
          addClass(this.$el, 'uk-flex');
        } else {
          css(this.$el, 'display', 'block');
        }

        height(this.$el); // force reflow
      },
    },
    {
      name: 'hidden',
      self: true,
      handler() {
        css(this.$el, 'display', '');
        removeClass(this.$el, 'uk-flex');
      },
    },
  ],
};
