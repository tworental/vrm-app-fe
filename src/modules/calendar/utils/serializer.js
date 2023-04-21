import dayjs from '@/utils/dayjs';

export const IDS = Object.freeze({
  PROPERTY: 'property',
  UNIT_TYPE: 'unitType',
  UNIT: 'unit',
});

export const eventId = (type, id) => [type, id].join('-');

const serializeSingleProperty = (rental) => [
  {
    key: eventId(IDS.UNIT, rental.unitTypes[0].units[0].id),
    label: rental.unitTypes[0].units[0].name,
    propertyId: rental.id,
    propertyUnitTypeId: rental.unitTypes[0].id,
    propertyUnitTypeUnitId: rental.unitTypes[0].units[0].id,
    checkinTime: rental.checkinTime,
    checkoutTime: rental.checkoutTime,
    isUnit: true,
    status: rental.unitTypes[0].units[0].status,
  },
];

const serializeMultipleProperty = (rental) => rental.unitTypes.map((unitType) => ({
  key: eventId(IDS.UNIT_TYPE, unitType.id),
  label: unitType.name,
  open: true,
  children: unitType.units.map((unit) => ({
    key: eventId(IDS.UNIT, unit.id),
    label: unit.name,
    propertyId: rental.id,
    propertyUnitTypeId: unitType.id,
    propertyUnitTypeUnitId: unit.id,
    checkinTime: rental.checkinTime,
    checkoutTime: rental.checkoutTime,
    isUnit: true,
    status: unit.status,
  })),
}));

export const toSectionsFormat = (sections) => sections.map((rental) => ({
  key: eventId(IDS.PROPERTY, rental.id),
  label: rental.name,
  open: true,
  children: rental.multipleUnitTypes
    ? serializeMultipleProperty(rental)
    : serializeSingleProperty(rental),
}));

const parseDate = (date) => dayjs(date).format('YYYY-MM-DD HH:mm');

export const toCalendarData = (bookings, { currency, unknownGuest, locale }) => bookings.map((booking) => ({
  unit_id: eventId(IDS.UNIT, booking.propertyUnitTypeUnitId),
  start_date: parseDate(booking.dateArrival),
  end_date: parseDate(booking.dateDeparture),
  text: `${booking.guestName || unknownGuest}`,
  bookingId: booking.id,
  guest: booking.guestName || unknownGuest,
  totalGuests: booking.totalGuests,
  amount: booking.amountTotal,
  currency: booking.currency || currency,
  locale,
  status: booking.status,
  checkinAt: booking.checkinAt,
  checkoutAt: booking.checkoutAt,
}));
