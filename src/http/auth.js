import store from "@/store";

let auth = function(name) {
    let obj = store.state.JurisdictionArray
    return obj.indexOf(name ) >= 0;
}
export default auth;