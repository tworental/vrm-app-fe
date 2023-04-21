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
      const btns = dialog.$el.querySelectorAll('button');
      btns.forEach((btn) => { btn.disabled = true; });
      dialog.$el.classList.add('--loading');
      deferred.resolve(dialog);
      resolved = true;
    });

    on(dialog.$el, 'hide', () => !resolved && hideFn(deferred));

    deferred.promise.dialog = dialog;

    return deferred.promise;
  }

  modal.deleteConfirm = (message) => openDialog(
    () => (
      `<form class="delete-modal">
          <div class="uk-modal-body">
            <div class="delete-modal__heading">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" class="--no-stroke">
                  <g clip-path="url(#clip0)">
                    <path d="M34.554 37.0946C34.4892 37.0946 34.4229 37.0915 34.3582 37.0823H3.62966C3.56645 37.09 3.50324 37.0931 3.44003 37.0931C2.62603 37.0931 1.93999 36.5119 1.81049 35.7102C1.7442 35.3017 1.83207 34.8869 2.0587 34.5416L17.6157 3.43078C18.0643 2.53198 18.7287 2.4364 18.9939 2.4364C19.3238 2.4364 19.9405 2.5659 20.3722 3.43078L35.9291 34.5432C36.4086 35.2724 36.2251 36.2729 35.5144 36.7847C35.2323 36.9867 34.9008 37.0946 34.554 37.0946ZM3.41537 35.2785C3.39687 35.314 3.37682 35.3494 3.35216 35.3818C3.33366 35.408 3.32749 35.4342 3.33212 35.462C3.34137 35.5175 3.3907 35.5514 3.43387 35.5514C3.49399 35.5422 3.53562 35.5391 3.57724 35.5391H34.4106C34.4522 35.5391 34.4938 35.5422 34.5354 35.5499C34.5401 35.5499 34.5432 35.5499 34.5478 35.5499C34.5786 35.5499 34.5956 35.5437 34.6125 35.5314C34.6603 35.4974 34.6711 35.4312 34.6372 35.3834C34.6141 35.3525 34.5925 35.3171 34.574 35.2801L18.9939 4.1199L3.41537 35.2785Z" fill="#FB4B56"/>
                    <path d="M18.994 27.0675C18.5685 27.0675 18.2231 26.7221 18.2231 26.2966V15.505C18.2231 15.0795 18.5685 14.7341 18.994 14.7341C19.4195 14.7341 19.7648 15.0795 19.7648 15.505V26.2966C19.7648 26.7221 19.4195 27.0675 18.994 27.0675Z" fill="#FB4B56"/>
                    <path d="M19.0154 30.922C18.3802 30.9204 17.8638 30.4302 17.8391 29.8043C17.8329 29.4851 17.9455 29.1907 18.1582 28.9671C18.371 28.7436 18.6577 28.6156 18.966 28.611C19.6197 28.6234 20.1269 29.1151 20.15 29.7303C20.1562 30.0494 20.0437 30.3439 19.8309 30.5674C19.6182 30.7909 19.3314 30.9174 19.0231 30.9235C19.0215 30.922 19.0185 30.922 19.0154 30.922Z" fill="#FB4B56"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="37" height="37" fill="white" transform="translate(0.5 0.120605)"/>
                    </clipPath>
                  </defs>
                </svg>

                <div class="delete-modal__title">${i18n.global.t('core.shared.deleteConfirm.title')}</div>
            </div>
          </div>
          <div class="uk-modal-footer delete-modal__footer">
              <div class="delete-modal__text">
                ${isString(message) ? message : html(message)}
              </div>
              <div class="uk-text-right">
                <button class="uk-button uk-button-link uk-margin-right uk-modal-close" type="button">${i18n.global.t('core.shared.deleteConfirm.cancel')}</button>
                <button class="uk-button delete-modal__submit" type="submit">
                  <div class="loader" uk-spinner="ratio: 0.5"></div>
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" class="--no-stroke">
                    <g clip-path="url(#clip0)">
                    <path d="M4.30723 12.1274C3.66573 12.1274 3.13123 11.6464 3.06423 11.0079L2.18223 2.62744H1.15723C1.01923 2.62744 0.907227 2.51544 0.907227 2.37744C0.907227 2.23944 1.01923 2.12744 1.15723 2.12744H4.40723V0.877441C4.40723 0.463941 4.74373 0.127441 5.15723 0.127441H8.65723C9.07073 0.127441 9.40723 0.463941 9.40723 0.877441V2.12744H12.6572C12.7952 2.12744 12.9072 2.23944 12.9072 2.37744C12.9072 2.51544 12.7952 2.62744 12.6572 2.62744H11.6322L10.7497 11.0079C10.6827 11.6459 10.1487 12.1274 9.50723 12.1274H4.30723ZM3.56123 10.9559C3.60173 11.3389 3.92223 11.6274 4.30723 11.6274H9.50723C9.89173 11.6274 10.2122 11.3384 10.2527 10.9559L11.1297 2.62744H2.68473L3.56123 10.9559ZM8.90723 2.12744V0.877441C8.90723 0.739441 8.79523 0.627441 8.65723 0.627441H5.15723C5.01923 0.627441 4.90723 0.739441 4.90723 0.877441V2.12744H8.90723Z" fill="#FB4B56"/>
                    <path d="M6.90723 10.1274C6.76923 10.1274 6.65723 10.0154 6.65723 9.87744V4.62744C6.65723 4.48944 6.76923 4.37744 6.90723 4.37744C7.04523 4.37744 7.15723 4.48944 7.15723 4.62744V9.87744C7.15723 10.0154 7.04523 10.1274 6.90723 10.1274Z" fill="#FB4B56"/>
                    <path d="M8.8937 10.1269C8.7572 10.1204 8.6507 10.0029 8.6572 9.86544L8.9072 4.61544C8.9137 4.48194 9.0257 4.37744 9.1622 4.37744C9.2357 4.38094 9.2972 4.40994 9.3422 4.45894C9.3872 4.50794 9.4102 4.57244 9.4072 4.63944L9.1572 9.88944C9.1507 10.0229 9.0412 10.1274 8.9072 10.1274C8.9047 10.1274 8.8962 10.1274 8.8937 10.1269Z" fill="#FB4B56"/>
                    <path d="M4.90724 10.1274C4.77374 10.1274 4.66424 10.0229 4.65774 9.88944L4.40724 4.63944C4.40124 4.50144 4.50774 4.38444 4.64524 4.37744H4.64574C4.79024 4.37744 4.90024 4.48194 4.90724 4.61544L5.15724 9.86544C5.16374 10.0034 5.05674 10.1204 4.91924 10.1269C4.91724 10.1274 4.90924 10.1274 4.90724 10.1274Z" fill="#FB4B56"/>
                    </g>
                    <defs>
                    <clipPath id="clip0">
                    <rect width="12" height="12" fill="white" transform="translate(0.907227 0.127441)"/>
                    </clipPath>
                    </defs>
                  </svg>
                  <span>${i18n.global.t('core.shared.deleteConfirm.delete')}</span>
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
