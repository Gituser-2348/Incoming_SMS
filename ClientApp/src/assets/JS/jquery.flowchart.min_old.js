$(function () {
    $.widget("flowchart.flowchart", {
        options: {
            canUserEditLinks: !0,
            canUserMoveOperators: !0,
            data: {},
            distanceFromArrow: 3,
            defaultOperatorClass: "flowchart-default-operator",
            defaultLinkColor: "#3366ff",
            defaultSelectedLinkColor: "black",
            linkWidth: 4,
            grid: 20,
            multipleLinksOnOutput: !1,
            multipleLinksOnInput: !1,
            linkVerticalDecal: 0,
            onOperatorSelect: function (t) {
                return !0;
            },
            onOperatorUnselect: function () {
                return !0;
            },
            onOperatorMouseOver: function (t) {
                return !0;
            },
            onOperatorMouseOut: function (t) {
                return !0;
            },
            onLinkSelect: function (t) {
                return !0;
            },
            onLinkUnselect: function () {
                return !0;
            },
            onOperatorCreate: function (t, e, r) {
                return !0;
            },
            onLinkCreate: function (t, e) {
                return !0;
            },
            onOperatorDelete: function (t) {
                return !0;
            },
            onLinkDelete: function (t, e) {
                return !0;
            },
            onOperatorMoved: function (t, e) { },
            onAfterChange: function (t) { },
        },
        data: null,
        objs: null,
        maskNum: 0,
        linkNum: 0,
        operatorNum: 0,
        lastOutputConnectorClicked: null,
        selectedOperatorId: null,
        selectedLinkId: null,
        positionRatio: 1,
        globalId: null,
        _create: function () {
            "undefined" == typeof document.__flowchartNumber ? (document.__flowchartNumber = 0) : document.__flowchartNumber++,
                (this.globalId = document.__flowchartNumber),
                this._unitVariables(),
                this.element.addClass("flowchart-container"),
                (this.objs.layers.links = $('<svg class="flowchart-links-layer"></svg>')),
                this.objs.layers.links.appendTo(this.element),
                (this.objs.layers.operators = $('<div class="flowchart-operators-layer unselectable"></div>')),
                this.objs.layers.operators.appendTo(this.element),
                (this.objs.layers.temporaryLink = $('<svg class="flowchart-temporary-link-layer"></svg>')),
                this.objs.layers.temporaryLink.appendTo(this.element);
            var t = document.createElementNS("http://www.w3.org/2000/svg", "line");
            t.setAttribute("x1", "0"),
                t.setAttribute("y1", "0"),
                t.setAttribute("x2", "0"),
                t.setAttribute("y2", "0"),
                t.setAttribute("stroke-dasharray", "6,6"),
                t.setAttribute("stroke-width", "4"),
                t.setAttribute("stroke", "black"),
                t.setAttribute("fill", "none"),
                this.objs.layers.temporaryLink[0].appendChild(t),
                (this.objs.temporaryLink = t),
                this._initEvents(),
                "undefined" != typeof this.options.data && this.setData(this.options.data);
        },
        _unitVariables: function () {
            (this.data = { operators: {}, links: {} }), (this.objs = { layers: { operators: null, temporaryLink: null, links: null }, linksContext: null, temporaryLink: null });
        },
        _initEvents: function () {
            var t = this;
            this.element.mousemove(function (e) {
                var r = $(this),
                    o = r.offset();
                t._mousemove((e.pageX - o.left) / t.positionRatio, (e.pageY - o.top) / t.positionRatio, e);
            }),
                this.element.click(function (e) {
                    var r = $(this),
                        o = r.offset();
                    t._click((e.pageX - o.left) / t.positionRatio, (e.pageY - o.top) / t.positionRatio, e);
                }),
                this.objs.layers.operators.on("pointerdown mousedown touchstart", ".flowchart-operator", function (t) {
                    t.stopImmediatePropagation();
                }),
                this.objs.layers.operators.on("click", ".flowchart-operator", function (e) {
                    0 == $(e.target).closest(".flowchart-operator-connector").length && t.selectOperator($(this).data("operator_id"));
                }),
                this.objs.layers.operators.on("click", ".flowchart-operator-connector", function () {
                    var e = $(this);
                    t.options.canUserEditLinks &&
                        t._connectorClicked(e.closest(".flowchart-operator").data("operator_id"), e.data("connector"), e.data("sub_connector"), e.closest(".flowchart-operator-connector-set").data("connector_type"));
                }),
                this.objs.layers.links.on("mousedown touchstart", ".flowchart-link", function (t) {
                    t.stopImmediatePropagation();
                }),
                this.objs.layers.links.on("mouseover", ".flowchart-link", function () {
                    t._connecterMouseOver($(this).data("link_id"));
                }),
                this.objs.layers.links.on("mouseout", ".flowchart-link", function () {
                    t._connecterMouseOut($(this).data("link_id"));
                }),
                this.objs.layers.links.on("click", ".flowchart-link", function () {
                    t.selectLink($(this).data("link_id"));
                }),
                this.objs.layers.operators.on("mouseover", ".flowchart-operator", function (e) {
                    t._operatorMouseOver($(this).data("operator_id"));
                }),
                this.objs.layers.operators.on("mouseout", ".flowchart-operator", function (e) {
                    t._operatorMouseOut($(this).data("operator_id"));
                });
        },
        setData: function (t) {
            this._clearOperatorsLayer(), (this.data.operatorTypes = {}), "undefined" != typeof t.operatorTypes && (this.data.operatorTypes = t.operatorTypes), (this.data.operators = {});
            for (var e in t.operators) t.operators.hasOwnProperty(e) && this.createOperator(e, t.operators[e]);
            this.data.links = {};
            for (var r in t.links) t.links.hasOwnProperty(r) && this.createLink(r, t.links[r]);
            this.redrawLinksLayer();
        },
        addLink: function (t) {
            console.log(t);

            for (; "undefined" != typeof this.data.links[this.linkNum];) this.linkNum++;
            return this.createLink(this.linkNum, t), this.linkNum;
        },
        createLink: function (t, e) {
            var r = $.extend(!0, {}, e);
            if (this.callbackEvent("linkCreate", [t, r])) {
                var o = this._getSubConnectors(r),
                    n = o[0],
                    a = o[1],
                    i = this.options.multipleLinksOnOutput,
                    s = this.options.multipleLinksOnInput;
                if (!i || !s)
                    for (var l in this.data.links)
                        if (this.data.links.hasOwnProperty(l)) {
                            var c = this.data.links[l],
                                p = this._getSubConnectors(c),
                                u = p[0],
                                h = p[1];
                            if (!i && c.fromOperator == r.fromOperator && c.fromConnector == r.fromConnector && u == n) {
                                this.deleteLink(l);
                                continue;
                            }
                            s || c.toOperator != r.toOperator || c.toConnector != r.toConnector || h != a || this.deleteLink(l);
                        }
                this._autoCreateSubConnector(r.fromOperator, r.fromConnector, "outputs", n),
                    this._autoCreateSubConnector(r.toOperator, r.toConnector, "inputs", a),
                    (this.data.links[t] = r),
                    this._drawLink(t),
                    this.callbackEvent("afterChange", ["link_create"]);
            }
        },
        _autoCreateSubConnector: function (t, e, r, o) {
            var n = this.data.operators[t].properties[r][e];
            if (n.multiple) for (var a = this.data.operators[t].internal.els, i = this.data.operators[t].internal.els.connectors[e].length, s = i; o + 2 > s; s++) this._createSubConnector(e, n, a);
        },
        redrawLinksLayer: function () {
            this._clearLinksLayer();
            for (var t in this.data.links) this.data.links.hasOwnProperty(t) && this._drawLink(t);
        },
        _clearLinksLayer: function () {
            this.objs.layers.links.empty(), this.objs.layers.operators.find(".flowchart-operator-connector-small-arrow").css("border-left-color", "transparent");
        },
        _clearOperatorsLayer: function () {
            this.objs.layers.operators.empty();
        },
        getConnectorPosition: function (t, e, r) {
            var o = this.data.operators[t],
                n = o.internal.els.connectorArrows[e][r],
                a = n.offset(),
                i = this.element.offset(),
                s = (a.left - i.left) / this.positionRatio,
                l = parseInt(n.css("border-top-width")),
                c = (a.top - i.top - 1) / this.positionRatio + parseInt(n.css("border-left-width"));
            return { x: s, width: l, y: c };
        },
        getLinkMainColor: function (t) {
            var e = this.options.defaultLinkColor,
                r = this.data.links[t];
            return "undefined" != typeof r.color && (e = r.color), e;
        },
        setLinkMainColor: function (t, e) {
            (this.data.links[t].color = e), this.callbackEvent("afterChange", ["link_change_main_color"]);
        },
        _drawLink: function (t) {
            var e = this.data.links[t];
            "undefined" == typeof e.internal && (e.internal = {}), (e.internal.els = {});
            var r = e.fromOperator,
                o = e.fromConnector,
                n = e.toOperator,
                a = e.toConnector,
                i = this._getSubConnectors(e),
                s = i[0],
                l = i[1],
                p = (this.getLinkMainColor(t), this.data.operators[r]),
                u = this.data.operators[n],
                h = p.internal.els.connectorSmallArrows[o][s],
                d = u.internal.els.connectorSmallArrows[a][l];
            (e.internal.els.fromSmallConnector = h), (e.internal.els.toSmallConnector = d);
            var f = document.createElementNS("http://www.w3.org/2000/svg", "g");
            this.objs.layers.links[0].appendChild(f), (e.internal.els.overallGroup = f);
            var v = document.createElementNS("http://www.w3.org/2000/svg", "mask"),
                k = "fc_mask_" + this.globalId + "_" + this.maskNum;
            this.maskNum++, v.setAttribute("id", k), f.appendChild(v);
            var m = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            m.setAttribute("x", "0"), m.setAttribute("y", "0"), m.setAttribute("width", "100%"), m.setAttribute("height", "100%"), m.setAttribute("stroke", "none"), m.setAttribute("fill", "white"), v.appendChild(m);
            var C = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            C.setAttribute("stroke", "none"), C.setAttribute("fill", "black"), v.appendChild(C), (e.internal.els.mask = C);
            var b = document.createElementNS("http://www.w3.org/2000/svg", "g");
            b.setAttribute("class", "flowchart-link"), b.setAttribute("data-link_id", t), f.appendChild(b);
            var w = document.createElementNS("http://www.w3.org/2000/svg", "path");
            w.setAttribute("stroke-width", this.options.linkWidth.toString()), w.setAttribute("fill", "none"), b.appendChild(w), (e.internal.els.path = w);
            var O = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            O.setAttribute("stroke", "none"), O.setAttribute("mask", "url(#" + k + ")"), b.appendChild(O), (e.internal.els.rect = O), this._refreshLinkPositions(t), this.uncolorizeLink(t);
        },
        _getSubConnectors: function (t) {
            var e = 0;
            "undefined" != typeof t.fromSubConnector && (e = t.fromSubConnector);
            var r = 0;
            return "undefined" != typeof t.toSubConnector && (r = t.toSubConnector), [e, r];
        },
        _refreshLinkPositions: function (t) {
            var e = this.data.links[t],
                r = this._getSubConnectors(e),
                o = r[0],
                n = r[1],
                a = this.getConnectorPosition(e.fromOperator, e.fromConnector, o),
                i = this.getConnectorPosition(e.toOperator, e.toConnector, n),
                s = a.x,
                l = a.width,
                c = a.y,
                p = i.x,
                u = i.y;
            (c += this.options.linkVerticalDecal), (u += this.options.linkVerticalDecal);
            var h = this.options.distanceFromArrow;
            e.internal.els.mask.setAttribute("points", s + "," + (c - l - h) + " " + (s + l + h) + "," + c + " " + s + "," + (c + l + h));
            var d = s + l + h,
                f = p + 1,
                v = Math.min(20, Math.max(Math.abs(d - f) / 2, Math.abs(c - u)));
            e.internal.els.path.setAttribute("d", "M" + d + "," + c + " L" + (s + l + h + v) + "," + c + " " + (p - v) + "," + u + " " + f + "," + u),
                e.internal.els.rect.setAttribute("x", s),
                e.internal.els.rect.setAttribute("y", c - this.options.linkWidth / 2),
                e.internal.els.rect.setAttribute("width", l + h + 1),
                e.internal.els.rect.setAttribute("height", this.options.linkWidth);
        },
        getOperatorCompleteData: function (t) {
            "undefined" == typeof t.internal && (t.internal = {}), this._refreshInternalProperties(t);
            var e = $.extend(!0, {}, t.internal.properties);
            for (var r in e.inputs) e.inputs.hasOwnProperty(r) && null == e.inputs[r] && delete e.inputs[r];
            for (var o in e.outputs) e.outputs.hasOwnProperty(o) && null == e.outputs[o] && delete e.outputs[o];
            return "undefined" == typeof e["class"] && (e["class"] = this.options.defaultOperatorClass), e;
        },
        _getOperatorFullElement: function (t) {
            function d(t, e, r, o) {
                var n = $('<div class="flowchart-operator-connector-set"></div>');
                n.data("connector_type", o), n.appendTo(r), (l[t] = []), (c[t] = []), (u[t] = []), (p[t] = n), s._createSubConnector(t, e, h);
            }
            var e = this.getOperatorCompleteData(t),
                r = $('<div class="flowchart-operator" id=' + t.id + ' (click)="deleteOperationOrLink()"></div>');
            r.addClass(e["class"]);

            var header = $('<div class="flowchart-operator-header"></div>');
            header.appendTo(r);
            var icon = $('<div class="flowchart-operator-header-icon material-icons">'+ t.icon +'</div>');
            icon.appendTo(header);
            var o = $('<div class="flowchart-operator-title"></div>');
            o.html(e.title), o.appendTo(header);

            var m = $('<div class="flowchart-operator-title"></div>');
            m.html(e.desc), m.appendTo(r);
            var n = $('<div class="flowchart-operator-inputs-outputs"></div>');
            n.appendTo(r);
            var a = $('<div class="flowchart-operator-inputs"></div>');
            a.appendTo(n);
            var i = $('<div class="flowchart-operator-outputs"></div>');
            i.appendTo(n);
            var s = this,
                l = {},
                c = {},
                p = {},
                u = {},
                h = { operator: r, title: o, connectorSets: p, connectors: u, connectorArrows: l, connectorSmallArrows: c };
            for (var f in e.inputs) e.inputs.hasOwnProperty(f) && d(f, e.inputs[f], a, "inputs");
            for (var v in e.outputs) e.outputs.hasOwnProperty(v) && d(v, e.outputs[v], i, "outputs");
            return h;
        },
        _createSubConnector: function (t, e, r) {
            var o = r.connectorSets[t],
                n = r.connectors[t].length,
                a = $('<div class="flowchart-operator-connector"></div>');
            a.appendTo(o), a.data("connector", t), a.data("sub_connector", n);
            var i = $('<div class="flowchart-operator-connector-label"></div>');
            i.text(e.label.replace("(:i)", n + 1)), i.appendTo(a);
            var s = $('<div class="flowchart-operator-connector-arrow"></div>');
            s.appendTo(a);
            var l = $('<div class="flowchart-operator-connector-small-arrow"></div>');
            l.appendTo(a), r.connectors[t].push(a), r.connectorArrows[t].push(s), r.connectorSmallArrows[t].push(l);
        },
        getOperatorElement: function (t) {
            var e = this._getOperatorFullElement(t);
            return e.operator;
        },
        addOperator: function (t) {
            for (; "undefined" != typeof this.data.operators[this.operatorNum];) this.operatorNum++;
            return this.createOperator(this.operatorNum, t), this.operatorNum;
        },
        createOperator: function (t, e) {
            function a(t, r) {
                (e.top = r.top), (e.left = r.left);
                for (var o in n.data.links)
                    if (n.data.links.hasOwnProperty(o)) {
                        var a = n.data.links[o];
                        (a.fromOperator == t || a.toOperator == t) && n._refreshLinkPositions(o);
                    }
            }
            (e.internal = {}), this._refreshInternalProperties(e);
            var r = this._getOperatorFullElement(e);
            if (!this.callbackEvent("operatorCreate", [t, e, r])) return !1;
            var o = this.options.grid;
            o && ((e.top = Math.round(e.top / o) * o), (e.left = Math.round(e.left / o) * o)),
                r.operator.appendTo(this.objs.layers.operators),
                r.operator.css({ top: e.top, left: e.left }),
                r.operator.data("operator_id", t),
                (this.data.operators[t] = e),
                (this.data.operators[t].internal.els = r),
                t == this.selectedOperatorId && this._addSelectedClass(t);
            var n = this;
            if (this.options.canUserMoveOperators) {
                var i, s;
                r.operator.draggable({
                    containment: e.internal.properties.uncontained ? !1 : this.element,
                    handle: ".flowchart-operator-header",
                    start: function (t, e) {
                        if (null != n.lastOutputConnectorClicked) return void t.preventDefault();
                        var r = n.element.offset();
                        (i = (t.pageX - r.left) / n.positionRatio - parseInt($(t.target).css("left"))), (s = (t.pageY - r.top) / n.positionRatio - parseInt($(t.target).css("top")));
                    },
                    drag: function (t, o) {
                        if (n.options.grid) {
                            var l = n.options.grid,
                                c = n.element.offset();
                            if (((o.position.left = Math.round(((t.pageX - c.left) / n.positionRatio - i) / l) * l), (o.position.top = Math.round(((t.pageY - c.top) / n.positionRatio - s) / l) * l), !e.internal.properties.uncontained)) {
                                var p = $(this);
                                (o.position.left = Math.min(Math.max(o.position.left, 0), n.element.width() - p.outerWidth())), (o.position.top = Math.min(Math.max(o.position.top, 0), n.element.height() - p.outerHeight()));
                            }
                            (o.offset.left = Math.round(o.position.left + c.left)), (o.offset.top = Math.round(o.position.top + c.top)), r.operator.css({ left: o.position.left, top: o.position.top });
                        }
                        a($(this).data("operator_id"), o.position);
                    },
                    stop: function (t, e) {
                        n._unsetTemporaryLink();
                        var o = $(this).data("operator_id");
                        a(o, e.position), r.operator.css({ height: "auto" }), n.callbackEvent("operatorMoved", [o, e.position]), n.callbackEvent("afterChange", ["operator_moved"]);
                    },
                });
            }
            this.callbackEvent("afterChange", ["operator_create"]);
        },
        _connectorClicked: function (t, e, r, o) {
            if ("outputs" == o) {
                new Date();
                (this.lastOutputConnectorClicked = { operator: t, connector: e, subConnector: r }), this.objs.layers.temporaryLink.show();
                var a = this.getConnectorPosition(t, e, r),
                    i = a.x + a.width,
                    s = a.y;
                this.objs.temporaryLink.setAttribute("x1", i.toString()), this.objs.temporaryLink.setAttribute("y1", s.toString()), this._mousemove(i, s);
            }
            if ("inputs" == o && null != this.lastOutputConnectorClicked) {
                var l = {
                    fromOperator: this.lastOutputConnectorClicked.operator,
                    fromConnector: this.lastOutputConnectorClicked.connector,
                    fromSubConnector: this.lastOutputConnectorClicked.subConnector,
                    toOperator: t,
                    toConnector: e,
                    toSubConnector: r,
                };
                this.addLink(l), this._unsetTemporaryLink();
            }
        },
        _unsetTemporaryLink: function () {
            (this.lastOutputConnectorClicked = null), this.objs.layers.temporaryLink.hide();
        },
        _mousemove: function (t, e, r) {
            null != this.lastOutputConnectorClicked && (this.objs.temporaryLink.setAttribute("x2", t), this.objs.temporaryLink.setAttribute("y2", e));
        },
        _click: function (t, e, r) {
            var o = $(r.target);
            0 == o.closest(".flowchart-operator-connector").length && this._unsetTemporaryLink(), 0 == o.closest(".flowchart-operator").length && this.unselectOperator(), 0 == o.closest(".flowchart-link").length && this.unselectLink();
        },
        _removeSelectedClassOperators: function () {
            this.objs.layers.operators.find(".flowchart-operator").removeClass("selected");
        },
        unselectOperator: function () {
            if (null != this.selectedOperatorId) {
                if (!this.callbackEvent("operatorUnselect", [])) return;
                this._removeSelectedClassOperators(), (this.selectedOperatorId = null);
            }
        },
        _addSelectedClass: function (t) {
            this.data.operators[t].internal.els.operator.addClass("selected");
        },
        callbackEvent: function (t, e) {
            var r = "on" + t.charAt(0).toUpperCase() + t.slice(1),
                o = this.options[r].apply(this, e);
            if (o !== !1) {
                var n = { result: o };
                this.element.trigger(t, e.concat([n])), (o = n.result);
            }
            return o;
        },
        selectOperator: function (t) {
            this.callbackEvent("operatorSelect", [t]) && (this.unselectLink(), this._removeSelectedClassOperators(), this._addSelectedClass(t), (this.selectedOperatorId = t));
        },
        addClassOperator: function (t, e) {
            this.data.operators[t].internal.els.operator.addClass(e);
        },
        removeClassOperator: function (t, e) {
            this.data.operators[t].internal.els.operator.removeClass(e);
        },
        removeClassOperators: function (t) {
            this.objs.layers.operators.find(".flowchart-operator").removeClass(t);
        },
        _addHoverClassOperator: function (t) {
            this.data.operators[t].internal.els.operator.addClass("hover");
        },
        _removeHoverClassOperators: function () {
            this.objs.layers.operators.find(".flowchart-operator").removeClass("hover");
        },
        _operatorMouseOver: function (t) {
            this.callbackEvent("operatorMouseOver", [t]) && this._addHoverClassOperator(t);
        },
        _operatorMouseOut: function (t) {
            this.callbackEvent("operatorMouseOut", [t]) && this._removeHoverClassOperators();
        },
        getSelectedOperatorId: function () {
            return this.selectedOperatorId;
        },
        getSelectedLinkId: function () {
            return this.selectedLinkId;
        },
        _shadeColor: function (t, e) {
            var r = parseInt(t.slice(1), 16),
                o = 0 > e ? 0 : 255,
                n = 0 > e ? -1 * e : e,
                a = r >> 16,
                i = (r >> 8) & 255,
                s = 255 & r;
            return "#" + (16777216 + 65536 * (Math.round((o - a) * n) + a) + 256 * (Math.round((o - i) * n) + i) + (Math.round((o - s) * n) + s)).toString(16).slice(1);
        },
        colorizeLink: function (t, e) {
            var r = this.data.links[t];
            r.internal.els.path.setAttribute("stroke", e), r.internal.els.rect.setAttribute("fill", e), r.internal.els.fromSmallConnector.css("border-left-color", e), r.internal.els.toSmallConnector.css("border-left-color", e);
        },
        uncolorizeLink: function (t) {
            this.colorizeLink(t, this.getLinkMainColor(t));
        },
        _connecterMouseOver: function (t) {
            this.selectedLinkId != t && this.colorizeLink(t, this._shadeColor(this.getLinkMainColor(t), -0.4));
        },
        _connecterMouseOut: function (t) {
            this.selectedLinkId != t && this.uncolorizeLink(t);
        },
        unselectLink: function () {
            if (null != this.selectedLinkId) {
                if (!this.callbackEvent("linkUnselect", [])) return;
                this.uncolorizeLink(this.selectedLinkId, this.options.defaultSelectedLinkColor), (this.selectedLinkId = null);
            }
        },
        selectLink: function (t) {
            this.unselectLink(), this.callbackEvent("linkSelect", [t]) && (this.unselectOperator(), (this.selectedLinkId = t), this.colorizeLink(t, this.options.defaultSelectedLinkColor));
        },
        deleteOperator: function (t) {
            this._deleteOperator(t, !1);
        },
        _deleteOperator: function (t, e) {
            if (!this.callbackEvent("operatorDelete", [t, e])) return !1;
            if (!e)
                for (var r in this.data.links)
                    if (this.data.links.hasOwnProperty(r)) {
                        var o = this.data.links[r];
                        (o.fromOperator == t || o.toOperator == t) && this._deleteLink(r, !0);
                    }
            e || t != this.selectedOperatorId || this.unselectOperator(), this.data.operators[t].internal.els.operator.remove(), delete this.data.operators[t], this.callbackEvent("afterChange", ["operator_delete"]);
        },
        deleteLink: function (t) {
            this._deleteLink(t, !1);
        },
        _deleteLink: function (t, e) {
            if ((this.selectedLinkId == t && this.unselectLink(), this.callbackEvent("linkDelete", [t, e]) || e)) {
                this.colorizeLink(t, "transparent");
                var r = this.data.links[t],
                    o = r.fromOperator,
                    n = r.fromConnector,
                    a = r.toOperator,
                    i = r.toConnector;
                r.internal.els.overallGroup.remove(), delete this.data.links[t], this._cleanMultipleConnectors(o, n, "from"), this._cleanMultipleConnectors(a, i, "to"), this.callbackEvent("afterChange", ["link_delete"]);
            }
        },
        _cleanMultipleConnectors: function (t, e, r) {
            if (this.data.operators[t].properties["from" == r ? "outputs" : "inputs"][e].multiple) {
                var o = -1,
                    n = r + "Operator",
                    a = r + "Connector",
                    i = r + "SubConnector",
                    s = this.data.operators[t].internal.els,
                    l = s.connectors[e],
                    c = l.length;
                for (var p in this.data.links)
                    if (this.data.links.hasOwnProperty(p)) {
                        var u = this.data.links[p];
                        u[n] == t && u[a] == e && o < u[i] && (o = u[i]);
                    }
                for (var h = Math.min(c - o - 2, c - 1), d = 0; h > d; d++) l[l.length - 1].remove(), l.pop(), s.connectorArrows[e].pop(), s.connectorSmallArrows[e].pop();
            }
        },
        deleteSelected: function () {
            null != this.selectedLinkId && this.deleteLink(this.selectedLinkId), null != this.selectedOperatorId && this.deleteOperator(this.selectedOperatorId);
        },
        setPositionRatio: function (t) {
            this.positionRatio = t;
        },
        getPositionRatio: function () {
            return this.positionRatio;
        },
        getData: function () {
            var t = ["operators", "links"],
                e = {};
            (e.operators = $.extend(!0, {}, this.data.operators)), (e.links = $.extend(!0, {}, this.data.links));
            for (var r in t)
                if (t.hasOwnProperty(r)) {
                    var o = t[r];
                    for (var n in e[o]) e[o].hasOwnProperty(n) && delete e[o][n].internal;
                }
            return (e.operatorTypes = this.data.operatorTypes), e;
        },
        setOperatorTitle: function (t, e) {
            this.data.operators[t].internal.els.title.html(e),
                "undefined" == typeof this.data.operators[t].properties && (this.data.operators[t].properties = {}),
                (this.data.operators[t].properties.title = e),
                this._refreshInternalProperties(this.data.operators[t]),
                this.callbackEvent("afterChange", ["operator_title_change"]);
        },
        getOperatorTitle: function (t) {
            return this.data.operators[t].internal.properties.title;
        },
        setOperatorData: function (t, e) {
            var r = this.getOperatorCompleteData(e);
            for (var o in this.data.links)
                if (this.data.links.hasOwnProperty(o)) {
                    var n = this.data.links[o];
                    ((n.fromOperator == t && "undefined" == typeof r.outputs[n.fromConnector]) || (n.toOperator == t && "undefined" == typeof r.inputs[n.toConnector])) && this._deleteLink(o, !0);
                }
            this._deleteOperator(t, !0), this.createOperator(t, e), this.redrawLinksLayer(), this.callbackEvent("afterChange", ["operator_data_change"]);
        },
        doesOperatorExists: function (t) {
            return "undefined" != typeof this.data.operators[t];
        },
        getOperatorData: function (t) {
            var e = $.extend(!0, {}, this.data.operators[t]);
            return delete e.internal, e;
        },
        getOperatorFullProperties: function (t) {
            if ("undefined" != typeof t.type) {
                var e = this.data.operatorTypes[t.type],
                    r = {};
                return "undefined" != typeof t.properties && (r = t.properties), $.extend({}, e, r);
            }
            return t.properties;
        },
        _refreshInternalProperties: function (t) {
            t.internal.properties = this.getOperatorFullProperties(t);
        },
    });
});
