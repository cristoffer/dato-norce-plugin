import { connect, RenderFieldExtensionCtx, RenderModalCtx } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import { render } from "./utils/render";
import NorseProductFieldEditor from "./entrypoints/NorseProductFieldEditor";
import ConfigScreen from "./entrypoints/ConfigScreen";
import AdditionalProductDataModal from "./components/AdditionalProductDataModal";

const FIELD_EXTENSION_ID = 'norceProduct';
const INITIAL_HEIGHT = 48;

connect({
	renderConfigScreen(ctx) {
		return render(<ConfigScreen ctx={ctx} />);
	},
	manualFieldExtensions() {
    return [
      {
        id: FIELD_EXTENSION_ID,
        name: 'Norce Product',
        type: 'editor',
        fieldTypes: ['string'],
        configurable: true,
        initialHeight: INITIAL_HEIGHT,
      },
    ];
  },
	renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    if (fieldExtensionId === FIELD_EXTENSION_ID) {
      return render(<NorseProductFieldEditor ctx={ctx} />);
    }
  },
  renderModal(modalId: string, ctx: RenderModalCtx) {
    switch (modalId) {
      case 'additionalProductDataModal':
        return render(<AdditionalProductDataModal ctx={ctx} />);
    }
  },
});
