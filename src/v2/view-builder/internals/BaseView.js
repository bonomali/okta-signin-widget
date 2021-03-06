import { _, View } from 'okta';
import BaseForm from './BaseForm';
import BaseModel from './BaseModel';
import BaseHeader from './BaseHeader';
import BaseFooter from './BaseFooter';

export default View.extend({

  Header: BaseHeader,

  Body: BaseForm,

  Footer: BaseFooter,

  className: 'siw-main-view',

  template: '<div class="siw-main-header"></div>' +
      '<div class="siw-main-body"></div>' +
      '<div class="siw-main-footer"></div>',

  initialize () {
    // Add Views
    this.add(this.Header, { selector: '.siw-main-header' });
    this.renderForm();
    this.add(this.Footer, { selector : '.siw-main-footer' });
  },

  renderForm () {
    let optionUiSchemaConfig;

    if (this.form) {
      this.form.remove();
      optionUiSchemaConfig = this.form.model.toJSON({verbose: true});
    }

    // Create Model
    const IonModel = this.createModelClass(
      this.options.currentViewState,
      optionUiSchemaConfig);
    const model = new IonModel ({
      formName: this.options.currentViewState.name,
    });

    if (!optionUiSchemaConfig) {
      optionUiSchemaConfig = model.toJSON({verbose: true});
    }

    this.form = this.add(this.Body, {
      selector : '.siw-main-body',
      options: {
        model,
        optionUiSchemaConfig,
      },
    }).last();

    _.each(model.attributes, (value, key) => {
      if (key.match(/sub_schema_local_[^ ]+/)) {
        // in order to render different sub-schema
        this.listenTo(model, `change:${key}`, () => {
          this.renderForm();
        });
      }
    });
  },

  createModelClass (currentViewState, optionUiSchemaConfig = {}) {
    return BaseModel.create(currentViewState, optionUiSchemaConfig);
  },

});
