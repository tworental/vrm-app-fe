export default {
  storage: {
    shared: {
      locations: {
        drive: 'Drive',
        starred: 'Starred',
        tagged: 'Tagged',
        bin: 'Bin',
      },
    },
    views: {
      main: {
        title: 'Storage',
        locations: 'Locations',
        pinned: 'Pinned',
        tags: 'Tags',
        unpin: 'Are you sure you want to unpin this folder?',
      },
      drive: {
        name: 'Name',
        uploadFiles: 'Upload Files',
        selectAll: 'Select All',
        selected: '{count} selected',
        lastUpdatedAt: 'Last update',
        delete: 'Delete',
        upload: 'Upload',
        download: 'Download',
        revert: 'Revert',
        placeholder: {
          title: 'FILES',
          label: 'Label',
          description: 'Currently there are no files in this folder',
        },
        deleteMessage: 'Are you sure you want to delete these items?',
        deleteSuccess: 'Selected items have been deleted successfully!',
      },
    },
    components: {
      uploadBtn: {
        uploadSuccess: 'Files have been uploaded successfully!',
      },
      capacity: {
        label: '{size} used from {maxSize} ({percent}%)',
      },
      listItem: {
        size: 'Size: {size}',
        fileDescription: 'Last modified at: {date} ({size})',
        folderDescription: 'Total elements: {elements} • Last modified at: {date}',
        revert: 'Revert',
      },
      drawer: {
        file: {
          title: 'View File',
          delete: 'Are you sure you want to delete this file?',
          deleteSuccess: 'This file has been deleted successfully!',
          pinSuccess: 'This file has been pinned successfully!',
          unpinSuccess: 'This file has been unpinned successfully!',
          starSuccess: 'This file has been starred successfully!',
          unstarSuccess: 'This file has been unstarred successfully!',
          actions: {
            pin: 'Pin the folder to sidebar',
            unpin: 'Unpin the folder to sidebar',
            star: 'Star this file',
            unstar: 'Unstar this file',
            download: 'Download',
            delete: 'Delete',
          },
        },
        folder: {
          title: 'View Folder',
          delete: 'Are you sure you want to delete this folder?',
          deleteSuccess: 'This folder has been deleted successfully!',
          pinSuccess: 'This folder has been pinned successfully!',
          unpinSuccess: 'This folder has been unpinned successfully!',
          starSuccess: 'This folder has been starred successfully!',
          unstarSuccess: 'This folder has been unstarred successfully!',
          actions: {
            pin: 'Pin the file to sidebar',
            unpin: 'Unpin the file to sidebar',
            star: 'Star this folder',
            unstar: 'Unstar this folder',
            download: 'Download',
            delete: 'Delete',
          },
        },
        attrs: {
          size: 'Size: {size}',
          owner: 'Owner: {name}',
          lastModified: 'Last modified: {date}',
          created: 'Created: {date}',
        },
        moveTo: 'Move To',
        createLabel: 'Create Label / Tag',
        directoryName: 'Directory Name',
        name: 'Name',
        cancel: 'Cancel',
        save: 'Save',
      },
      folderCreate: {
        title: 'Create Folder',
        name: 'Name',
        cancel: 'Cancel',
        create: 'Create',
        successCreate: 'Your Folder has been created successfully!',
      },
    },
  },
};