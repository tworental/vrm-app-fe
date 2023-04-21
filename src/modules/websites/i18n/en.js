export default {
  websites: {
    shared: {
      activeToggleSuccess: 'Active status has been changed!',
      save: 'Save',
      cancel: 'Cancel',
    },
    components: {
      create: {
        title: 'Add Website',
        description: 'Provide an unique name to create a new website',
        name: 'Name',
        create: 'Create',
        cancel: 'Cancel',
        saveSuccess: 'A website has been created successfully!',
      },
      card: {
        edited: 'Edited: {time}',
        deleteConfirm: 'Are you sure you want to delete this website?',
        version: 'Version: {version}',
        activated: 'Active',
        disabled: 'Disabled',
        actions: {
          activate: 'Activate',
          disable: 'Disable',
          preview: 'Live Preview',
          delete: 'Delete',
        },
      },
      mainInfo: {
        title: 'Main Information',
        description: 'Some text',
        fields: {
          name: 'Website Name',
          link: 'Website Link',
          description: 'Description',
          enable: 'Enable',
        },
      },
      subpages: {
        title: 'Subpages',
        description: 'Manage subpages',
        create: 'Add Subpage',
        name: 'Name',
        table: {
          name: 'Name',
          title: 'Title',
          action: 'Action',
        },
        actions: {
          edit: 'Edit',
          delete: 'Delete',
        },
        noInfo: 'No Info',
        deleteConfirm: 'Are you sure you want to delete this page?',
        deleteSuccess: 'This page has been deleted successfully!',
      },
      subpageModal: {
        heading: 'Subpage',
        name: 'Name',
        title: 'Title',
        cancel: 'Cancel',
        save: 'Save',
      },
    },
    views: {
      main: {
        title: 'All Websites',
        placeholder: {
          title: 'Websites',
          description: 'You don\'t have no Website yet',
          label: 'label',
        },
        add: 'Add Website',
      },
      form: {
        preview: 'Live Preview',
        release: 'Release',
        updateSuccess: 'Website details have been updated successfully!',
      },
    },
  },
};
