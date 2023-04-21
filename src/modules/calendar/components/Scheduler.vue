<template>
  <div ref="schedulerRef" class="dhx_cal_container">
    <div class="dhx_cal_navline">
      <div class="dhx_cal_prev_button">&nbsp;</div>
      <div class="dhx_cal_next_button">&nbsp;</div>
      <div class="dhx_cal_today_button"></div>
      <div class="dhx_cal_date"></div>
    </div>
    <div class="dhx_cal_header"></div>
    <div class="dhx_cal_data"></div>
  </div>
  <core-drawer
    ref="drawerRef"
    :loading="formLoading"
    class="bookings-drawer"
  >
    <router-view @update="onUpdate" />
  </core-drawer>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import 'dhtmlx-scheduler';
import '../plugins';

import dayjs from '@/utils/dayjs';
import { getAverageValue } from '@/utils/number';
import {
  formatCurrency,
  formatDate,
  formatDateForInput,
  getLocalTimeByUTC,
} from '@/utils/intl';
import {
  ABILITIES,
  can,
  MODULES,
} from '@/utils/acl';
import useKit from '@/modules/core/composables/uikit';
import { getNights } from '@/modules/bookings/utils/date';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import services from '@/modules/bookings/services';
import { STATUSES } from '@/modules/rentals/services';
import { toCalendarData, toSectionsFormat } from '../utils/serializer';
import { areInTheSameDay, setTimeForDate } from '../utils/datetime';

