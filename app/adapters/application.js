import DS from "ember-data";
import ENV from "map-test/config/environment";

export default DS.JSONAPIAdapter.extend({
  host: ENV.backendURL
});
