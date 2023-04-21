export default {
  channels: {
    components: {
      card: {
        activate: 'Enable',
        disactivate: 'Disable',
        successUpdate: 'This channel has been updated successfully!',
        status: {
          activated: 'Activated',
          disabled: 'Disabled',
        },
      },
    },
    views: {
      main: {
        title: 'Channels',
        placeholder: {
          title: 'Channels',
          description: 'Currently there are no Channels enabled',
          label: 'label',
        },
      },
    },
    dicts: {
      descriptions: {
        channex: 'Channex Channel',
      },
    },
  },
};