export default {
  name: 'Scheduler',
  props: {
    rentals: {
      type: Array,
      required: true,
    },
    bookings: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  components: {
    CoreDrawer,
  },
  setup(props) {
    const uikit = useKit();
    const i18n = useI18n();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const schedulerRef = ref(null);
    const drawerRef = ref(null);

    const bookings = computed(() => store.state.calendar.bookings);
    const locale = computed(() => store.state.account.account.settings.locale);
    const defaultCurrency = computed(() => store.state.account.account?.settings.currency);
    const formLoading = computed(() => store.state.bookings.formLoading);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    const user = computed(() => store.state.account.user);
    const canUserEditBookings = computed(() => can(user.value, MODULES.BOOKINGS, [ABILITIES.WRITE]));

    const sections = toSectionsFormat(props.rentals);

    const { scheduler } = window;

    scheduler.eventListeners = [];

    watchEffect(() => {
      uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
    }, { flush: 'post' });

    onMounted(() => {
      scheduler.locale.labels.timeline_tab = 'Month';
      scheduler.locale.labels.section_custom = 'Section';
      scheduler.config.details_on_create = true;
      scheduler.config.details_on_dblclick = true;
      scheduler.config.show_loading = true;
      scheduler.config.timeline_swap_resize = true;

      scheduler.templates.quick_info_title = (start, end, event) => `${event.text.substr(0, 50)} / ${formatCurrency(event.amount, event.currency, event.locale)}`;
      scheduler.templates.quick_info_content = (start, end, event) => `<div class="booking-tooltip">
          <div class="booking-tooltip__details">${i18n.t('calendar.components.scheduler.tooltip.details')}</div>
          <div>
              <span>${i18n.t('calendar.components.scheduler.tooltip.guest')}</span>
              <strong>${event.guest}</strong>
          </div>
          <div>
              <span>${i18n.t('calendar.components.scheduler.tooltip.amount')}</span>
              <strong>${formatCurrency(event.amount, event.currency, event.locale)}</strong>
          </div>
          <div>
              <span>${i18n.t('calendar.components.scheduler.tooltip.checkGuest')}</span>
              <strong>${event.checkinAt ? formatDate(event.checkinAt, locale.value, timezone.value, dateFormat.value) : '-'} / ${event.checkoutAt ? formatDate(event.checkoutAt, locale.value, timezone.value, dateFormat.value) : '-'}</strong>
          </div>
        </div>
      `;

      scheduler.templates.quick_info_date = (start, end, event) => `${formatDate(event.start_date, locale.value, timezone.value, dateFormat.value)} - ${formatDate(event.end_date, locale.value, timezone.value, dateFormat.value)}`;

      scheduler.addEventListener('onTemplatesReady', () => {
        scheduler.xy.scale_height = 50;
      });

      scheduler.addEventListener('onEventCollision', () => {
        uikit.notify('danger', i18n.t('calendar.components.scheduler.collision'));

        return true;
      });

      const checkValidDate = (date) => date.valueOf() >= dayjs()
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .valueOf();

      const checkValidDateRange = (startDate, endDate) => {
        const now = dayjs()
          .set('hour', 0)
          .set('minute', 0)
          .set('second', 0)
          .set('millisecond', 0);

        return (now.isBefore(endDate) && now.isAfter(startDate)) || now.isBefore(startDate);
      };

      const isEditable = (eventId) => {
        if (!canUserEditBookings.value) {
          return false;
        }

        const eventObj = scheduler.getEvent(eventId);

        if (!eventObj) return false;

        return checkValidDateRange(eventObj.start_date, eventObj.end_date);
      };

      scheduler.addEventListener('onBeforeEventChanged', (event, e, isNew) => {
        const editable = isEditable(event.id);

        if (editable) {
          if (isNew) {
            // eslint-disable-next-line no-param-reassign
            event.start_date = scheduler.date.add(new Date(event.start_date), 5, 'hour');
          }

          return true;
        }

        return false;
      });

      scheduler.attachEvent('onDblClick', (id) => {
        scheduler.hideQuickInfo();

        const event = scheduler.getEvent(id);

        store.commit('calendar/SET_SELECTED_EVENT_ID', id);
        store.commit('calendar/RESET_CREATION_PARAMS');

        router.push({ name: 'calendar-overview', params: { id: event.bookingId } });
      });

      scheduler.attachEvent('onDragEnd', (id, mode) => {
        const ev = scheduler.getEvent(id);

        if (['resize', 'move'].includes(mode)) {
          if (ev.bookingId) {
            const section = scheduler.getSection(ev.unit_id);

            const startDate = formatDateForInput(ev.start_date);
            const endDate = formatDateForInput(ev.end_date);

            const originalBooking = bookings.value?.find((booking) => booking.id === ev.bookingId);

            if (
              !originalBooking
              || (areInTheSameDay(originalBooking.dateArrival, startDate)
              && areInTheSameDay(originalBooking.dateDeparture, endDate))
            ) {
              return false;
            }

            const params = {
              propertyId: section.propertyId,
              propertyUnitTypeId: section.propertyUnitTypeId,
              propertyUnitTypeUnitId: section.propertyUnitTypeUnitId,
              guests: ev.totalGuests,
              bookingId: ev.bookingId,
            };

            params.dateArrival = startDate;

            if (dayjs(startDate).isSame(dayjs(endDate))) {
              params.dateDeparture = formatDateForInput(dayjs(endDate).add(1, 'days').toDate());
            } else {
              params.dateDeparture = endDate;
            }

            store.dispatch('bookings/checkAvailability', { ...params })
              .then((data) => {
                if (data[0] && data[0].availability) {
                  const rates = data[0].availability.nightlyRates;
                  const avgPrice = Number(getAverageValue(Object.values(rates)).toFixed(2));
                  const amountAccommodationDue = avgPrice * getNights(params.dateDeparture, params.dateArrival);

                  ev.start_date = setTimeForDate(params.dateArrival, getLocalTimeByUTC(data[0].checkinTime));
                  ev.end_date = setTimeForDate(params.dateDeparture, getLocalTimeByUTC(data[0].checkoutTime));
                  scheduler.updateEvent(id);

                  return store.dispatch('bookings/update', {
                    id: ev.bookingId,
                    dateArrival: formatDateForInput(params.dateArrival, data[0].checkinTime),
                    dateDeparture: formatDateForInput(params.dateDeparture, data[0].checkoutTime),
                    amountAccommodationDue,
                    propertyId: section.propertyId,
                    propertyUnitTypeId: section.propertyUnitTypeId,
                    propertyUnitTypeUnitId: section.propertyUnitTypeUnitId,
                  })
                    .then(() => services.bookings.show(ev.bookingId))
                    .then(({ data: booking }) => {
                      store.commit('calendar/UPDATE_BOOKING', booking);
                      ev.amount = booking.amountTotal;
                      scheduler.updateEvent(id);
                    })
                    .then(() => uikit.notify('success', i18n.t('calendar.components.scheduler.updatedSuccess')));
                }

                ev.start_date = setTimeForDate(originalBooking.dateArrival, getLocalTimeByUTC(data[0].checkinTime));
                ev.end_date = setTimeForDate(originalBooking.dateDeparture, getLocalTimeByUTC(data[0].checkoutTime));
                scheduler.updateEvent(id);

                return uikit.notify('danger', i18n.t('calendar.components.scheduler.notAvailableRange'));
              })
              .catch((error) => {
                if (error.code === 'BOOKINGS_MIN_STAY') {
                  ev.start_date = dayjs(originalBooking.dateArrival).toDate();
                  ev.end_date = dayjs(originalBooking.dateDeparture).toDate();
                  scheduler.updateEvent(id);
                }
                uikit.notify('danger', i18n.t(`core.errors.codes.${error.code}`));
              });
          }
        }

        return true;
      });

      scheduler.addEventListener('onBeforeDrag', (eventId, mode, nativeEventObject) => {
        if (!canUserEditBookings.value) { return false; }

        if (eventId) {
          return isEditable(eventId);
        }

        const { date } = scheduler.getActionData(nativeEventObject);

        return checkValidDate(date);
      });

      scheduler.createTimelineView({
        section_autoheight: false,
        round_position: false,
        cell_template: true,
        name: 'timeline',
        x_unit: 'day',
        x_date: '%d<div>%D</div>',
        x_step: 1,
        x_size: 31,
        x_start: -5,
        dx: 250,
        y_unit: sections,
        y_property: 'unit_id',
        render: 'tree',
        folder_dy: 30,
        event_dy: 30,
        scrollable: true,
        column_width: 42,
      });

      scheduler.templates.event_bar_text = (start, end, event) => {
        if (event.bookingId) {
          return `
            <div class="bar-label">${event.text} ${event.amount ? `/ ${formatCurrency(event.amount, event.currency, event.locale)}` : ''}</div>
          `;
        }

        return i18n.t('calendar.components.scheduler.newBooking');
      };

      scheduler.templates.timeline_scale_label = (key, label, section) => {
        if (section.isUnit) {
          return `
            <div class="uk-flex uk-flex-between uk-margin-small-right">
              <span>${section.label}</span>
              <span class="unit-statuses ${section.status}">${i18n.t(`rentals.dicts.unitsStatuses.${section.status}`)}</span>
              <div uk-dropdown="mode: click" class="unit-status-dropdown dropdown uk-margin-remove-top" onclick="event.stopPropagation()">
                <ul class="uk-dropdown-nav uk-nav-default">
                  ${Object.values(STATUSES).map((status) => `<li class="uk-dropdown-close unit-statuses ${status}" data-section_id="${section.key}" data-status="${status}">${i18n.t(`rentals.dicts.unitsStatuses.${status}`)}</li>`).join('')}
                </ul>
              </div>
            </div>
          `;
        }

        return label;
      };

      scheduler.templates.timeline_cell_class = (evs, date) => {
        if (+date === +scheduler.date.date_part(new Date())) return 'dhx_column_now';

        return '';
      };

      scheduler.templates.timeline_scalex_class = (date) => {
        if (dayjs(date).isToday()) {
          return 'dhx_cell_now';
        }

        return '';
      };

      scheduler.templates.event_class = (start, end, event) => {
        const resizeClass = end < new Date() ? 'no_resize' : '';

        return [
          resizeClass,
          event.status,
          event.checkinAt && 'checked_in',
          event.checkoutAt && 'checked_out',
        ].filter(Boolean).join(' ');
      };

      scheduler.templates.timeline_cell_value = (evs, date, section) => {
        if (section.children) {
          const timeline = scheduler.getView();

          const events = timeline.selectEvents({
            section: section.key,
            date,
            selectNested: true,
          });

          return `<div>${events.length}</div>`;
        }
        return '';
      };

      scheduler.init(schedulerRef.value, dayjs().toDate(), 'timeline');

      scheduler.parse(
        toCalendarData(
          bookings.value,
          {
            locale: locale.value,
            currency: defaultCurrency.value,
            unknownGuest: i18n.t('bookings.shared.unknownGuest'),
          },
        ),
      );

      scheduler.addEventListener('onBeforeViewChange', (oldMode, oldDate, mode, date) => {
        if (!('getFullYear' in date) || (oldDate === date)) { return true; }

        store.commit('calendar/SET_RANGES', {
          startDate: dayjs(date)
            .tz(store.getters['core/timezone'])
            .startOf('month')
            .utc()
            .toDate()
            .toISOString(),
          endDate: dayjs()
            .tz(store.getters['core/timezone'])
            .startOf('month')
            .utc()
            .add(2, 'month')
            .endOf('month')
            .toISOString(),
        });

        store.dispatch('calendar/loadMoreBookings')
          .then((data) => scheduler.parse(
            toCalendarData(
              data,
              {
                locale: locale.value,
                currency: defaultCurrency.value,
                unknownGuest: i18n.t('bookings.shared.unknownGuest'),
              },
            ),
          ));

        scheduler.matrix.timeline.x_start = 0;
        return true;
      });

      scheduler.addEventListener('onBeforeLightbox', (id) => {
        const eventObj = scheduler.getEvent(id);

        if (eventObj.bookingId) {
          store.commit('calendar/SET_SELECTED_EVENT_ID', id);
          store.commit('calendar/RESET_CREATION_PARAMS');

          router.push({ name: 'calendar-overview', params: { id: eventObj.bookingId } });
        } else {
          const section = scheduler.getSection(eventObj.unit_id);

          const startDate = eventObj.start_date.toISOString();
          const endDate = eventObj.end_date.toISOString();

          const params = {
            propertyId: section.propertyId,
            propertyUnitTypeId: section.propertyUnitTypeId,
            propertyUnitTypeUnitId: section.propertyUnitTypeUnitId,
          };

          params.dateArrival = startDate;

          if (dayjs(startDate).isSame(dayjs(endDate))) {
            params.dateDeparture = dayjs(endDate).add(1, 'days').toDate().toISOString();
          } else {
            params.dateDeparture = endDate;
          }

          store.dispatch('bookings/checkAvailability', { ...params, guests: 2 })
            .then((data) => {
              if (data[0] && data[0].availability) {
                store.commit('calendar/SET_SELECTED_EVENT_ID', id);
                store.commit('calendar/SET_CREATION_PARAMS', params);

                router.push({ name: 'calendar-create' });
              } else {
                scheduler.deleteEvent(id);
                uikit.notify('danger', i18n.t('calendar.components.scheduler.notAvailableRange'));
              }
            })
            .catch((error) => {
              if (error.code === 'BOOKINGS_MIN_STAY') {
                scheduler.deleteEvent(id);
              }
              uikit.notify('danger', i18n.t(`core.errors.codes.${error.code}`));
            });
        }

        return false;
      });

      scheduler.addEventListener('onBeforeEventDelete', (id) => {
        const eventObj = scheduler.getEvent(id);

        if (eventObj?.bookingId) {
          store.commit('calendar/DELETE_BOOKING', eventObj.bookingId);
        }

        return true;
      });

      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        if (!route.meta.drawer) {
          return;
        }

        if (store.getters['calendar/isCreateMode'] && store.state.calendar.selectedSchedulerEventId) {
          scheduler.deleteEvent(store.state.calendar.selectedSchedulerEventId);
        }

        store.commit('calendar/RESET_CREATION_PARAMS');

        router.push({ name: 'calendar' });
      }, { self: true });

      uikit.util.on(drawerRef.value.$el, 'hidden', () => {
        store.commit('bookings/SET_ENTITY');
        store.commit('calendar/SET_SELECTED_EVENT_ID');
      }, { self: true });

      const onChangeStatus = (e) => {
        if (!e.target.dataset.section_id) { return; }

        const unitKey = e.target.dataset.section_id;
        const section = scheduler.getSection(unitKey);
        const newStatus = e.target.dataset.status;
        const statusLabel = e.target.parentNode.parentNode.parentNode.children[1];
        const oldStatus = section.status;

        if (newStatus === section.status) { return; }

        statusLabel.innerText = i18n.t(`rentals.dicts.unitsStatuses.${newStatus}`);
        statusLabel.classList.remove(oldStatus);
        statusLabel.classList.add(newStatus);
        section.status = newStatus;

        store.dispatch('rentals/units/updateUnit', {
          id: section.propertyUnitTypeUnitId,
          propertyId: section.propertyId,
          propertyUnitTypeId: section.propertyUnitTypeId,
          status: newStatus,
        })
          .then(() => uikit.notify('success', i18n.t('rentals.views.units.statusUpdatedSuccess')))
          .catch((error) => {
            statusLabel.innerText = i18n.t(`rentals.dicts.unitsStatuses.${oldStatus}`);
            statusLabel.classList.remove(newStatus);
            statusLabel.classList.add(oldStatus);
            section.status = oldStatus;
            uikit.notify('danger', error.message);
          });
      };

      document.querySelectorAll('.unit-status-dropdown').forEach((node) => node.addEventListener('click', onChangeStatus));
    });

    const onUpdate = (bookingId) => {
      if (store.state.calendar.selectedSchedulerEventId) {
        const events = scheduler.getEvents();
        const updatedEvent = events.find((event) => event.bookingId === bookingId);
        if (updatedEvent) {
          scheduler.deleteEvent(updatedEvent.id);
        }
        scheduler.deleteEvent(store.state.calendar.selectedSchedulerEventId);
      }

      store.dispatch('calendar/loadMoreBookings')
        .then((data) => scheduler.parse(
          toCalendarData(
            data,
            {
              locale: locale.value,
              currency: defaultCurrency.value,
              unknownGuest: i18n.t('bookings.shared.unknownGuest'),
            },
          ),
        ));
    };

    onUnmounted(() => {
      store.commit('calendar/RESET_CREATION_PARAMS');

      scheduler.clearAll();
      scheduler.removeEventListeners();
    });

    return {
      schedulerRef,
      drawerRef,
      formLoading,

      onUpdate,
    };
  },
};
</script>

