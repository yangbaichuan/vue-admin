import VIcon from '_c/vIcon';
import { showTitle } from '@/utils/util';
export default {
  components: {
    VIcon
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this);
    },
    showChildren (item) {
      return item.children && (item.children.length > 1 || item.showAlways);
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name);
    }
  }
};
