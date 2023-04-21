<script>
import {
  onMounted, ref, h, watch,
} from 'vue';

const cache = {};

export default {
  name: 'CoreSvg',
  props: {
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
  },
  setup(props, context) {
    const source = ref(null);
    const title = ref(props.title);

    const render = async () => {
      if (!cache[props.src]) {
        const svg = await fetch(props.src)
          .then((response) => response.text());

        const parser = new DOMParser();
        const xml = parser.parseFromString(svg, 'text/xml')
          .querySelector('svg');

        if (xml.querySelector('title')) {
          title.value = xml.querySelector('title').innerHTML.trim();
        }

        cache[props.src] = h('svg', {
          innerHTML: xml.innerHTML,
          title: title.value,
          ...Object.values(xml.attributes).reduce((acc, curr) => ({
            ...acc,
            [curr.name]: curr.value,
          }), {}),
        });
      }

      cache[props.src].props = {
        ...cache[props.src].props,
        ...context.attrs,
      };

      source.value = cache[props.src];
    };

    onMounted(async () => {
      await render();
    });

    watch(() => props.src, async () => {
      await render();
    });

    return () => source.value;
  },
};
</script>