<style lang='scss'>
@import "~dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css";

$text-color-dark: #3e3f42;
$color-light-gray: #939eb9;

@mixin background-opacity($color, $opacity: 1) {
  background: $color;
  background: rgba($color, $opacity);
}

.dhx_cal_container {
  width: 100%;
  height: 100%;
}

.dhx_cal_scale_placeholder {
  box-shadow: none;
}

.dhx_cal_header {
  border-top: 1px solid rgba($color-light-gray, 0.2);
  box-shadow: 0 3px 5px 0 rgb(0 0 0 / 10%);
}

.dhx_scale_bar {
  color: $text-color-dark;
  font-weight: 500;
  line-height: 18px;
  padding-top: 7px;

  div {
    font-size: 9px;
    font-weight: 300;
    text-transform: uppercase;
  }
}

.dhx_matrix_cell,
.dhx_matrix_scell {
  border-bottom: 1px solid rgba($color-light-gray, 0.1);
  border-right: 1px solid rgba($color-light-gray, 0.2);
}

.dhx_cell_now {
  background: $calendar-primary-color;
  border-right: 2px solid $calendar-primary-color;
  color: $color-white;
  z-index: 1;
}

.dhx_column_now {
  background: rgba($calendar-primary-color, 0.3) !important;
}

.dhx_data_table.folder .dhx_matrix_cell,
.dhx_matrix_scell.folder {
  border-bottom: 1px solid rgba($color-light-gray, 0.1);
  border-right: 1px solid rgba($color-light-gray, 0.2);
  background: rgba($color-light-gray, 0.04);
  color: rgba($text-color-dark, 0.6);
}

