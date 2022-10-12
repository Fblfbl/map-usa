import Component from "@ember/component";
import { createPopupContent } from "../common/utils";

export default Component.extend({
  classNames: ["map"],
  geoJson: null,
  map: null,
  activeState: "",
  _prevState: "",

  init() {
    this._super(...arguments);
    this.set("zoom", layer => {
      layer.setStyle({
        weight: 5,
        color: "#C97064",
        dashArray: "15",
        fillOpacity: 0.7
      });
      layer.bringToFront();
      layer.bindPopup(createPopupContent(layer.feature.properties)).openPopup();
      this.set("activeState", layer.feature.properties.name);
      this.get("map").fitBounds(layer.getBounds());
    });
  },

  didRender() {
    if (document.querySelector(".active")) {
      document.querySelector(".active").scrollIntoView({
        block: "start"
      });
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.set("map", L.map(this.element).setView([37.8, -96], 4));

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19
      }
    ).addTo(this.get("map"));

    function zoomToFeature(e) {
      this.get("zoom")(e.target);
    }

    function onPopupClose(e) {
      const layer = e.target;
      this.set("activeState", "");

      this.get("geoJson").resetStyle(layer);
    }

    function _onEachFeature(feature, layer) {
      layer.on({
        click: zoomToFeature.bind(this),
        popupclose: onPopupClose.bind(this)
      });
    }
    this.set(
      "geoJson",
      L.geoJson(this.get("data").toArray(), {
        onEachFeature: _onEachFeature.bind(this)
      }).addTo(this.get("map"))
    );
  },

  actions: {
    setActiveState(state) {
      this.set("activeState", state);
      this.get("map").eachLayer(
        function(layer) {
          if (
            layer.feature &&
            layer.feature.properties.name === this.get("activeState")
          ) {
            this.get("zoom")(layer);
          }
        }.bind(this)
      );
    }
  }
});
