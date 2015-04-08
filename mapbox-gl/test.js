function (t, e, s) {
    this.stop();
    var i = this.transform, r = i.zoom !== +e, o = i.bearing !== +s;
    return i.center = LatLng.convert(t), i.zoom = +e, i.bearing = +s, this.fire("movestart")._move(r, o).fire("moveend")
}
/**
 * Created by DBaah on 4/5/15.
 */
