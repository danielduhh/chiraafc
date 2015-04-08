var mapApp = angular.module('mapApp', ['ui.bootstrap'])
    .controller('map', function($scope, $http,Outdoors) {

        $scope.outdoors = {};

        var sty = {
            "layers":[
                {
                    "id": "route",
                    "source": "route",
                    "type": "fill",
                    "layout": {
                        "visibility": "visible"
                    },
                    "paint": {
                        "fill-color": "#ff0000",
                        "fill-opacity": .4,
                        "fill-outline-color":"#20298A"
                    }
                }
            ]
        };

        mapboxgl.accessToken = 'pk.eyJ1IjoiYXBvbGxvbG0iLCJhIjoiM2pnUTZ6byJ9.WivqOz2WgjJNBPKC1vrliA';

        $http.get("https://www.mapbox.com/mapbox-gl-styles/styles/outdoors-v7.json").success(function(response) {
            $scope.outdoors = response;
            console.log($scope.outdoors);
        });

        sty.layers.forEach(function(layer){
            Outdoors.layers.push(layer);
        });

        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: Outdoors,
            center: [47.641621, -122.385985], //maggie
            zoom: 9 // starting zoom
        });

        $scope.map = map;

        var Maggie = {long:-122.385985,lat:47.641621};

        var MaggiePoly = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    -122.38617986440657,
                                    47.64147292142044
                                ],
                                [
                                    -122.38595187664032,
                                    47.64147472860616
                                ],
                                [
                                    -122.38576143980026,
                                    47.64172592681518
                                ],
                                [
                                    -122.38581240177153,
                                    47.64174038422932
                                ],
                                [
                                    -122.38597869873045,
                                    47.64174219140579
                                ],
                                [
                                    -122.38617986440657,
                                    47.64147292142044
                                ]
                            ]
                        ]
                    }
                }
            ]
        }

        map.on('style.load', function() {
            map.addSource("markers", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [Maggie.long, Maggie.lat]
                        },
                        "properties": {
                            "title": "Maggie",
                            "marker-symbol": "harbor"

                        },"layout": {
                            "icon-image": "{marker-symbol}-12",
                            "text-field": "{title}",
                            "text-max-size": 30,
                            "text-font": "Open Sans Semibold, Arial Unicode MS Bold",
                            "text-offset": [0, 0.6],
                            "text-anchor": "top"
                        }
                    }]
                }
            });

            var route = new mapboxgl.GeoJSONSource({ data: MaggiePoly });
            map.addSource('route', route);

            //map.addControl(new mapboxgl.Navigation());
            //
            //window.setInterval(function() {
            //    if (map.hasClass('night')) {
            //        map.removeClass('night');
            //    } else {
            //        map.addClass('night');
            //    }
            //}, 2000);

            $scope.zoom = Math.round(map.getZoom());

            map.addLayer({
                "id": "markers",
                "type": "symbol",
                "source": "markers",
                "layout": {
                    "icon-image": "{marker-symbol}-12",
                    "text-field": "{title}",
                    "text-font": "Open Sans Semibold, Arial Unicode MS Bold",
                    "text-offset": [0, 0.6],
                    "text-anchor": "top"
                },
                "paint": {
                    "text-size": 12
                }
            });
        });

        map.on('click', function(evt){
            var points = JSON.parse(JSON.stringify(map.unproject(evt.point)));

            var lat = parseFloat(points.lat).toFixed(2);
            var lng = parseFloat(points.lng).toFixed(2);

            if(lat == parseFloat(Maggie.lat).toFixed(2) && lng == parseFloat(Maggie.long).toFixed(2)){
                alert("Bullseye!");
            };

            console.log(JSON.stringify(map.unproject(evt.point)));
            console.log("Map Clicked at: " + "Lat: " + map.getBounds()._ne.lat + " Long: " + map.getBounds()._ne.lat);
        });

        map.on('zoom', function(){
            $scope.zoom = Math.round(map.getZoom());
            console.log("Zoom: " + $scope.zoom);
        });

        $scope.zoomIn = function(){
            map.flyTo(map.getCenter(),$scope.zoom + 1);
        };

        $scope.zoomOut = function(){
            map.flyTo(map.getCenter(),$scope.zoom - 1);
        };

        $scope.back2Mags = function(){
            map.flyTo([Maggie.lat,Maggie.long], 18);
        };


    });

