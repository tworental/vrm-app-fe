export default {
  storage: {
    shared: {
      locations: {
        drive: 'Хранилище',
        recent: 'Недавние',
        starred: 'Отмеченные',
        bin: 'Корзина',
      },
    },
    views: {
      main: {
        title: 'Хранилище',
        locations: 'Разделы',
        pinned: 'Прикреплённые',
      },
      drive: {
        name: 'Имя',
        uploadFiles: 'Загрузить файлы',
        selectAll: 'Выбрать все',
        selected: 'выбрано: {count}',
        lastUpdatedAt: 'Последнее обновление',
        delete: 'Удалить',
        upload: 'Загрузить',
        download: 'Скачать',
        revert: 'Отменить',
        placeholder: {
          title: 'ФАЙЛЫ',
          label: 'Label',
          description: 'Сейчас нету файлов в этой директории',
        },
      },
    },
    components: {
      capacity: {
        label: '{size} использовано из {maxSize}',
      },
      listItem: {
        size: 'Размер: {size}',
        fileDescription: 'Последнее обновление: {date} ({size})',
        folderDescription: 'Всего элементов: {elements} • Последнее обновление: {date}',
      },
      drawer: {
        file: {
          title: 'Просмотр файла',
          delete: 'Вы действительно хотите удалить этот файл?',
          deleteSuccess: 'Файл успешно удалён!',
        },
        folder: {
          title: 'Просмотр папки',
          delete: 'Вы действительно хоитите удалить эту папку?',
          deleteSuccess: 'Папка успешно удалена!',
        },
      },
    },
  },
};
