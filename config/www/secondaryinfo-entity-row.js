customElements.whenDefined('card-tools').then(() => {

    class SecondaryInfoEntityRow extends cardTools.litElement() {
        version() { return "0.1"; }

        render() {
            return cardTools.litHtml()`
                ${this._wrappedElement}
            `;
        }

        setConfig(config) {
            cardTools.checkVersion(0.3);
            this._config = config;
            this._wrappedElement = this._createElement(config);
            this.requestUpdate();
        }

        set hass(hass) {
            this._hass = hass;
            this._stateObj = this._config.entity in hass.states ? hass.states[this._config.entity] : null;
            this._updateElement(this._wrappedElement, hass);
        }

        _createElement(config) {
            // Override the custom row type in order to create the 'standard' row for this entity
            let defaultRowConfig = Object.assign(config, {type: "default"});
            const element = cardTools.createEntityRow(defaultRowConfig);
            return element;
        }

        async _updateElement(wrappedElement, hass) {
            if (!wrappedElement) return;

            this._wrappedElement.hass = hass;
            await this._wrappedElement.updateComplete;
            let secondaryInfoDiv = this._wrappedElement.shadowRoot.querySelector("hui-generic-entity-row").shadowRoot.querySelector(".secondary");
            if (secondaryInfoDiv && this._config.secondary_info) {
                const secondary_info_str = this._config.secondary_info.replace('<entity_id>', this._config.entity);
                let text = window.cardTools.parseTemplate(secondary_info_str, 'Unable to parse secondary_info config');
                secondaryInfoDiv.innerHTML = text;
            }
        }
    }
    customElements.define('secondaryinfo-entity-row', SecondaryInfoEntityRow);

});

setTimeout(() => {
    if (customElements.get('card-tools')) return;
    customElements.define('secondaryinfo-entity-row', class extends HTMLElement {
        setConfig() {
            throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");
        }
    });
}, 2000);