angular.module('mapApp').factory('Outdoors', function() {

    var outdoors = {
        "version": 7,
        "name": "Mapbox Outdoors",
        "constants": {
            "@name": "{name_en}",
            "@sans_lt": "Open Sans Regular, Arial Unicode MS Regular, Arial Unicode MS Bold",
            "@sans": "Open Sans Semibold, Arial Unicode MS Bold",
            "@sans_italic": "Open Sans Semibold Italic, Arial Unicode MS Bold",
            "@land": "#f4efe1",
            "@water": "#cdd",
            "@water_dark": "#185869",
            "@crop": "#eeeed4",
            "@grass": "#e6e6cc",
            "@scrub": "#dfe5c8",
            "@wood": "#cee2bd",
            "@snow": "#f4f8ff",
            "@rock": "#ddd",
            "@sand": "#ffd",
            "@cemetery": "#edf4ed",
            "@pitch": "#fff",
            "@park": "#d4e4bc",
            "@piste": "blue",
            "@school": "#e8dfe0",
            "@hospital": "#f8eee0",
            "@parking": "#bfbfbf",
            "@builtup": "#f6faff",
            "@case": "#fff",
            "@motorway": "#cda0a0",
            "@main": "#ddc0b9",
            "@street": {
                "stops": [[12.5, "#d9d5c6"], [13, "#fff"]]
            },
            "@street_case": "#d9d5c6",
            "@service": "#faf7f0",
            "@text": "#666",
            "@text_stroke": "rgba(255,255,255,0.8)",
            "@text_halo": "rgba(255,255,255,0.8)",
            "@country_text": "#000",
            "@marine_text": "#a0bdc0",
            "@water_text": "#185869",
            "@land_night": "#017293",
            "@water_night": "#103",
            "@water_dark_night": "#003366",
            "@crop_night": "#178d96",
            "@grass_night": "#23948a",
            "@scrub_night": "#31a186",
            "@wood_night": "#45b581",
            "@park_night": "#51bd8b",
            "@snow_night": "#5ad9fe",
            "@rock_night": "#999",
            "@sand_night": "#437162",
            "@cemetery_night": "#218c96",
            "@pitch_night": "rgba(255,255,255,0.2)",
            "@school_night": "#01536a",
            "@hospital_night": "#015e7a",
            "@builtup_night": "#014b60",
            "@admin_night": "#ffb680",
            "@text_night": "#fff",
            "@text_water_night": "#0186ac",
            "@text_stroke_night": "#103",
            "@text2_stroke_night": "rgba(1,69,89,0.8)",
            "@case_night": "#015e7a",
            "@street_case_night": "#015b76",
            "@motorway_night": "#bbdde7",
            "@main_night": "#64b2c9",
            "@street_night": "#0186ac",
            "@service_night": "#017ea2",
            "@contour_night": "#ffff80",
            "@river_canal_width": {
                "stops": [[10, 0.5], [20, 6]]
            },
            "@stream_width": {
                "stops": [[13, 0.75], [20, 4]]
            },
            "@motorway_width": {
                "base": 1.25,
                "stops": [[9, 1], [20, 30]]
            },
            "@motorway_casing_width": {
                "stops": [[9, 0.9], [11, 1], [14, 1.5]]
            },
            "@motorway_link_width": {
                "base": 1.2,
                "stops": [[10, 1], [20, 7]]
            },
            "@motorway_link_casing_width": {
                "stops": [[11, 0.8], [16, 1]]
            },
            "@main_width": {
                "base": 1.3,
                "stops": [[11, 1], [20, 28]]
            },
            "@main_casing_width": {
                "stops": [[11, 1], [15, 1.5]]
            },
            "@street_width": {
                "base": 1.3,
                "stops": [[12.5, 1], [20, 12]]
            },
            "@street_casing_width": {
                "stops": [[12.5, 0], [13, 1], [15, 1.5]]
            },
            "@service_width": {
                "base": 1.3,
                "stops": [[15, 2], [20, 7]]
            },
            "@service_casing_width": 1,
            "@path_width": {
                "base": 1.3,
                "stops": [[15, 1.5], [20, 2]]
            },
            "@path_bg_width": {
                "base": 1.3,
                "stops": [[15, 4], [20, 5]]
            },
            "@path_steps_width": {
                "base": 1.3,
                "stops": [[15, 1.5], [20, 10]]
            },
            "@path_dasharray_primary": [3, 1],
            "@path_dasharray_secondary": [5, 1.5],
            "@tunnel_dasharray": [4, 1.5],
            "@major_rail_hatching_width": {
                "stops": [[12, 5], [20, 10]]
            },
            "@major_rail_hatching_dasharray": [0.05, 10],
            "@aerialway_width": {
                "base": 1.2,
                "stops": [[12, 0.8], [20, 5]]
            },
            "@aerialway_casing_width": {
                "stops": [[12, 0.6], [17, 1]]
            },
            "@aerialway_hatching_width": {
                "base": 1.2,
                "stops": [[12, 5], [20, 15]]
            },
            "@runway_width": {
                "base": 1.15,
                "stops": [[10, 2], [20, 32]]
            },
            "@taxiway_width": {
                "base": 1.15,
                "stops": [[11, 0.2], [20, 8]]
            },
            "@admin_l2_width": {
                "stops": [[2, 0.6], [20, 8]]
            },
            "@admin_l3_width": {
                "stops": [[5, 0.6], [20, 6]]
            },
            "@fence_width": {
                "stops": [[16, 0.6], [20, 1.4]]
            },
            "@hedge_width": {
                "base": 0.9,
                "stops": [[15, 0.6], [20, 2]]
            },
            "@barrier_line_land_width": {
                "base": 1.9,
                "stops": [[13, 0.4], [20, 48]]
            },
            "@country_label_size": {
                "stops": [[2, 11], [8, 20]]
            },
            "@road_label_1_size": {
                "base": 1.3,
                "stops": [[12, 11], [17, 18]]
            },
            "@road_label_2_size": {
                "base": 1.3,
                "stops": [[12, 11], [17, 16]]
            },
            "@road_label_3_size": {
                "base": 1.3,
                "stops": [[14, 10], [17, 14]]
            },
            "@poi_label_1-2_size": {
                "stops": [[14, 10], [16, 12]]
            },
            "@poi_label_3_size": {
                "stops": [[15, 10], [16, 11]]
            }
        },
        "sources": {
            "mapbox": {
                "type": "vector",
                "url": "mapbox://mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v6"
            }
        },
        "sprite": "https://www.mapbox.com/mapbox-gl-styles/sprites/outdoors",
        "glyphs": "mapbox://fontstack/{fontstack}/{range}.pbf",
        "layers": [{
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "@land"
            },
            "paint.night": {
                "background-color": "@land_night"
            }
        }, {
            "id": "landcover_snow",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landcover",
            "filter": ["==", "class", "snow"],
            "paint": {
                "fill-color": "@snow"
            },
            "paint.night": {
                "fill-color": "@snow_night"
            }
        }, {
            "id": "landcover_crop",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landcover",
            "filter": ["==", "class", "crop"],
            "paint": {
                "fill-color": "@crop"
            },
            "paint.night": {
                "fill-color": "@crop_night"
            }
        }, {
            "id": "landcover_grass",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landcover",
            "filter": ["==", "class", "grass"],
            "paint": {
                "fill-color": "@grass",
                "fill-opacity": {
                    "stops": [[12, 1], [16, 0.2]]
                }
            },
            "paint.night": {
                "fill-color": "@grass_night"
            }
        }, {
            "id": "landcover_scrub",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landcover",
            "filter": ["==", "class", "scrub"],
            "paint": {
                "fill-color": "@scrub",
                "fill-opacity": {
                    "stops": [[12, 1], [16, 0.2]]
                }
            },
            "paint.night": {
                "fill-color": "@scrub_night"
            }
        }, {
            "id": "landcover_wood",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landcover",
            "filter": ["==", "class", "wood"],
            "paint": {
                "fill-color": "@wood",
                "fill-opacity": {
                    "stops": [[12, 1], [16, 0.2]]
                }
            },
            "paint.night": {
                "fill-color": "@wood_night"
            }
        }, {
            "id": "landuse_wood",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "wood"],
            "paint": {
                "fill-color": "@wood"
            },
            "paint.night": {
                "fill-color": "@wood_night",
                "fill-opacity": 0.8
            }
        }, {
            "id": "landuse_scrub",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "scrub"],
            "paint": {
                "fill-color": "@scrub"
            },
            "paint.night": {
                "fill-color": "@scrub_night",
                "fill-opacity": 0.8
            }
        }, {
            "id": "landuse_grass",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "grass"],
            "paint": {
                "fill-color": "@grass"
            },
            "paint.night": {
                "fill-color": "@grass_night",
                "fill-opacity": 0.8
            }
        }, {
            "id": "landuse_crop",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "crop"],
            "paint": {
                "fill-color": "@crop"
            },
            "paint.night": {
                "fill-color": "@crop_night",
                "fill-opacity": 0.8
            }
        }, {
            "id": "landuse_rock",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "rock"],
            "paint": {
                "fill-color": "@rock"
            },
            "paint.night": {
                "fill-color": "@rock_night",
                "fill-opacity": 0.8
            }
        }, {
            "id": "landuse_snow",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "snow"],
            "paint": {
                "fill-color": "@snow"
            },
            "paint.night": {
                "fill-color": "@snow_night",
                "fill-opacity": 0.8
            }
        }, {
            "id": "landuse_school",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "school"],
            "paint": {
                "fill-color": "@school"
            },
            "paint.night": {
                "fill-color": "@school_night"
            }
        }, {
            "id": "landuse_industrial",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "industrial"],
            "paint": {
                "fill-color": "rgba(246,250,255,0.5)"
            },
            "paint.night": {
                "fill-color": "@builtup_night"
            }
        }, {
            "id": "landuse_hospital",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "hospital"],
            "paint": {
                "fill-color": "@hospital"
            },
            "paint.night": {
                "fill-color": "@hospital_night"
            }
        }, {
            "id": "landuse_parking",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "parking"],
            "paint": {
                "fill-color": "@parking",
                "fill-opacity": {
                    "stops": [[15, 0], [15.5, 0.4]]
                }
            },
            "paint.night": {
                "fill-color": "#026688"
            }
        }, {
            "id": "landuse_sand",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "sand"],
            "paint": {
                "fill-color": "@sand"
            },
            "paint.night": {
                "fill-color": "@sand_night",
                "fill-opacity": 0.8
            }
        }, {
            "id": "landuse_park",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "park"],
            "paint": {
                "fill-color": "@park"
            },
            "paint.night": {
                "fill-color": "@park_night"
            }
        }, {
            "id": "landuse_pitch",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "pitch"],
            "paint": {
                "fill-color": "rgba(255,255,255,0.5)",
                "fill-outline-color": "@pitch"
            },
            "paint.night": {
                "fill-color": "@pitch_night",
                "fill-outline-color": "@pitch"
            }
        }, {
            "id": "landuse_cemetery",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse",
            "filter": ["==", "class", "cemetery"],
            "paint": {
                "fill-color": "@cemetery"
            },
            "paint.night": {
                "fill-color": "@cemetery_night"
            }
        }, {
            "id": "waterway_river_canal",
            "type": "line",
            "source": "mapbox",
            "source-layer": "waterway",
            "filter": ["in", "type", "river", "canal"],
            "layout": {
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#87abaf",
                "line-width": "@river_canal_width"
            },
            "paint.night": {
                "line-color": "rgb(10,20,71)"
            }
        }, {
            "id": "waterway_stream",
            "type": "line",
            "source": "mapbox",
            "source-layer": "waterway",
            "filter": ["==", "type", "stream"],
            "layout": {
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#87abaf",
                "line-width": "@stream_width"
            },
            "paint.night": {
                "line-color": "rgb(10,20,71)"
            }
        }, {
            "id": "building_shadow",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "building",
            "paint": {
                "fill-color": "#bfbfbf"
            },
            "paint.night": {
                "fill-color": "#026688"
            }
        }, {
            "id": "building",
            "ref": "building_shadow",
            "paint": {
                "fill-color": "#ebe7db",
                "fill-outline-color": {
                    "stops": [[15, "#ebe7db"], [20, "#cecdc9"]]
                },
                "fill-translate": {
                    "stops": [[15, [0, 0]], [20, [-1.5, -2.5]]],
                    "base": 0.5
                }
            },
            "paint.night": {
                "fill-color": "#027797",
                "fill-outline-color": {
                    "stops": [[15, "#027797"], [20, "#026688"]]
                }
            }
        }, {
            "id": "hillshade_highlight_bright",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "hillshade",
            "filter": ["==", "level", 94],
            "paint": {
                "fill-color": "#ffd",
                "fill-opacity": {
                    "stops": [[15, 0.15], [17, 0.05]]
                }
            },
            "paint.night": {
                "fill-color": "#fdfdad",
                "fill-opacity": {
                    "stops": [[15, 0.25], [17, 0.05]]
                }
            }
        }, {
            "id": "hillshade_highlight_med",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "hillshade",
            "filter": ["==", "level", 90],
            "paint": {
                "fill-color": "#ffd",
                "fill-opacity": {
                    "stops": [[15, 0.15], [17, 0.05]]
                }
            },
            "paint.night": {
                "fill-color": "#fdfdad",
                "fill-opacity": {
                    "stops": [[15, 0.25], [17, 0.05]]
                }
            }
        }, {
            "id": "hillshade_shadow_faint",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "hillshade",
            "filter": ["==", "level", 89],
            "paint": {
                "fill-color": "#216",
                "fill-opacity": {
                    "stops": [[14, 0.06], [17, 0.01]]
                }
            },
            "paint.night": {
                "fill-color": "#216",
                "fill-opacity": {
                    "stops": [[6, 0.15], [13, 0.2], [17, 0.01]]
                }
            }
        }, {
            "id": "hillshade_shadow_med",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "hillshade",
            "filter": ["==", "level", 78],
            "paint": {
                "fill-color": "#216",
                "fill-opacity": {
                    "stops": [[14, 0.06], [17, 0.01]]
                }
            },
            "paint.night": {
                "fill-color": "#216",
                "fill-opacity": {
                    "stops": [[6, 0.15], [13, 0.2], [17, 0.01]]
                }
            }
        }, {
            "id": "hillshade_shadow_dark",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "hillshade",
            "filter": ["==", "level", 67],
            "paint": {
                "fill-color": "#216",
                "fill-opacity": {
                    "stops": [[14, 0.06], [17, 0.01]]
                }
            },
            "paint.night": {
                "fill-color": "#216",
                "fill-opacity": {
                    "stops": [[6, 0.15], [13, 0.2], [17, 0.01]]
                }
            }
        }, {
            "id": "hillshade_shadow_extreme",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "hillshade",
            "filter": ["==", "level", 56],
            "paint": {
                "fill-color": "#216",
                "fill-opacity": {
                    "stops": [[14, 0.06], [17, 0.01]]
                }
            },
            "paint.night": {
                "fill-color": "#216",
                "fill-opacity": {
                    "stops": [[6, 0.15], [13, 0.2], [17, 0.01]]
                }
            }
        }, {
            "id": "contour_line_loud",
            "type": "line",
            "source": "mapbox",
            "source-layer": "contour",
            "filter": ["==", "index", 5],
            "paint": {
                "line-color": "#000",
                "line-width": 1.2,
                "line-opacity": {
                    "stops": [[11, 0.1], [12, 0.2]]
                }
            },
            "paint.night": {
                "line-color": "@contour_night",
                "line-opacity": {
                    "stops": [[11, 0.1], [12, 0.4]]
                }
            }
        }, {
            "id": "contour_line_regular",
            "type": "line",
            "source": "mapbox",
            "source-layer": "contour",
            "filter": ["!=", "index", 5],
            "paint": {
                "line-color": "#000",
                "line-width": 1.2,
                "line-opacity": {
                    "stops": [[11, 0.05], [12, 0.1]]
                }
            },
            "paint.night": {
                "line-color": "@contour_night",
                "line-opacity": {
                    "stops": [[11, 0.1], [12, 0.2]]
                }
            }
        }, {
            "id": "barrier_line_gate",
            "type": "line",
            "source": "mapbox",
            "source-layer": "barrier_line",
            "filter": ["==", "class", "gate"],
            "paint": {
                "line-width": 2.5,
                "line-color": "#aab"
            },
            "paint.night": {
                "line-color": "#59596f"
            }
        }, {
            "id": "barrier_line_fence",
            "type": "line",
            "source": "mapbox",
            "source-layer": "barrier_line",
            "minzoom": 16,
            "filter": ["==", "class", "fence"],
            "paint": {
                "line-color": "#aeada3",
                "line-width": "@fence_width"
            },
            "paint.night": {
                "line-color": "#014b61"
            }
        }, {
            "id": "barrier_line_hedge",
            "type": "line",
            "source": "mapbox",
            "source-layer": "barrier_line",
            "minzoom": 15,
            "filter": ["==", "class", "hedge"],
            "paint": {
                "line-color": "#8de99b",
                "line-width": "@hedge_width"
            },
            "paint.night": {
                "line-color": "#2e7a57"
            }
        }, {
            "id": "water",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "water",
            "paint": {
                "fill-color": "@water",
                "fill-outline-color": "#a2bdc0"
            },
            "paint.night": {
                "fill-color": "@water_night",
                "fill-outline-color": "@water_dark_night"
            }
        }, {
            "id": "overlay_wetland",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse_overlay",
            "filter": ["in", "class", "wetland", "wetland_noveg"],
            "paint": {
                "fill-color": "rgba(210,225,225,0.2)",
                "fill-image": "wetland_noveg_64"
            },
            "paint.night": {}
        }, {
            "id": "overlay_breakwater_pier",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "landuse_overlay",
            "filter": ["in", "class", "breakwater", "pier"],
            "paint": {
                "fill-color": "@land"
            },
            "paint.night": {
                "fill-color": "@land_night"
            }
        }, {
            "id": "barrier_line_land_fill",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "barrier_line",
            "filter": ["all", ["==", "class", "land"], ["==", "$type", "Polygon"]],
            "paint": {
                "fill-color": "@land"
            },
            "paint.night": {
                "fill-color": "@land_night"
            }
        }, {
            "id": "barrier_line_land",
            "type": "line",
            "source": "mapbox",
            "source-layer": "barrier_line",
            "filter": ["all", ["==", "class", "land"], ["==", "$type", "LineString"]],
            "paint": {
                "line-color": "@land",
                "line-width": "@barrier_line_land_width"
            },
            "paint.night": {
                "line-color": "@land_night"
            }
        }, {
            "id": "barrier_line_cliff",
            "type": "line",
            "source": "mapbox",
            "source-layer": "barrier_line",
            "minzoom": 12,
            "filter": ["==", "class", "cliff"],
            "layout": {
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#987",
                "line-width": {
                    "stops": [[12, 1], [20, 2]]
                }
            },
            "paint.night": {
                "line-color": "#63574b"
            }
        }, {
            "id": "aeroway_runway",
            "type": "line",
            "source": "mapbox",
            "source-layer": "aeroway",
            "filter": ["all", ["==", "type", "runway"], ["==", "$type", "LineString"]],
            "paint": {
                "line-color": "#ddd",
                "line-width": "@runway_width"
            },
            "paint.night": {
                "line-color": "#367"
            }
        }, {
            "id": "aeroway_taxiway",
            "type": "line",
            "source": "mapbox",
            "source-layer": "aeroway",
            "filter": ["all", ["==", "type", "taxiway"], ["==", "$type", "LineString"]],
            "paint": {
                "line-color": "#ddd",
                "line-width": "@taxiway_width"
            },
            "paint.night": {
                "line-color": "#367"
            }
        }, {
            "id": "aeroway_fill",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "aeroway",
            "filter": ["all", ["==", "$type", "Polygon"], ["!=", "type", "apron"]],
            "paint": {
                "fill-color": "#ddd"
            },
            "paint.night": {
                "fill-color": "#367"
            }
        }, {
            "id": "tunnel_path_bg",
            "type": "line",
            "source": "mapbox",
            "source-layer": "tunnel",
            "filter": ["==", "class", "path"],
            "paint": {
                "line-color": "#ffd",
                "line-opacity": 0.4,
                "line-width": "@path_bg_width"
            },
            "paint.night": {
                "line-color": "@land_night",
                "line-opacity": 0.2
            }
        }, {
            "id": "tunnel_motorway_link_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "tunnel",
            "filter": ["==", "class", "motorway_link"],
            "paint": {
                "line-color": "@case",
                "line-dasharray": "@tunnel_dasharray",
                "line-width": "@motorway_link_casing_width",
                "line-gap-width": "@motorway_link_width"
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "tunnel_service_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "tunnel",
            "filter": ["==", "class", "service"],
            "paint": {
                "line-color": "#000",
                "line-opacity": 0.04,
                "line-dasharray": "@tunnel_dasharray",
                "line-width": "@service_casing_width",
                "line-gap-width": "@service_width"
            },
            "paint.night": {}
        }, {
            "id": "tunnel_street_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "tunnel",
            "filter": ["all", ["in", "class", "street", "street_limited"], ["==", "$type", "LineString"]],
            "paint": {
                "line-color": "@street_case",
                "line-dasharray": "@tunnel_dasharray",
                "line-width": "@street_casing_width",
                "line-gap-width": "@street_width"
            },
            "paint.night": {
                "line-color": "@street_case_night"
            }
        }, {
            "id": "tunnel_main_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "tunnel",
            "filter": ["==", "class", "main"],
            "paint": {
                "line-color": "@case",
                "line-dasharray": "@tunnel_dasharray",
                "line-width": "@main_casing_width",
                "line-gap-width": "@main_width",
                "line-opacity": {
                    "stops": [[8, 0], [9, 1]]
                }
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "tunnel_motorway_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "tunnel",
            "filter": ["==", "class", "motorway"],
            "paint": {
                "line-color": "@case",
                "line-dasharray": "@tunnel_dasharray",
                "line-width": "@motorway_casing_width",
                "line-gap-width": "@motorway_width",
                "line-opacity": {
                    "stops": [[8.5, 0], [9, 1]]
                }
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "tunnel_motorway_link",
            "ref": "tunnel_motorway_link_casing",
            "paint": {
                "line-color": "#e6cec7",
                "line-width": "@motorway_link_width"
            },
            "paint.night": {
                "line-color": "#78b0c1"
            }
        }, {
            "id": "tunnel_service",
            "ref": "tunnel_service_casing",
            "paint": {
                "line-color": "#eeeeee",
                "line-width": "@service_width"
            },
            "paint.night": {
                "line-color": "@service_night"
            }
        }, {
            "id": "tunnel_street",
            "ref": "tunnel_street_casing",
            "paint": {
                "line-color": "#eeeeee",
                "line-width": "@street_width"
            },
            "paint.night": {
                "line-color": "@street_night"
            }
        }, {
            "id": "tunnel_main",
            "ref": "tunnel_main_casing",
            "paint": {
                "line-color": "#e6cec7",
                "line-width": "@main_width",
                "line-opacity": {
                    "stops": [[5.5, 0], [6, 1]]
                }
            },
            "paint.night": {
                "line-color": "#78b0c1"
            }
        }, {
            "id": "tunnel_motorway",
            "ref": "tunnel_motorway_casing",
            "paint": {
                "line-color": "#e6cec7",
                "line-width": "@motorway_width",
                "line-opacity": {
                    "stops": [[5.5, 0], [6, 1]]
                }
            },
            "paint.night": {
                "line-color": "#78b0c1"
            }
        }, {
            "id": "tunnel_major_rail",
            "type": "line",
            "source": "mapbox",
            "source-layer": "tunnel",
            "filter": ["==", "class", "major_rail"],
            "paint": {
                "line-color": "#c8c4c0",
                "line-width": 0.8
            },
            "paint.night": {}
        }, {
            "id": "tunnel_major_rail_hatching",
            "ref": "tunnel_major_rail",
            "paint": {
                "line-color": "#c8c4c0",
                "line-dasharray": "@major_rail_hatching_dasharray",
                "line-width": "@major_rail_hatching_width"
            },
            "paint.night": {}
        }, {
            "id": "tunnel_path_all",
            "ref": "tunnel_path_bg",
            "paint": {
                "line-color": "#bba",
                "line-opacity": 0.4,
                "line-dasharray": "@path_dasharray_primary",
                "line-width": "@path_width"
            },
            "paint.night": {
                "line-color": "#fff"
            }
        }, {
            "id": "road_pedestrian",
            "type": "fill",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["all", ["==", "type", "pedestrian"], ["==", "$type", "Polygon"]],
            "paint": {
                "fill-color": "#ffd",
                "fill-opacity": 0.4
            },
            "paint.night": {
                "fill-color": "@land_night",
                "fill-opacity": 0.2
            }
        }, {
            "id": "road_path_bg",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "class", "path"],
            "paint": {
                "line-color": "#ffd",
                "line-opacity": 0.4,
                "line-width": "@path_bg_width"
            },
            "paint.night": {
                "line-color": "@land_night",
                "line-opacity": 0.2
            }
        }, {
            "id": "road_path_bg_piste",
            "ref": "road_path_piste",
            "paint": {
                "line-color": "#cce",
                "line-opacity": 0.4,
                "line-width": "@path_bg_width"
            },
            "paint.night": {
                "line-color": "@land_night",
                "line-opacity": 0.2
            }
        }, {
            "id": "road_motorway_link_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "class", "motorway_link"],
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "@case",
                "line-width": "@motorway_link_casing_width",
                "line-gap-width": "@motorway_link_width"
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "road_service_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "class", "service"],
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#000",
                "line-opacity": 0.04,
                "line-width": "@service_casing_width",
                "line-gap-width": "@service_width"
            },
            "paint.night": {}
        }, {
            "id": "road_street_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["all", ["in", "class", "street", "street_limited"], ["==", "$type", "LineString"]],
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "@street_case",
                "line-width": "@street_casing_width",
                "line-gap-width": "@street_width"
            },
            "paint.night": {
                "line-color": "@street_case_night"
            }
        }, {
            "id": "road_main_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "class", "main"],
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "@case",
                "line-width": "@main_casing_width",
                "line-gap-width": "@main_width",
                "line-opacity": {
                    "stops": [[8, 0], [9, 1]]
                }
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "road_motorway_casing_high",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "class", "motorway"],
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "@case",
                "line-width": "@motorway_casing_width",
                "line-gap-width": "@motorway_width",
                "line-opacity": {
                    "stops": [[8.5, 0], [9, 1]]
                }
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "road_motorway_link",
            "ref": "road_motorway_link_casing",
            "paint": {
                "line-color": "@motorway",
                "line-width": "@motorway_link_width"
            },
            "paint.night": {
                "line-color": "@motorway_night"
            }
        }, {
            "id": "road_service",
            "ref": "road_service_casing",
            "paint": {
                "line-color": "@street",
                "line-width": "@service_width"
            },
            "paint.night": {
                "line-color": "@street_night",
                "line-width": "@service_width"
            }
        }, {
            "id": "road_street",
            "ref": "road_street_casing",
            "paint": {
                "line-color": "@street",
                "line-width": "@street_width"
            },
            "paint.night": {
                "line-color": "@street_night"
            }
        }, {
            "id": "road_main",
            "ref": "road_main_casing",
            "paint": {
                "line-color": "@main",
                "line-width": "@main_width",
                "line-opacity": {
                    "stops": [[5.5, 0], [6, 1]]
                }
            },
            "paint.night": {
                "line-color": "@main_night"
            }
        }, {
            "id": "road_motorway_casing_low",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "maxzoom": 12,
            "filter": ["==", "class", "motorway"],
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "@case",
                "line-width": "@motorway_casing_width",
                "line-gap-width": "@motorway_width",
                "line-opacity": {
                    "stops": [[9, 0], [9.5, 1], [12, 0]]
                }
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "road_motorway",
            "ref": "road_motorway_casing_high",
            "paint": {
                "line-color": "@motorway",
                "line-width": "@motorway_width",
                "line-opacity": {
                    "stops": [[5.5, 0], [6, 1]]
                }
            },
            "paint.night": {
                "line-color": "@motorway_night"
            }
        }, {
            "id": "road_major_rail",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "class", "major_rail"],
            "paint": {
                "line-color": "#c8c4c0",
                "line-width": 0.8
            },
            "paint.night": {}
        }, {
            "id": "road_major_rail_hatching",
            "ref": "road_major_rail",
            "paint": {
                "line-color": "#c8c4c0",
                "line-dasharray": "@major_rail_hatching_dasharray",
                "line-width": "@major_rail_hatching_width"
            },
            "paint.night": {}
        }, {
            "id": "road_path_walk",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["in", "type", "footway", "path", "other"],
            "paint": {
                "line-color": "#bba",
                "line-dasharray": "@path_dasharray_primary",
                "line-width": "@path_width"
            },
            "paint.night": {
                "line-color": "#fff"
            }
        }, {
            "id": "road_path_hike",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["in", "type", "hiking", "trail"],
            "paint": {
                "line-color": "#c97",
                "line-dasharray": "@path_dasharray_secondary",
                "line-width": "@path_width"
            },
            "paint.night": {
                "line-color": "#fff"
            }
        }, {
            "id": "road_path_cycleway",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "type", "cycleway"],
            "paint": {
                "line-color": "#488",
                "line-dasharray": "@path_dasharray_primary",
                "line-width": "@path_width"
            },
            "paint.night": {
                "line-color": "#94e6ff"
            }
        }, {
            "id": "road_path_mtb",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "type", "mtb"],
            "paint": {
                "line-color": "#488",
                "line-dasharray": "@path_dasharray_secondary",
                "line-width": "@path_width"
            },
            "paint.night": {
                "line-color": "#94e6ff"
            }
        }, {
            "id": "road_path_piste",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "type", "piste"],
            "paint": {
                "line-color": "#87b",
                "line-dasharray": "@path_dasharray_primary",
                "line-width": "@path_width"
            },
            "paint.night": {
                "line-color": "#715dae"
            }
        }, {
            "id": "road_path_steps",
            "type": "line",
            "source": "mapbox",
            "source-layer": "road",
            "filter": ["==", "type", "steps"],
            "paint": {
                "line-color": "#bba",
                "line-dasharray": [0.3, 0.2],
                "line-width": "@path_steps_width"
            },
            "paint.night": {
                "line-color": "#fff"
            }
        }, {
            "id": "bridge_path_bg",
            "type": "line",
            "source": "mapbox",
            "source-layer": "bridge",
            "filter": ["==", "class", "path"],
            "paint": {
                "line-color": "#ffd",
                "line-width": "@path_bg_width"
            },
            "paint.night": {
                "line-color": "@land_night"
            }
        }, {
            "id": "bridge_motorway_link_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "bridge",
            "filter": ["==", "class", "motorway_link"],
            "paint": {
                "line-color": "@case",
                "line-width": "@motorway_link_casing_width",
                "line-gap-width": "@motorway_link_width"
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "bridge_service_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "bridge",
            "filter": ["==", "class", "service"],
            "paint": {
                "line-color": "#000",
                "line-opacity": 0.04,
                "line-width": "@service_casing_width",
                "line-gap-width": "@service_width"
            },
            "paint.night": {}
        }, {
            "id": "bridge_street_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "bridge",
            "filter": ["all", ["in", "class", "street", "street_limited"], ["==", "$type", "LineString"]],
            "paint": {
                "line-color": "@street_case",
                "line-width": "@street_casing_width",
                "line-gap-width": "@street_width"
            },
            "paint.night": {
                "line-color": "@street_case_night"
            }
        }, {
            "id": "bridge_main_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "bridge",
            "filter": ["==", "class", "main"],
            "paint": {
                "line-color": "@case",
                "line-width": "@main_casing_width",
                "line-gap-width": "@main_width",
                "line-opacity": {
                    "stops": [[8, 0], [9, 1]]
                }
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "bridge_motorway_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "bridge",
            "filter": ["==", "class", "motorway"],
            "paint": {
                "line-color": "@case",
                "line-width": "@motorway_casing_width",
                "line-gap-width": "@motorway_width",
                "line-opacity": {
                    "stops": [[8.5, 0], [9, 1]]
                }
            },
            "paint.night": {
                "line-color": "@case_night"
            }
        }, {
            "id": "bridge_motorway_link",
            "ref": "bridge_motorway_link_casing",
            "paint": {
                "line-color": "@motorway",
                "line-width": "@motorway_link_width"
            },
            "paint.night": {
                "line-color": "@motorway_night"
            }
        }, {
            "id": "bridge_service",
            "ref": "bridge_service_casing",
            "paint": {
                "line-color": "@street",
                "line-width": "@service_width"
            },
            "paint.night": {
                "line-color": "@street_night"
            }
        }, {
            "id": "bridge_street",
            "ref": "bridge_street_casing",
            "paint": {
                "line-color": "@street",
                "line-width": "@street_width"
            },
            "paint.night": {
                "line-color": "@street_night"
            }
        }, {
            "id": "bridge_main",
            "ref": "bridge_main_casing",
            "paint": {
                "line-color": "@main",
                "line-width": "@main_width",
                "line-opacity": {
                    "stops": [[5.5, 0], [6, 1]]
                }
            },
            "paint.night": {
                "line-color": "@main_night"
            }
        }, {
            "id": "bridge_motorway",
            "ref": "bridge_motorway_casing",
            "paint": {
                "line-color": "@motorway",
                "line-width": "@motorway_width",
                "line-opacity": {
                    "stops": [[5.5, 0], [6, 1]]
                }
            },
            "paint.night": {
                "line-color": "@motorway_night"
            }
        }, {
            "id": "bridge_major_rail",
            "type": "line",
            "source": "mapbox",
            "source-layer": "bridge",
            "filter": ["==", "class", "major_rail"],
            "paint": {
                "line-color": "#c8c4c0",
                "line-width": 0.8
            },
            "paint.night": {}
        }, {
            "id": "bridge_major_rail_hatching",
            "ref": "bridge_major_rail",
            "paint": {
                "line-color": "#c8c4c0",
                "line-dasharray": "@major_rail_hatching_dasharray",
                "line-width": "@major_rail_hatching_width"
            },
            "paint.night": {}
        }, {
            "id": "bridge_path_all",
            "ref": "bridge_path_bg",
            "paint": {
                "line-color": "#bba",
                "line-dasharray": "@path_dasharray_primary",
                "line-width": "@path_width"
            },
            "paint.night": {
                "line-color": "#fff"
            }
        }, {
            "id": "bridge_aerialway_casing",
            "type": "line",
            "source": "mapbox",
            "source-layer": "bridge",
            "filter": ["==", "class", "aerialway"],
            "paint": {
                "line-color": "white",
                "line-opacity": 0.5,
                "line-width": "@aerialway_casing_width",
                "line-gap-width": "@aerialway_width"
            },
            "paint.night": {
                "line-color": "#015e7a"
            }
        }, {
            "id": "bridge_aerialway",
            "ref": "bridge_aerialway_casing",
            "paint": {
                "line-color": "#876",
                "line-width": "@aerialway_width"
            },
            "paint.night": {
                "line-color": "#ffdd80"
            }
        }, {
            "id": "bridge_aerialway_hatching",
            "ref": "bridge_aerialway_casing",
            "paint": {
                "line-color": "#876",
                "line-dasharray": {
                    "stops": [[12, [0.1, 6]], [15, [0.12, 12]], [18, [0.15, 18]]]
                },
                "line-width": "@aerialway_hatching_width"
            },
            "paint.night": {
                "line-color": "#ffdd80"
            }
        }, {
            "id": "admin_l3",
            "type": "line",
            "source": "mapbox",
            "source-layer": "admin",
            "filter": ["in", "admin_level", 3, 4, 5],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "#88a",
                "line-dasharray": [3, 1],
                "line-opacity": {
                    "stops": [[3, 0], [4, 1]]
                },
                "line-width": "@admin_l3_width"
            },
            "paint.night": {
                "line-color": "@admin_night"
            }
        }, {
            "id": "admin_l2",
            "type": "line",
            "source": "mapbox",
            "source-layer": "admin",
            "filter": ["==", "admin_level", 2],
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#88a",
                "line-width": "@admin_l2_width"
            },
            "paint.night": {
                "line-color": "@admin_night"
            }
        }, {
            "id": "admin_maritime_cover",
            "type": "line",
            "source": "mapbox",
            "source-layer": "admin",
            "filter": ["==", "maritime", 1],
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "@water",
                "line-width": 5
            },
            "paint.night": {
                "line-color": "@water_night"
            }
        }, {
            "id": "admin_maritime",
            "ref": "admin_maritime_cover",
            "paint": {
                "line-color": "#c0d6d6",
                "line-width": {
                    "stops": [[5, 1], [7, 2], [11, 3]]
                }
            },
            "paint.night": {
                "line-color": "#0a1347"
            }
        }, {
            "id": "country_label",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "country_label",
            "filter": ["==", "$type", "Point"],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans",
                "text-max-size": 20,
                "text-max-width": 6
            },
            "paint": {
                "text-color": "@country_text",
                "text-halo-color": "@text_halo",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-size": "@country_label_size"
            },
            "paint.night": {
                "text-color": "@text_night",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "marine_label_line_1",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "marine_label",
            "filter": ["all", ["==", "$type", "LineString"], ["==", "labelrank", 1]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 30,
                "text-letter-spacing": 0.4,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "@marine_text",
                "text-halo-color": "@water",
                "text-size": {
                    "stops": [[3, 25], [4, 30]]
                }
            },
            "paint.night": {
                "text-color": "@water_dark_night",
                "text-halo-color": "@water_night"
            }
        }, {
            "id": "marine_label_line_2",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "marine_label",
            "filter": ["all", ["==", "$type", "LineString"], ["==", "labelrank", 2]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 24,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "@marine_text",
                "text-halo-color": "@water",
                "text-size": {
                    "base": 0.8,
                    "stops": [[3, 14], [5, 24]]
                }
            },
            "paint.night": {
                "text-color": "@water_dark_night",
                "text-halo-color": "@water_night"
            }
        }, {
            "id": "marine_label_line_3",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "marine_label",
            "filter": ["all", ["==", "$type", "LineString"], ["==", "labelrank", 3]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 18,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "@marine_text",
                "text-halo-color": "@water",
                "text-size": {
                    "base": 1.2,
                    "stops": [[3, 13], [5, 18]]
                }
            },
            "paint.night": {
                "text-color": "@water_dark_night",
                "text-halo-color": "@water_night"
            }
        }, {
            "id": "marine_label_line_other",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "marine_label",
            "filter": ["all", ["==", "$type", "LineString"], ["in", "labelrank", 4, 5, 6]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 16,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "@marine_text",
                "text-halo-color": "@water",
                "text-size": {
                    "stops": [[4, 12], [6, 16]]
                }
            },
            "paint.night": {
                "text-color": "@water_dark_night",
                "text-halo-color": "@water_night"
            }
        }, {
            "id": "marine_label_point_1",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "marine_label",
            "filter": ["all", ["==", "$type", "Point"], ["==", "labelrank", 1]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 30,
                "text-max-width": 8,
                "text-letter-spacing": 0.4,
                "text-line-height": 2
            },
            "paint": {
                "text-color": "@marine_text",
                "text-halo-color": "@water",
                "text-size": {
                    "stops": [[3, 25], [4, 30]]
                }
            },
            "paint.night": {
                "text-color": "@water_dark_night",
                "text-halo-color": "@water_night"
            }
        }, {
            "id": "marine_label_point_2",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "marine_label",
            "filter": ["all", ["==", "$type", "Point"], ["==", "labelrank", 2]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 24,
                "text-max-width": 8,
                "text-letter-spacing": 0.2,
                "text-line-height": 1.5
            },
            "paint": {
                "text-color": "@marine_text",
                "text-halo-color": "@water",
                "text-size": {
                    "base": 0.8,
                    "stops": [[3, 14], [5, 24]]
                }
            },
            "paint.night": {
                "text-color": "@water_dark_night",
                "text-halo-color": "@water_night"
            }
        }, {
            "id": "marine_label_point_3",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "marine_label",
            "filter": ["all", ["==", "$type", "Point"], ["==", "labelrank", 3]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 18,
                "text-max-width": 8,
                "text-letter-spacing": 0.1,
                "text-line-height": 1.3
            },
            "paint": {
                "text-color": "@marine_text",
                "text-halo-color": "@water",
                "text-size": {
                    "base": 1.2,
                    "stops": [[3, 13], [5, 18]]
                }
            },
            "paint.night": {
                "text-color": "@water_dark_night",
                "text-halo-color": "@water_night"
            }
        }, {
            "id": "marine_label_point_other",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "marine_label",
            "filter": ["all", ["==", "$type", "Point"], ["in", "labelrank", 4, 5, 6]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 16,
                "text-max-width": 8,
                "text-letter-spacing": 0.1,
                "text-line-height": 1.2
            },
            "paint": {
                "text-color": "@marine_text",
                "text-halo-color": "@water",
                "text-size": {
                    "stops": [[4, 12], [6, 16]]
                }
            },
            "paint.night": {
                "text-color": "@water_dark_night",
                "text-halo-color": "@water_night"
            }
        }, {
            "id": "state_label",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "state_label",
            "maxzoom": 9,
            "filter": ["==", "$type", "Point"],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_lt",
                "text-max-size": 16,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#333",
                "text-halo-color": "rgba(244,239,225,0.8)",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": {
                    "stops": [[4, 12], [9, 16]]
                }
            },
            "paint.night": {
                "text-color": "#fff",
                "text-halo-color": "@land_night"
            }
        }, {
            "id": "place_label_city_l",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "place_label",
            "maxzoom": 14,
            "filter": ["all", ["==", "type", "city"], ["<=", "scalerank", 3], ["==", "$type", "Point"]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans",
                "text-max-size": 20,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#4a4032",
                "text-halo-color": "@text_halo",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": {
                    "stops": [[4, 11], [10, 20]]
                }
            },
            "paint.night": {
                "text-color": "#fff",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "place_label_city_s",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "place_label",
            "maxzoom": 14,
            "filter": ["all", ["==", "type", "city"], ["!in", "scalerank", 0, 1, 2, 3], ["==", "$type", "Point"]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans",
                "text-max-size": 20,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#4a4032",
                "text-halo-color": "@text_halo",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": {
                    "stops": [[4, 10], [14, 20]]
                }
            },
            "paint.night": {
                "text-color": "#fff",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "place_label_town",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "place_label",
            "minzoom": 7,
            "maxzoom": 16,
            "filter": ["all", ["==", "type", "town"], ["==", "$type", "Point"]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_lt",
                "text-max-size": 24,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#716656",
                "text-halo-color": "@text_stroke",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": {
                    "base": 1.1,
                    "stops": [[9, 12], [15, 22]]
                }
            },
            "paint.night": {
                "text-color": "@text_night",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "place_label_village",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "place_label",
            "maxzoom": 16,
            "filter": ["all", ["==", "type", "village"], ["==", "$type", "Point"]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans",
                "text-max-size": 20,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "#635644",
                "text-halo-color": "@text_stroke",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": {
                    "base": 1.1,
                    "stops": [[10, 11], [16, 20]]
                }
            },
            "paint.night": {
                "text-color": "@text_night",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "place_label_other",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "place_label",
            "maxzoom": 17,
            "filter": ["all", ["in", "type", "hamlet", "suburb", "neighbourhood"], ["==", "$type", "Point"]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_lt",
                "text-max-size": 18,
                "text-max-width": 6
            },
            "paint": {
                "text-color": "#7d6c55",
                "text-halo-color": "@text_stroke",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-size": {
                    "base": 1.1,
                    "stops": [[12, 11], [17, 20]]
                }
            },
            "paint.night": {
                "text-color": "@text_night",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "road_label_1",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "road_label",
            "filter": ["all", ["in", "class", "motorway", "main"], ["==", "$type", "LineString"]],
            "layout": {
                "text-field": "@name",
                "text-padding": 2,
                "text-font": "@sans_lt",
                "text-max-size": 18,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "#585042",
                "text-halo-color": "@land",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": "@road_label_1_size"
            },
            "paint.night": {
                "text-color": "@text_night",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "road_label_2",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "road_label",
            "filter": ["all", ["in", "class", "street", "street_limited"], ["==", "$type", "LineString"]],
            "layout": {
                "text-field": "@name",
                "text-padding": 2,
                "text-font": "@sans_lt",
                "text-max-size": 16,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "#585042",
                "text-halo-color": "@land",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": "@road_label_2_size"
            },
            "paint.night": {
                "text-color": "@text_night",
                "text-halo-color": "@text2_stroke_night",
                "text-size": "@road_label_2_size"
            }
        }, {
            "id": "road_label_3",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "road_label",
            "filter": ["all", ["in", "class", "service", "driveway", "path"], ["==", "$type", "LineString"]],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans",
                "text-padding": 2,
                "text-max-size": 14,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "#585042",
                "text-halo-color": "@land",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": "@road_label_3_size"
            },
            "paint.night": {
                "text-color": "@text_night",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "contour_label",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "contour",
            "filter": ["in", "index", 5, 10],
            "layout": {
                "text-field": "{ele} m",
                "text-font": "@sans_lt",
                "text-max-size": 10,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "@text",
                "text-halo-color": "@land",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-size": 10
            },
            "paint.night": {
                "text-color": "@contour_night",
                "text-halo-color": "@land_night"
            }
        }, {
            "id": "water_label",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "water_label",
            "filter": ["==", "$type", "Point"],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 14,
                "text-max-width": 8
            },
            "paint": {
                "text-color": "@water_dark",
                "text-halo-color": "@text_halo",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5,
                "text-size": {
                    "stops": [[13, 12], [14, 14]]
                }
            },
            "paint.night": {
                "text-color": "@text_water_night",
                "text-halo-color": "@water_night",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
        }, {
            "id": "waterway_label",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "waterway_label",
            "filter": ["==", "$type", "LineString"],
            "layout": {
                "text-field": "@name",
                "text-font": "@sans_italic",
                "text-max-size": 12,
                "symbol-placement": "line"
            },
            "paint": {
                "text-color": "@water_dark",
                "text-halo-color": "@text_halo",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.5
            },
            "paint.night": {
                "text-color": "@text_water_night",
                "text-halo-color": "@water_night",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
        }, {
            "id": "poi_label_1-2",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "poi_label",
            "minzoom": 6,
            "filter": ["all", ["in", "scalerank", 1, 2], ["==", "$type", "Point"]],
            "layout": {
                "icon-image": "{maki}-12",
                "text-field": "@name",
                "text-font": "@sans",
                "text-max-size": 12,
                "text-max-width": 10,
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            },
            "paint": {
                "text-color": "#444",
                "text-halo-color": "@land",
                "text-size": "@poi_label_1-2_size",
                "text-halo-width": 1.5
            },
            "paint.night": {
                "text-color": "#fff",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "poi_label_3",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "poi_label",
            "minzoom": 15,
            "filter": ["all", ["==", "scalerank", 3], ["==", "$type", "Point"]],
            "layout": {
                "icon-image": "{maki}-12",
                "text-field": "@name",
                "text-font": "@sans",
                "text-max-size": 11,
                "text-max-width": 10,
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            },
            "paint": {
                "text-color": "#444",
                "text-halo-color": "@land",
                "text-size": "@poi_label_3_size",
                "text-halo-width": 1.5
            },
            "paint.night": {
                "text-color": "#fff",
                "text-halo-color": "@text2_stroke_night"
            }
        }, {
            "id": "poi_label_4",
            "type": "symbol",
            "source": "mapbox",
            "source-layer": "poi_label",
            "minzoom": 16,
            "filter": ["all", ["==", "scalerank", 4], ["==", "$type", "Point"]],
            "layout": {
                "icon-image": "{maki}-12",
                "text-field": "@name",
                "text-font": "@sans",
                "text-max-size": 10,
                "text-max-width": 10,
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            },
            "paint": {
                "text-color": "#444",
                "text-halo-color": "@land",
                "text-size": 10,
                "text-halo-width": 1.5
            },
            "paint.night": {
                "text-color": "#fff",
                "text-halo-color": "@text2_stroke_night"
            }
        }]
    };

    return outdoors;
});

mapApp.controller('mapSearch', function($scope,$http){

    var key = '8a42c3b94f75755558242e0875448c1a';
    var googlekey = 'AIzaSyDTG4khVRJjxVj9XN6uLE2n40uzPXzEVZ8';

    $scope.searchQuery = '';

    $scope.goToLocation = function(long,lat){
        $scope.map.flyTo([lat,long], 13);
        $scope.results = {};
    };

    $scope.changeSearchText = function(text){
        $scope.searchQuery = text;
    };

    $scope.getGoogleSearchData = function(){
        $scope.results = {};
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI($scope.searchQuery);
        $http.get(url).
            success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
                console.log(url);
                $scope.results = data;

            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
            });
    };

    $scope.getSearchData = function() {
        $scope.results = {};
        var url = 'https://api.opencagedata.com/geocode/v1/geojson?q=' + encodeURI($scope.searchQuery) + '&key=' + key + '&pretty=1';
        $http.get(url).
            success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
                console.log(url);
                $scope.results = data;

            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
            });
    };

});