.dhx_matrix_scell.folder {
  .dhx_scell_expand:after {
    background-color: transparent;
  }

  .dhx_scell_name {
    color: $text-color-dark;
    font-size: 12px;
    font-weight: normal;
    text-transform: uppercase;
  }
}

.dhx_cal_event_line {
  height: 36px !important;
  top: 6px !important;
  border-radius: 12px;
  line-height: 34px;
  padding: 0 10px 0 16px;
  font-size: 12px;
  font-weight: 500;
  background: #D8D9D9;
  color: #A2A2A2;

  .dhx_event_resize {
    opacity: 0.5;
    height: 32px !important;
  }
  &.draft {
    background: #D8D9D9;
    color: #A2A2A2;
  }
  &.tentative {
    background: #ffd863;
    color: #c39919;
  }
  &.confirmed {
    background: #D5F8BA;
    color: #1AB2A7;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 6px;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    color: $primary-color;
    background-color: currentColor;
    transform: translateY(-50%);
  }

  &.checked_in {
    &::before {
      color: $success-color;
    }
  }

  &.checked_out {
    &::before {
      color: rgba($base-color-darken, 0.4);
    }
  }
}

.dhx_timeline_label_row.dhx_row_item {
  .dhx_scell_name {
    color: rgba($text-color-dark, 0.7);
    font-size: 12px;
    font-weight: normal;
  }
}
.no_resize .dhx_event_resize {
  display: none !important;
}
.dhx_cal_qi_title {
  background-color: rgba($base-color-darken, 0.45);

  .dhx_cal_qi_tcontent {
    font-size: 0.875rem;
  }
  .dhx_cal_qi_tdate {
    font-size: 0.75rem;
  }
}
.dhx_cal_qi_content {
  padding-top: 10px;
  padding-bottom: 10px;
}
.dhx_cal_quick_info {
  .dhx_cal_qi_controls {
    display: none;
  }
}
.bar-label {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
