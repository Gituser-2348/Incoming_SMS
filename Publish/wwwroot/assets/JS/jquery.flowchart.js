if (!("remove" in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      alert(this.innerHTML);
      this.parentNode.removeChild(this);
    }
  };
}

jQuery(function ($) {
  // the widget definition, where "custom" is the namespace,
  // "colorize" the widget name
  $.widget("flowchart.flowchart", {
    // default options
    options: {
      canUserEditLinks: true,
      canUserMoveOperators: true,
      data: {},
      distanceFromArrow: 3,
      defaultOperatorClass: "flowchart-default-operator",
      defaultLinkColor: "#c5c5c5",
      defaultSelectedLinkColor: "black",
      linkWidth: 2,
      grid: 20,
      multipleLinksOnOutput: false,
      multipleLinksOnInput: false,
      linkVerticalDecal: 0,
      verticalConnection: false,
      onOperatorSelect: function (operatorId) {
        return true;
      },
      onOperatorUnselect: function () {
        return true;
      },
      onOperatorMouseOver: function (operatorId) {
        return true;
      },
      onOperatorMouseOut: function (operatorId) {
        return true;
      },
      onLinkSelect: function (linkId) {
        return true;
      },
      onLinkUnselect: function () {
        return true;
      },
      onOperatorCreate: function (operatorId, operatorData, fullElement) {
        return true;
      },
      onLinkCreate: function (linkId, linkData) {
        return true;
      },
      onOperatorDelete: function (operatorId) {
        return true;
      },
      onLinkDelete: function (linkId, forced) {
        return true;
      },
      onOperatorMoved: function (operatorId, position) { },
      onAfterChange: function (changeType) { },
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

    // the constructor
    _create: function () {
      if (typeof document.__flowchartNumber == "undefined") {
        document.__flowchartNumber = 0;
      } else {
        document.__flowchartNumber++;
      }
      this.globalId = document.__flowchartNumber;
      this._unitVariables();

      this.element.addClass("flowchart-container");

      if (this.options.verticalConnection) {
        this.element.addClass("flowchart-vertical");
      }

      this.objs.layers.links = $('<svg class="flowchart-links-layer"></svg>');
      this.objs.layers.links.appendTo(this.element);

      this.objs.layers.operators = $(
        '<div class="flowchart-operators-layer unselectable"></div>'
      );
      this.objs.layers.operators.appendTo(this.element);

      this.objs.layers.temporaryLink = $(
        '<svg class="flowchart-temporary-link-layer"></svg>'
      );
      this.objs.layers.temporaryLink.appendTo(this.element);

      var shape = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      shape.setAttribute("x1", "0");
      shape.setAttribute("y1", "0");
      shape.setAttribute("x2", "0");
      shape.setAttribute("y2", "0");
      shape.setAttribute("stroke-dasharray", "6,6");
      shape.setAttribute("stroke-width", "1");
      shape.setAttribute("stroke", "black");
      shape.setAttribute("fill", "none");
      this.objs.layers.temporaryLink[0].appendChild(shape);
      this.objs.temporaryLink = shape;

      this._initEvents();

      if (typeof this.options.data != "undefined") {
        this.setData(this.options.data);
      }
    },

    _unitVariables: function () {
      this.data = {
        operators: {},
        links: {},
      };
      this.objs = {
        layers: {
          operators: null,
          temporaryLink: null,
          links: null,
        },
        linksContext: null,
        temporaryLink: null,
      };
    },

    _initEvents: function () {
      var self = this;

      this.element.mousemove(function (e) {
        var $this = $(this);
        var offset = $this.offset();
        self._mousemove(
          (e.pageX - offset.left) / self.positionRatio,
          (e.pageY - offset.top) / self.positionRatio,
          e
        );
      });

      this.element.click(function (e) {
        var $this = $(this);
        var offset = $this.offset();
        self._click(
          (e.pageX - offset.left) / self.positionRatio,
          (e.pageY - offset.top) / self.positionRatio,
          e
        );
      });

      this.objs.layers.operators.on(
        "pointerdown mousedown touchstart",
        ".flowchart-operator",
        function (e) {
          e.stopImmediatePropagation();
        }
      );

      this.objs.layers.operators.on(
        "click",
        ".flowchart-operator",
        function (e) {
          if (
            $(e.target).closest(".flowchart-operator-connector").length == 0
          ) {
            self.selectOperator($(this).data("operator_id"));
          }
        }
      );

      this.objs.layers.operators.on(
        "click",
        ".flowchart-operator-connector",
        function () {
          var $this = $(this);
          if (self.options.canUserEditLinks) {
            self._connectorClicked(
              $this.closest(".flowchart-operator").data("operator_id"),
              $this.data("connector"),
              $this.data("sub_connector"),
              $this
                .closest(".flowchart-operator-connector-set")
                .data("connector_type")
            );
          }
        }
      );

      this.objs.layers.links.on(
        "mousedown touchstart",
        ".flowchart-link",
        function (e) {
          e.stopImmediatePropagation();
        }
      );

      this.objs.layers.links.on("mouseover", ".flowchart-link", function () {
        self._connecterMouseOver($(this).data("link_id"));
      });

      this.objs.layers.links.on("mouseout", ".flowchart-link", function () {
        self._connecterMouseOut($(this).data("link_id"));
      });

      this.objs.layers.links.on("click", ".flowchart-link", function () {
        self.selectLink($(this).data("link_id"));
      });

      this.objs.layers.operators.on(
        "mouseover",
        ".flowchart-operator",
        function (e) {
          self._operatorMouseOver($(this).data("operator_id"));
        }
      );

      this.objs.layers.operators.on(
        "mouseout",
        ".flowchart-operator",
        function (e) {
          self._operatorMouseOut($(this).data("operator_id"));
        }
      );
    },

    setData: function (data) {
      this._clearOperatorsLayer();
      this.data.operatorTypes = {};
      if (typeof data.operatorTypes != "undefined") {
        this.data.operatorTypes = data.operatorTypes;
      }

      this.data.operators = {};
      for (var operatorId in data.operators) {
        if (data.operators.hasOwnProperty(operatorId)) {
          this.createOperator(operatorId, data.operators[operatorId]);
        }
      }
      this.data.links = {};
      for (var linkId in data.links) {
        if (data.links.hasOwnProperty(linkId)) {
          this.createLink(linkId, data.links[linkId]);
        }
      }
      this.data.operatorNumber = {};
      if (typeof data.operatorNumber != "undefined") {
        this.data.operatorNumber = data.operatorNumber;
      }
      this.redrawLinksLayer();
    },

    addLink: function (linkData) {
      while (typeof this.data.links[this.linkNum] != "undefined") {
        this.linkNum++;
      }

      this.createLink(this.linkNum, linkData);
      return this.linkNum;
    },

    createLink: function (linkId, linkDataOriginal) {
      var linkData = $.extend(true, {}, linkDataOriginal);
      if (!this.callbackEvent("linkCreate", [linkId, linkData])) {
        return;
      }

      var subConnectors = this._getSubConnectors(linkData);
      var fromSubConnector = subConnectors[0];
      var toSubConnector = subConnectors[1];

      var multipleLinksOnOutput = this.options.multipleLinksOnOutput;
      var multipleLinksOnInput = this.options.multipleLinksOnInput;
      if (!multipleLinksOnOutput || !multipleLinksOnInput) {
        for (var linkId2 in this.data.links) {
          if (this.data.links.hasOwnProperty(linkId2)) {
            var currentLink = this.data.links[linkId2];

            var currentSubConnectors = this._getSubConnectors(currentLink);
            var currentFromSubConnector = currentSubConnectors[0];
            var currentToSubConnector = currentSubConnectors[1];

            if (
              !multipleLinksOnOutput &&
              !this.data.operators[linkData.fromOperator].properties.outputs[
                linkData.fromConnector
              ].multipleLinks &&
              currentLink.fromOperator == linkData.fromOperator &&
              currentLink.fromConnector == linkData.fromConnector &&
              currentFromSubConnector == fromSubConnector
            ) {
              this.deleteLink(linkId2);
              continue;
            }
            if (
              !multipleLinksOnInput &&
              !this.data.operators[linkData.toOperator].properties.inputs[
                linkData.toConnector
              ].multipleLinks &&
              currentLink.toOperator == linkData.toOperator &&
              currentLink.toConnector == linkData.toConnector &&
              currentToSubConnector == toSubConnector
            ) {
              this.deleteLink(linkId2);
            }
          }
        }
      }

      this._autoCreateSubConnector(
        linkData.fromOperator,
        linkData.fromConnector,
        "outputs",
        fromSubConnector
      );
      this._autoCreateSubConnector(
        linkData.toOperator,
        linkData.toConnector,
        "inputs",
        toSubConnector
      );

      this.data.links[linkId] = linkData;
      this._drawLink(linkId);

      this.callbackEvent("afterChange", ["link_create"]);
    },

    _autoCreateSubConnector: function (
      operator,
      connector,
      connectorType,
      subConnector
    ) {
      var connectorInfos = this.data.operators[operator].internal.properties[
        connectorType
      ][connector];
      if (connectorInfos.multiple) {
        var fromFullElement = this.data.operators[operator].internal.els;
        var nbFromConnectors = this.data.operators[operator].internal.els
          .connectors[connector].length;
        for (var i = nbFromConnectors; i < subConnector + 2; i++) {
          this._createSubConnector(connector, connectorInfos, fromFullElement);
        }
      }
    },

    _refreshOperatorConnectors: function (operatorId) {
      for (var linkId in this.data.links) {
        if (this.data.links.hasOwnProperty(linkId)) {
          var linkData = this.data.links[linkId];
          if (
            linkData.fromOperator == operatorId ||
            linkData.toOperator == operatorId
          ) {
            var subConnectors = this._getSubConnectors(linkData);
            var fromSubConnector = subConnectors[0];
            var toSubConnector = subConnectors[1];

            this._autoCreateSubConnector(
              linkData.fromOperator,
              linkData.fromConnector,
              "outputs",
              fromSubConnector
            );
            this._autoCreateSubConnector(
              linkData.toOperator,
              linkData.toConnector,
              "inputs",
              toSubConnector
            );
          }
        }
      }
    },

    redrawLinksLayer: function () {
      this._clearLinksLayer();
      for (var linkId in this.data.links) {
        if (this.data.links.hasOwnProperty(linkId)) {
          this._drawLink(linkId);
        }
      }
    },

    _clearLinksLayer: function () {
      this.objs.layers.links.empty();
      if (this.options.verticalConnection) {
        this.objs.layers.operators
          .find(".flowchart-operator-connector-small-arrow")
          .css("border-top-color", "transparent");
      } else {
        this.objs.layers.operators
          .find(".flowchart-operator-connector-small-arrow")
          .css("border-left-color", "transparent");
      }
    },

    _clearOperatorsLayer: function () {
      this.objs.layers.operators.empty();
    },

    getConnectorPosition: function (operatorId, connectorId, subConnector) {
      var operatorData = this.data.operators[operatorId];
      var $connector =
        operatorData.internal.els.connectorArrows[connectorId][subConnector];

      var connectorOffset = $connector.offset();
      var elementOffset = this.element.offset();

      var x = (connectorOffset.left - elementOffset.left) / this.positionRatio;
      var width = parseInt($connector.css("border-top-width"), 10);
      var y =
        (connectorOffset.top - elementOffset.top - 1) / this.positionRatio +
        parseInt($connector.css("border-left-width"), 10);

      return { x: x, width: width, y: y };
    },

    getLinkMainColor: function (linkId) {
      var color = this.options.defaultLinkColor;
      var linkData = this.data.links[linkId];
      if (typeof linkData.color != "undefined") {
        color = linkData.color;
      }
      return color;
    },

    setLinkMainColor: function (linkId, color) {
      this.data.links[linkId].color = color;
      this.callbackEvent("afterChange", ["link_change_main_color"]);
    },

    _drawLink: function (linkId) {
      var linkData = this.data.links[linkId];

      if (typeof linkData.internal == "undefined") {
        linkData.internal = {};
      }
      linkData.internal.els = {};

      var fromOperatorId = linkData.fromOperator;
      var fromConnectorId = linkData.fromConnector;
      var toOperatorId = linkData.toOperator;
      var toConnectorId = linkData.toConnector;

      var subConnectors = this._getSubConnectors(linkData);
      var fromSubConnector = subConnectors[0];
      var toSubConnector = subConnectors[1];

      var color = this.getLinkMainColor(linkId);

      var fromOperator = this.data.operators[fromOperatorId];
      var toOperator = this.data.operators[toOperatorId];

      var fromSmallConnector =
        fromOperator.internal.els.connectorSmallArrows[fromConnectorId][
        fromSubConnector
        ];
      var toSmallConnector =
        toOperator.internal.els.connectorSmallArrows[toConnectorId][
        toSubConnector
        ];

      linkData.internal.els.fromSmallConnector = fromSmallConnector;
      linkData.internal.els.toSmallConnector = toSmallConnector;

      var overallGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      this.objs.layers.links[0].appendChild(overallGroup);
      linkData.internal.els.overallGroup = overallGroup;

      var mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
      var maskId = "fc_mask_" + this.globalId + "_" + this.maskNum;
      this.maskNum++;
      mask.setAttribute("id", maskId);

      overallGroup.appendChild(mask);

      var shape = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      shape.setAttribute("x", "0");
      shape.setAttribute("y", "0");
      shape.setAttribute("width", "100%");
      shape.setAttribute("height", "100%");
      shape.setAttribute("stroke", "none");
      shape.setAttribute("fill", "white");
      mask.appendChild(shape);

      var shape_polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      shape_polygon.setAttribute("stroke", "none");
      shape_polygon.setAttribute("fill", "black");
      mask.appendChild(shape_polygon);
      linkData.internal.els.mask = shape_polygon;

      var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", "flowchart-link");
      group.setAttribute("data-link_id", linkId);
      overallGroup.appendChild(group);

      var shape_path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      shape_path.setAttribute(
        "stroke-width",
        this.options.linkWidth.toString()
      );
      shape_path.setAttribute("fill", "none");
      group.appendChild(shape_path);
      linkData.internal.els.path = shape_path;

      var shape_rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      shape_rect.setAttribute("stroke", "none");
      shape_rect.setAttribute("mask", "url(#" + maskId + ")");
      group.appendChild(shape_rect);
      linkData.internal.els.rect = shape_rect;

      this._refreshLinkPositions(linkId);
      this.uncolorizeLink(linkId);
    },

    _getSubConnectors: function (linkData) {
      var fromSubConnector = 0;
      if (typeof linkData.fromSubConnector != "undefined") {
        fromSubConnector = linkData.fromSubConnector;
      }

      var toSubConnector = 0;
      if (typeof linkData.toSubConnector != "undefined") {
        toSubConnector = linkData.toSubConnector;
      }

      return [fromSubConnector, toSubConnector];
    },

    _refreshLinkPositions: function (linkId) {
      var linkData = this.data.links[linkId];

      var subConnectors = this._getSubConnectors(linkData);
      var fromSubConnector = subConnectors[0];
      var toSubConnector = subConnectors[1];

      var fromPosition = this.getConnectorPosition(
        linkData.fromOperator,
        linkData.fromConnector,
        fromSubConnector
      );
      var toPosition = this.getConnectorPosition(
        linkData.toOperator,
        linkData.toConnector,
        toSubConnector
      );

      var fromX = fromPosition.x;
      var offsetFromX = fromPosition.width;
      var fromY = fromPosition.y;

      var toX = toPosition.x;
      var toY = toPosition.y;

      fromY += this.options.linkVerticalDecal;
      toY += this.options.linkVerticalDecal;

      var distanceFromArrow = this.options.distanceFromArrow;

      linkData.internal.els.mask.setAttribute(
        "points",
        fromX +
        "," +
        (fromY - offsetFromX - distanceFromArrow) +
        " " +
        (fromX + offsetFromX + distanceFromArrow) +
        "," +
        fromY +
        " " +
        fromX +
        "," +
        (fromY + offsetFromX + distanceFromArrow)
      );

      var bezierFromX, bezierToX, bezierIntensity;

      if (this.options.verticalConnection) {
        fromY = fromY - 10;
        toY = toY - 10;
        bezierFromX = fromX + offsetFromX + distanceFromArrow - 3;
        bezierToX = toX + offsetFromX + distanceFromArrow - 3;

        bezierIntensity = Math.min(
          20,
          Math.max(Math.abs(bezierFromX - bezierToX) / 2, Math.abs(fromY - toY))
        );
        linkData.internal.els.path.setAttribute(
          "d",
          "M" +
          bezierFromX +
          "," +
          fromY +
          " L" +
          bezierFromX +
          "," +
          (fromY + bezierIntensity) +
          " " +
          bezierToX +
          "," +
          (toY - bezierIntensity) +
          " " +
          bezierToX +
          "," +
          toY
        );
        linkData.internal.els.rect.setAttribute(
          "x",
          fromX - 1 + this.options.linkWidth / 2
        );
      } else {
        bezierFromX = fromX + offsetFromX + distanceFromArrow;
        bezierToX = toX + 1;
        bezierIntensity = Math.min(
          20,
          Math.max(Math.abs(bezierFromX - bezierToX) / 2, Math.abs(fromY - toY))
        );
        linkData.internal.els.path.setAttribute(
          "d",
          "M" +
          bezierFromX +
          "," +
          fromY +
          " L" +
          (fromX + offsetFromX + distanceFromArrow + bezierIntensity) +
          "," +
          fromY +
          " " +
          (toX - bezierIntensity) +
          "," +
          toY +
          " " +
          bezierToX +
          "," +
          toY
        );
        linkData.internal.els.rect.setAttribute("x", fromX);
      }

      linkData.internal.els.rect.setAttribute(
        "y",
        fromY - this.options.linkWidth / 2
      );
      linkData.internal.els.rect.setAttribute(
        "width",
        offsetFromX + distanceFromArrow + 1
      );
      linkData.internal.els.rect.setAttribute("height", this.options.linkWidth);
    },

    getOperatorCompleteData: function (operatorData) {
      if (typeof operatorData.internal == "undefined") {
        operatorData.internal = {};
      }
      this._refreshInternalProperties(operatorData);
      var infos = $.extend(true, {}, operatorData.internal.properties);

      for (var connectorId_i in infos.inputs) {
        if (infos.inputs.hasOwnProperty(connectorId_i)) {
          if (infos.inputs[connectorId_i] == null) {
            delete infos.inputs[connectorId_i];
          }
        }
      }

      for (var connectorId_o in infos.outputs) {
        if (infos.outputs.hasOwnProperty(connectorId_o)) {
          if (infos.outputs[connectorId_o] == null) {
            delete infos.outputs[connectorId_o];
          }
        }
      }

      if (typeof infos.class == "undefined") {
        infos.class = this.options.defaultOperatorClass;
      }
      return infos;
    },

    _getOperatorFullElement: function (operatorData) {
      var infos = this.getOperatorCompleteData(operatorData);

      var $operator = $(
        '<div class="flowchart-operator" id=' +
        operatorData.id +
        ' (click)="deleteOperationOrLink()"></div>'
      );
      $operator.addClass(infos.class);

      var $operator_header = $('<div class="flowchart-operator-header"></div>');
      $operator_header.appendTo($operator);

      var $operator_icon = $(
        '<div class="flowchart-operator-header-icon material-icons">' +
        operatorData.icon +
        "</div>"
      );
      $operator_icon.appendTo($operator_header);

      var $operator_title = $('<div class="flowchart-operator-title"></div>');
      $operator_title.html(infos.title);
      $operator_title.appendTo($operator_header);

      var $operator_body = $('<div class="flowchart-operator-body"></div>');
      $operator_body.html(infos.body);
      if (infos.body) {
        $operator_body.appendTo($operator);
      }

      var $operator_inputs_outputs = $(
        '<div class="flowchart-operator-inputs-outputs"></div>'
      );

      var $operator_inputs = $('<div class="flowchart-operator-inputs"></div>');

      var $operator_outputs = $(
        '<div class="flowchart-operator-outputs"></div>'
      );

      if (this.options.verticalConnection) {
        $operator_inputs.prependTo($operator);
        $operator_outputs.appendTo($operator);
      } else {
        $operator_inputs_outputs.appendTo($operator);
        $operator_inputs.appendTo($operator_inputs_outputs);
        $operator_outputs.appendTo($operator_inputs_outputs);
      }

      var self = this;

      var connectorArrows = {};
      var connectorSmallArrows = {};
      var connectorSets = {};
      var connectors = {};

      var fullElement = {
        operator: $operator,
        title: $operator_title,
        body: $operator_body,
        connectorSets: connectorSets,
        connectors: connectors,
        connectorArrows: connectorArrows,
        connectorSmallArrows: connectorSmallArrows,
      };

      function addConnector(
        connectorKey,
        connectorInfos,
        $operator_container,
        connectorType
      ) {
        var $operator_connector_set = $(
          '<div class="flowchart-operator-connector-set"></div>'
        );
        $operator_connector_set.data("connector_type", connectorType);
        $operator_connector_set.appendTo($operator_container);

        connectorArrows[connectorKey] = [];
        connectorSmallArrows[connectorKey] = [];
        connectors[connectorKey] = [];
        connectorSets[connectorKey] = $operator_connector_set;

        if ($.isArray(connectorInfos.label)) {
          for (var i = 0; i < connectorInfos.label.length; i++) {
            self._createSubConnector(
              connectorKey,
              connectorInfos.label[i],
              fullElement
            );
          }
        } else {
          self._createSubConnector(connectorKey, connectorInfos, fullElement);
        }
      }

      for (var key_i in infos.inputs) {
        if (infos.inputs.hasOwnProperty(key_i)) {
          addConnector(key_i, infos.inputs[key_i], $operator_inputs, "inputs");
        }
      }

      for (var key_o in infos.outputs) {
        if (infos.outputs.hasOwnProperty(key_o)) {
          addConnector(
            key_o,
            infos.outputs[key_o],
            $operator_outputs,
            "outputs"
          );
        }
      }

      return fullElement;
    },

    _createSubConnector: function (connectorKey, connectorInfos, fullElement) {
      var $operator_connector_set = fullElement.connectorSets[connectorKey];

      var subConnector = fullElement.connectors[connectorKey].length;

      var $operator_connector = $(
        '<div class="flowchart-operator-connector"></div>'
      );
      $operator_connector.appendTo($operator_connector_set);
      $operator_connector.data("connector", connectorKey);
      $operator_connector.data("sub_connector", subConnector);

      var $operator_connector_label = $(
        '<div class="flowchart-operator-connector-label"></div>'
      );
      $operator_connector_label.text(
        connectorInfos.label.replace("(:i)", subConnector + 1)
      );
      $operator_connector_label.appendTo($operator_connector);

      var $operator_connector_arrow = $(
        '<div class="flowchart-operator-connector-arrow"></div>'
      );

      $operator_connector_arrow.appendTo($operator_connector);

      var $operator_connector_small_arrow = $(
        '<div class="flowchart-operator-connector-small-arrow"></div>'
      );
      $operator_connector_small_arrow.appendTo($operator_connector);

      fullElement.connectors[connectorKey].push($operator_connector);
      fullElement.connectorArrows[connectorKey].push($operator_connector_arrow);
      fullElement.connectorSmallArrows[connectorKey].push(
        $operator_connector_small_arrow
      );
    },

    getOperatorElement: function (operatorData) {
      var fullElement = this._getOperatorFullElement(operatorData);
      return fullElement.operator;
    },

    getOperatorNumber: function () {
      return this.operatorNum;
    },

    setOperatorNumber: function (operatorNumber) {
      this.operatorNum = operatorNumber;
      this.data.operatorNumber = operatorNumber;
    },

    addOperator: function (operatorData) {
      while (typeof this.data.operators[this.operatorNum] != "undefined") {
        this.operatorNum++;
      }

      this.createOperator(this.operatorNum, operatorData);
      return this.operatorNum;
    },

    createOperator: function (operatorId, operatorData) {
      operatorData.internal = {};
      this._refreshInternalProperties(operatorData);

      var fullElement = this._getOperatorFullElement(operatorData);
      if (
        !this.callbackEvent("operatorCreate", [
          operatorId,
          operatorData,
          fullElement,
        ])
      ) {
        return false;
      }

      var grid = this.options.grid;

      if (grid) {
        operatorData.top = Math.round(operatorData.top / grid) * grid;
        operatorData.left = Math.round(operatorData.left / grid) * grid;
      }

      fullElement.operator.appendTo(this.objs.layers.operators);
      fullElement.operator.css({
        top: operatorData.top,
        left: operatorData.left,
      });
      fullElement.operator.data("operator_id", operatorId);

      this.data.operators[operatorId] = operatorData;
      this.data.operators[operatorId].internal.els = fullElement;

      if (operatorId == this.selectedOperatorId) {
        this._addSelectedClass(operatorId);
      }

      var self = this;

      function operatorChangedPosition(operator_id, pos) {
        operatorData.top = pos.top;
        operatorData.left = pos.left;

        for (var linkId in self.data.links) {
          if (self.data.links.hasOwnProperty(linkId)) {
            var linkData = self.data.links[linkId];
            if (
              linkData.fromOperator == operator_id ||
              linkData.toOperator == operator_id
            ) {
              self._refreshLinkPositions(linkId);
            }
          }
        }
      }

      // Small fix has been added in order to manage eventual zoom
      // http://stackoverflow.com/questions/2930092/jquery-draggable-with-zoom-problem
      if (this.options.canUserMoveOperators) {
        var pointerX;
        var pointerY;
        fullElement.operator.draggable({
          containment: operatorData.internal.properties.uncontained
            ? false
            : this.element,
          handle:
            ".flowchart-operator-header, .flowchart-operator-title, .flowchart-operator-body",
          start: function (e, ui) {
            if (self.lastOutputConnectorClicked != null) {
              e.preventDefault();
              return;
            }
            var elementOffset = self.element.offset();
            pointerX =
              (e.pageX - elementOffset.left) / self.positionRatio -
              parseInt($(e.target).css("left"), 10);
            pointerY =
              (e.pageY - elementOffset.top) / self.positionRatio -
              parseInt($(e.target).css("top"), 10);
          },
          drag: function (e, ui) {
            if (self.options.grid) {
              var grid = self.options.grid;
              var elementOffset = self.element.offset();
              ui.position.left =
                Math.round(
                  ((e.pageX - elementOffset.left) / self.positionRatio -
                    pointerX) /
                  grid
                ) * grid;
              ui.position.top =
                Math.round(
                  ((e.pageY - elementOffset.top) / self.positionRatio -
                    pointerY) /
                  grid
                ) * grid;

              if (!operatorData.internal.properties.uncontained) {
                var $this = $(this);
                ui.position.left = Math.min(
                  Math.max(ui.position.left, 0),
                  self.element.width() - $this.outerWidth()
                );
                ui.position.top = Math.min(
                  Math.max(ui.position.top, 0),
                  self.element.height() - $this.outerHeight()
                );
              }

              ui.offset.left = Math.round(
                ui.position.left + elementOffset.left
              );
              ui.offset.top = Math.round(ui.position.top + elementOffset.top);
              fullElement.operator.css({
                left: ui.position.left,
                top: ui.position.top,
              });
            }
            operatorChangedPosition($(this).data("operator_id"), ui.position);
          },
          stop: function (e, ui) {
            self._unsetTemporaryLink();
            var operatorId = $(this).data("operator_id");
            operatorChangedPosition(operatorId, ui.position);
            fullElement.operator.css({
              height: "auto",
            });

            self.callbackEvent("operatorMoved", [operatorId, ui.position]);
            self.callbackEvent("afterChange", ["operator_moved"]);
          },
        });
      }

      this.callbackEvent("afterChange", ["operator_create"]);
    },

    _connectorClicked: function (
      operator,
      connector,
      subConnector,
      connectorCategory
    ) {
      if (connectorCategory == "outputs") {
        var d = new Date();
        // var currentTime = d.getTime();
        this.lastOutputConnectorClicked = {
          operator: operator,
          connector: connector,
          subConnector: subConnector,
        };
        this.objs.layers.temporaryLink.show();
        var position = this.getConnectorPosition(
          operator,
          connector,
          subConnector
        );
        var x = position.x + position.width;
        var y = position.y;
        this.objs.temporaryLink.setAttribute("x1", x.toString());
        this.objs.temporaryLink.setAttribute("y1", y.toString());
        this._mousemove(x, y);
      }
      if (
        connectorCategory == "inputs" &&
        this.lastOutputConnectorClicked != null
      ) {
        var linkData = {
          fromOperator: this.lastOutputConnectorClicked.operator,
          fromConnector: this.lastOutputConnectorClicked.connector,
          fromSubConnector: this.lastOutputConnectorClicked.subConnector,
          toOperator: operator,
          toConnector: connector,
          toSubConnector: subConnector,
        };

        this.addLink(linkData);
        this._unsetTemporaryLink();
      }
    },

    _unsetTemporaryLink: function () {
      this.lastOutputConnectorClicked = null;
      this.objs.layers.temporaryLink.hide();
    },

    _mousemove: function (x, y, e) {
      if (this.lastOutputConnectorClicked != null) {
        this.objs.temporaryLink.setAttribute("x2", x);
        this.objs.temporaryLink.setAttribute("y2", y);
      }
    },

    _click: function (x, y, e) {
      var $target = $(e.target);
      if ($target.closest(".flowchart-operator-connector").length == 0) {
        this._unsetTemporaryLink();
      }

      if ($target.closest(".flowchart-operator").length == 0) {
        this.unselectOperator();
      }

      if ($target.closest(".flowchart-link").length == 0) {
        this.unselectLink();
      }
    },

    _removeSelectedClassOperators: function () {
      this.objs.layers.operators
        .find(".flowchart-operator")
        .removeClass("selected");
    },

    unselectOperator: function () {
      if (this.selectedOperatorId != null) {
        if (!this.callbackEvent("operatorUnselect", [])) {
          return;
        }
        this._removeSelectedClassOperators();
        this.selectedOperatorId = null;
      }
    },

    _addSelectedClass: function (operatorId) {
      this.data.operators[operatorId].internal.els.operator.addClass(
        "selected"
      );
    },

    callbackEvent: function (name, params) {
      var cbName = "on" + name.charAt(0).toUpperCase() + name.slice(1);
      var ret = this.options[cbName].apply(this, params);
      if (ret !== false) {
        var returnHash = { result: ret };
        this.element.trigger(name, params.concat([returnHash]));
        ret = returnHash["result"];
      }
      return ret;
    },

    selectOperator: function (operatorId) {
      if (!this.callbackEvent("operatorSelect", [operatorId])) {
        return;
      }
      this.unselectLink();
      this._removeSelectedClassOperators();
      this._addSelectedClass(operatorId);
      this.selectedOperatorId = operatorId;
    },

    addClassOperator: function (operatorId, className) {
      this.data.operators[operatorId].internal.els.operator.addClass(className);
    },

    removeClassOperator: function (operatorId, className) {
      this.data.operators[operatorId].internal.els.operator.removeClass(
        className
      );
    },

    removeClassOperators: function (className) {
      this.objs.layers.operators
        .find(".flowchart-operator")
        .removeClass(className);
    },

    _addHoverClassOperator: function (operatorId) {
      this.data.operators[operatorId].internal.els.operator.addClass("hover");
    },

    _removeHoverClassOperators: function () {
      this.objs.layers.operators
        .find(".flowchart-operator")
        .removeClass("hover");
    },

    _operatorMouseOver: function (operatorId) {
      if (!this.callbackEvent("operatorMouseOver", [operatorId])) {
        return;
      }
      this._addHoverClassOperator(operatorId);
    },

    _operatorMouseOut: function (operatorId) {
      if (!this.callbackEvent("operatorMouseOut", [operatorId])) {
        return;
      }
      this._removeHoverClassOperators();
    },

    getSelectedOperatorId: function () {
      return this.selectedOperatorId;
    },

    getSelectedLinkId: function () {
      return this.selectedLinkId;
    },

    // Found here : http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    _shadeColor: function (color, percent) {
      var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = (f >> 8) & 0x00ff,
        B = f & 0x0000ff;
      return (
        "#" +
        (
          0x1000000 +
          (Math.round((t - R) * p) + R) * 0x10000 +
          (Math.round((t - G) * p) + G) * 0x100 +
          (Math.round((t - B) * p) + B)
        )
          .toString(16)
          .slice(1)
      );
    },

    colorizeLink: function (linkId, color) {
      var linkData = this.data.links[linkId];
      linkData.internal.els.path.setAttribute("stroke", color);
      linkData.internal.els.rect.setAttribute("fill", color);
      if (this.options.verticalConnection) {
        linkData.internal.els.fromSmallConnector.css("border-top-color", color);
        linkData.internal.els.toSmallConnector.css("border-top-color", color);
      } else {
        linkData.internal.els.fromSmallConnector.css(
          "border-left-color",
          color
        );
        linkData.internal.els.toSmallConnector.css("border-left-color", color);
      }
    },

    uncolorizeLink: function (linkId) {
      this.colorizeLink(linkId, this.getLinkMainColor(linkId));
    },

    _connecterMouseOver: function (linkId) {
      if (this.selectedLinkId != linkId) {
        this.colorizeLink(
          linkId,
          this._shadeColor(this.getLinkMainColor(linkId), -0.4)
        );
      }
    },

    _connecterMouseOut: function (linkId) {
      if (this.selectedLinkId != linkId) {
        this.uncolorizeLink(linkId);
      }
    },

    unselectLink: function () {
      if (this.selectedLinkId != null) {
        if (!this.callbackEvent("linkUnselect", [])) {
          return;
        }
        this.uncolorizeLink(
          this.selectedLinkId,
          this.options.defaultSelectedLinkColor
        );
        this.selectedLinkId = null;
      }
    },

    selectLink: function (linkId) {
      this.unselectLink();
      if (!this.callbackEvent("linkSelect", [linkId])) {
        return;
      }
      this.unselectOperator();
      this.selectedLinkId = linkId;
      this.colorizeLink(linkId, this.options.defaultSelectedLinkColor);
    },

    deleteOperator: function (operatorId) {
      this._deleteOperator(operatorId, false);
    },

    _deleteOperator: function (operatorId, replace) {
      if (!this.callbackEvent("operatorDelete", [operatorId, replace])) {
        return false;
      }
      if (!replace) {
        for (var linkId in this.data.links) {
          if (this.data.links.hasOwnProperty(linkId)) {
            var currentLink = this.data.links[linkId];
            if (
              currentLink.fromOperator == operatorId ||
              currentLink.toOperator == operatorId
            ) {
              this._deleteLink(linkId, true);
            }
          }
        }
      }
      if (!replace && operatorId == this.selectedOperatorId) {
        this.unselectOperator();
      }
      this.data.operators[operatorId].internal.els.operator.remove();
      delete this.data.operators[operatorId];

      this.callbackEvent("afterChange", ["operator_delete"]);
    },

    deleteLink: function (linkId) {
      this._deleteLink(linkId, false);
    },

    _deleteLink: function (linkId, forced) {
      if (this.selectedLinkId == linkId) {
        this.unselectLink();
      }
      if (!this.callbackEvent("linkDelete", [linkId, forced])) {
        if (!forced) {
          return;
        }
      }
      this.colorizeLink(linkId, "transparent");
      var linkData = this.data.links[linkId];
      var fromOperator = linkData.fromOperator;
      var fromConnector = linkData.fromConnector;
      var toOperator = linkData.toOperator;
      var toConnector = linkData.toConnector;
      var overallGroup = linkData.internal.els.overallGroup;
      if (overallGroup.remove) {
        overallGroup.remove();
      } else {
        overallGroup.parentNode.removeChild(overallGroup);
      }
      delete this.data.links[linkId];

      this._cleanMultipleConnectors(fromOperator, fromConnector, "from");
      this._cleanMultipleConnectors(toOperator, toConnector, "to");

      this.callbackEvent("afterChange", ["link_delete"]);
    },

    _cleanMultipleConnectors: function (operator, connector, linkFromTo) {
      if (
        !this.data.operators[operator].internal.properties[
          linkFromTo == "from" ? "outputs" : "inputs"
        ][connector].multiple
      ) {
        return;
      }

      var maxI = -1;
      var fromToOperator = linkFromTo + "Operator";
      var fromToConnector = linkFromTo + "Connector";
      var fromToSubConnector = linkFromTo + "SubConnector";
      var els = this.data.operators[operator].internal.els;
      var subConnectors = els.connectors[connector];
      var nbSubConnectors = subConnectors.length;

      for (var linkId in this.data.links) {
        if (this.data.links.hasOwnProperty(linkId)) {
          var linkData = this.data.links[linkId];
          if (
            linkData[fromToOperator] == operator &&
            linkData[fromToConnector] == connector
          ) {
            if (maxI < linkData[fromToSubConnector]) {
              maxI = linkData[fromToSubConnector];
            }
          }
        }
      }

      var nbToDelete = Math.min(
        nbSubConnectors - maxI - 2,
        nbSubConnectors - 1
      );
      for (var i = 0; i < nbToDelete; i++) {
        subConnectors[subConnectors.length - 1].remove();
        subConnectors.pop();
        els.connectorArrows[connector].pop();
        els.connectorSmallArrows[connector].pop();
      }
    },

    deleteSelected: function () {
      if (this.selectedLinkId != null) {
        this.deleteLink(this.selectedLinkId);
      }
      if (this.selectedOperatorId != null) {
        this.deleteOperator(this.selectedOperatorId);
      }
    },

    setPositionRatio: function (positionRatio) {
      this.positionRatio = positionRatio;
    },

    getPositionRatio: function () {
      return this.positionRatio;
    },

    getData: function () {
      var keys = ["operators", "links"];
      var data = {};
      data.operators = $.extend(true, {}, this.data.operators);
      data.links = $.extend(true, {}, this.data.links);
      for (var keyI in keys) {
        if (keys.hasOwnProperty(keyI)) {
          var key = keys[keyI];
          for (var objId in data[key]) {
            if (data[key].hasOwnProperty(objId)) {
              delete data[key][objId].internal;
            }
          }
        }
      }
      data.operatorTypes = this.data.operatorTypes;
      data.operatorNumber = this.data.operatorNumber;
      return data;
    },

    getDataRef: function () {
      return this.data;
    },

    setOperatorTitle: function (operatorId, title) {
      this.data.operators[operatorId].internal.els.title.html(title);
      if (typeof this.data.operators[operatorId].properties == "undefined") {
        this.data.operators[operatorId].properties = {};
      }
      this.data.operators[operatorId].properties.title = title;
      this._refreshInternalProperties(this.data.operators[operatorId]);
      this.callbackEvent("afterChange", ["operator_title_change"]);
    },

    setOperatorBody: function (operatorId, body) {

      this.data.operators[operatorId].internal.els.body.html(body);
      if (typeof this.data.operators[operatorId].properties == "undefined") {
        this.data.operators[operatorId].properties = {};
      }
      this.data.operators[operatorId].properties.body = body;
      this._refreshInternalProperties(this.data.operators[operatorId]);
      this.callbackEvent("afterChange", ["operator_body_change"]);
    },
    setOperatorProperties: function (operatorId, properties) {


      if (typeof this.data.operators[operatorId].properties == "undefined") {
        this.data.operators[operatorId].properties = {};
      }
      this.data.operators[operatorId].properties = properties;
      this._refreshInternalProperties(this.data.operators[operatorId]);
      
      this.callbackEvent("afterChange", ["operator_data_change"]);
     
    },
    getOperatorTitle: function (operatorId) {
      return this.data.operators[operatorId].internal.properties.title;
    },

    getOperatorBody: function (operatorId) {
      return this.data.operators[operatorId].internal.properties.body;
    },

    setOperatorData: function (operatorId, operatorData) {
      var infos = this.getOperatorCompleteData(operatorData);
      for (var linkId in this.data.links) {
        if (this.data.links.hasOwnProperty(linkId)) {
          var linkData = this.data.links[linkId];
          if (
            (linkData.fromOperator == operatorId &&
              typeof infos.outputs[linkData.fromConnector] == "undefined") ||
            (linkData.toOperator == operatorId &&
              typeof infos.inputs[linkData.toConnector] == "undefined")
          ) {
            this._deleteLink(linkId, true);
          }
        }
      }
      this._deleteOperator(operatorId, true);
      this.createOperator(operatorId, operatorData);
      this._refreshOperatorConnectors(operatorId);
      this.redrawLinksLayer();
      this.callbackEvent("afterChange", ["operator_data_change"]);
    },

    getBoundingOperatorRect: function (operatorId) {
      if (!this.data.operators[operatorId]) {
        return null;
      }

      var elOperator = this.data.operators[operatorId].internal.els.operator;
      var operator = this.data.operators[operatorId];

      return {
        left: operator.left,
        top: operator.top,
        width: elOperator.width(),
        height: elOperator.height(),
      };
    },

    doesOperatorExists: function (operatorId) {
      return typeof this.data.operators[operatorId] != "undefined";
    },

    getOperatorData: function (operatorId) {
      var data = $.extend(true, {}, this.data.operators[operatorId]);
      delete data.internal;
      return data;
    },

    getLinksFrom: function (operatorId) {
      var result = [];

      for (var linkId in this.data.links) {
        if (this.data.links.hasOwnProperty(linkId)) {
          var linkData = this.data.links[linkId];
          if (linkData.fromOperator === operatorId) {
            result.push(linkData);
          }
        }
      }

      return result;
    },

    getLinksTo: function (operatorId) {
      var result = [];

      for (var linkId in this.data.links) {
        if (this.data.links.hasOwnProperty(linkId)) {
          var linkData = this.data.links[linkId];
          if (linkData.toOperator === operatorId) {
            result.push(linkData);
          }
        }
      }

      return result;
    },

    getOperatorFullProperties: function (operatorData) {
      if (typeof operatorData.type != "undefined") {
        var typeProperties = this.data.operatorTypes[operatorData.type];
        var operatorProperties = {};
        if (typeof operatorData.properties != "undefined") {
          operatorProperties = operatorData.properties;
        }
        return $.extend({}, typeProperties, operatorProperties);
      } else {
        return operatorData.properties;
      }
    },

    _refreshInternalProperties: function (operatorData) {
      operatorData.internal.properties = this.getOperatorFullProperties(
        operatorData
      );
    },
  });
});
