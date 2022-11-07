/*
 Highcharts JS v3.0.6 (2013-10-04)

 (c) 2009-2013 Torstein Hønsi

 License: www.highcharts.com/license
*/
(function(j, C) {
  function J(a, b, c) {
    this.init.call(this, a, b, c);
  }
  function K(a, b, c) {
    a.call(this, b, c);
    if (this.chart.polar)
      (this.closeSegment = function(a) {
        var c = this.xAxis.center;
        a.push('L', c[0], c[1]);
      }),
        (this.closedStacks = !0);
  }
  function L(a, b) {
    var c = this.chart,
      d = this.options.animation,
      g = this.group,
      f = this.markerGroup,
      e = this.xAxis.center,
      i = c.plotLeft,
      n = c.plotTop;
    if (c.polar) {
      if (c.renderer.isSVG)
        if ((d === !0 && (d = {}), b)) {
          if (
            ((c = { translateX: e[0] + i, translateY: e[1] + n, scaleX: 0.001, scaleY: 0.001 }),
            g.attr(c),
            f)
          )
            (f.attrSetters = g.attrSetters), f.attr(c);
        } else
          (c = { translateX: i, translateY: n, scaleX: 1, scaleY: 1 }),
            g.animate(c, d),
            f && f.animate(c, d),
            (this.animate = null);
    } else a.call(this, b);
  }
  var P = j.arrayMin,
    Q = j.arrayMax,
    s = j.each,
    F = j.extend,
    p = j.merge,
    R = j.map,
    r = j.pick,
    v = j.pInt,
    m = j.getOptions().plotOptions,
    h = j.seriesTypes,
    x = j.extendClass,
    M = j.splat,
    o = j.wrap,
    N = j.Axis,
    u = j.Tick,
    z = j.Series,
    q = h.column.prototype,
    t = Math,
    D = t.round,
    A = t.floor,
    S = t.max,
    w = function() {};
  F(J.prototype, {
    init: function(a, b, c) {
      var d = this,
        g = d.defaultOptions;
      d.chart = b;
      if (b.angular) g.background = {};
      d.options = a = p(g, a);
      (a = a.background) &&
        s([].concat(M(a)).reverse(), function(a) {
          var b = a.backgroundColor,
            a = p(d.defaultBackgroundOptions, a);
          if (b) a.backgroundColor = b;
          a.color = a.backgroundColor;
          c.options.plotBands.unshift(a);
        });
    },
    defaultOptions: { center: ['50%', '50%'], size: '85%', startAngle: 0 },
    defaultBackgroundOptions: {
      shape: 'circle',
      borderWidth: 1,
      borderColor: 'silver',
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, '#FFF'],
          [1, '#DDD'],
        ],
      },
      from: Number.MIN_VALUE,
      innerRadius: 0,
      to: Number.MAX_VALUE,
      outerRadius: '105%',
    },
  });
  var G = N.prototype,
    u = u.prototype,
    T = {
      getOffset: w,
      redraw: function() {
        this.isDirty = !1;
      },
      render: function() {
        this.isDirty = !1;
      },
      setScale: w,
      setCategories: w,
      setTitle: w,
    },
    O = {
      isRadial: !0,
      defaultRadialGaugeOptions: {
        labels: { align: 'center', x: 0, y: null },
        minorGridLineWidth: 0,
        minorTickInterval: 'auto',
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickWidth: 1,
        plotBands: [],
        tickLength: 10,
        tickPosition: 'inside',
        tickWidth: 2,
        title: { rotation: 0 },
        zIndex: 2,
      },
      defaultRadialXOptions: {
        gridLineWidth: 1,
        labels: { align: null, distance: 15, x: 0, y: null },
        maxPadding: 0,
        minPadding: 0,
        plotBands: [],
        showLastLabel: !1,
        tickLength: 0,
      },
      defaultRadialYOptions: {
        gridLineInterpolation: 'circle',
        labels: { align: 'right', x: -3, y: -2 },
        plotBands: [],
        showLastLabel: !1,
        title: { x: 4, text: null, rotation: 90 },
      },
      setOptions: function(a) {
        this.options = p(this.defaultOptions, this.defaultRadialOptions, a);
      },
      getOffset: function() {
        G.getOffset.call(this);
        this.chart.axisOffset[this.side] = 0;
      },
      getLinePath: function(a, b) {
        var c = this.center,
          b = r(b, c[2] / 2 - this.offset);
        return this.chart.renderer.symbols.arc(this.left + c[0], this.top + c[1], b, b, {
          start: this.startAngleRad,
          end: this.endAngleRad,
          open: !0,
          innerR: 0,
        });
      },
      setAxisTranslation: function() {
        G.setAxisTranslation.call(this);
        if (
          this.center &&
          ((this.transA = this.isCircular
            ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1)
            : this.center[2] / 2 / (this.max - this.min || 1)),
          this.isXAxis)
        )
          this.minPixelPadding =
            this.transA * this.minPointOffset +
            (this.reversed ? (this.endAngleRad - this.startAngleRad) / 4 : 0);
      },
      beforeSetTickPositions: function() {
        this.autoConnect &&
          (this.max += (this.categories && 1) || this.pointRange || this.closestPointRange || 0);
      },
      setAxisSize: function() {
        G.setAxisSize.call(this);
        if (this.isRadial)
          (this.center = this.pane.center = h.pie.prototype.getCenter.call(this.pane)),
            (this.len = this.width = this.height = this.isCircular
              ? (this.center[2] * (this.endAngleRad - this.startAngleRad)) / 2
              : this.center[2] / 2);
      },
      getPosition: function(a, b) {
        if (!this.isCircular) (b = this.translate(a)), (a = this.min);
        return this.postTranslate(this.translate(a), r(b, this.center[2] / 2) - this.offset);
      },
      postTranslate: function(a, b) {
        var c = this.chart,
          d = this.center,
          a = this.startAngleRad + a;
        return { x: c.plotLeft + d[0] + Math.cos(a) * b, y: c.plotTop + d[1] + Math.sin(a) * b };
      },
      getPlotBandPath: function(a, b, c) {
        var d = this.center,
          g = this.startAngleRad,
          f = d[2] / 2,
          e = [r(c.outerRadius, '100%'), c.innerRadius, r(c.thickness, 10)],
          i = /%$/,
          n,
          l = this.isCircular;
        this.options.gridLineInterpolation === 'polygon'
          ? (d = this.getPlotLinePath(a).concat(this.getPlotLinePath(b, !0)))
          : (l || ((e[0] = this.translate(a)), (e[1] = this.translate(b))),
            (e = R(e, function(a) {
              i.test(a) && (a = (v(a, 10) * f) / 100);
              return a;
            })),
            c.shape === 'circle' || !l
              ? ((a = -Math.PI / 2), (b = Math.PI * 1.5), (n = !0))
              : ((a = g + this.translate(a)), (b = g + this.translate(b))),
            (d = this.chart.renderer.symbols.arc(this.left + d[0], this.top + d[1], e[0], e[0], {
              start: a,
              end: b,
              innerR: r(e[1], e[0] - e[2]),
              open: n,
            })));
        return d;
      },
      getPlotLinePath: function(a, b) {
        var c = this.center,
          d = this.chart,
          g = this.getPosition(a),
          f,
          e,
          i;
        this.isCircular
          ? (i = ['M', c[0] + d.plotLeft, c[1] + d.plotTop, 'L', g.x, g.y])
          : this.options.gridLineInterpolation === 'circle'
          ? (a = this.translate(a)) && (i = this.getLinePath(0, a))
          : ((f = d.xAxis[0]),
            (i = []),
            (a = this.translate(a)),
            (c = f.tickPositions),
            f.autoConnect && (c = c.concat([c[0]])),
            b && (c = [].concat(c).reverse()),
            s(c, function(c, b) {
              e = f.getPosition(c, a);
              i.push(b ? 'L' : 'M', e.x, e.y);
            }));
        return i;
      },
      getTitlePosition: function() {
        var a = this.center,
          b = this.chart,
          c = this.options.title;
        return {
          x: b.plotLeft + a[0] + (c.x || 0),
          y: b.plotTop + a[1] - { high: 0.5, middle: 0.25, low: 0 }[c.align] * a[2] + (c.y || 0),
        };
      },
    };
  o(G, 'init', function(a, b, c) {
    var k;
    var d = b.angular,
      g = b.polar,
      f = c.isX,
      e = d && f,
      i,
      n;
    n = b.options;
    var l = c.pane || 0;
    if (d) {
      if ((F(this, e ? T : O), (i = !f)))
        this.defaultRadialOptions = this.defaultRadialGaugeOptions;
    } else if (g) F(this, O), (this.defaultRadialOptions = (i = f) ? this.defaultRadialXOptions : p(this.defaultYAxisOptions, this.defaultRadialYOptions));
    a.call(this, b, c);
    if (!e && (d || g)) {
      a = this.options;
      if (!b.panes) b.panes = [];
      this.pane = ((k = b.panes[l] = b.panes[l] || new J(M(n.pane)[l], b, this)), (l = k));
      l = l.options;
      b.inverted = !1;
      n.chart.zoomType = null;
      this.startAngleRad = b = ((l.startAngle - 90) * Math.PI) / 180;
      this.endAngleRad = n = ((r(l.endAngle, l.startAngle + 360) - 90) * Math.PI) / 180;
      this.offset = a.offset || 0;
      if ((this.isCircular = i) && c.max === C && n - b === 2 * Math.PI) this.autoConnect = !0;
    }
  });
  o(u, 'getPosition', function(a, b, c, d, g) {
    var f = this.axis;
    return f.getPosition ? f.getPosition(c) : a.call(this, b, c, d, g);
  });
  o(u, 'getLabelPosition', function(a, b, c, d, g, f, e, i, n) {
    var l = this.axis,
      k = f.y,
      h = f.align,
      j = (((l.translate(this.pos) + l.startAngleRad + Math.PI / 2) / Math.PI) * 180) % 360;
    l.isRadial
      ? ((a = l.getPosition(this.pos, l.center[2] / 2 + r(f.distance, -25))),
        f.rotation === 'auto'
          ? d.attr({ rotation: j })
          : k === null && (k = v(d.styles.lineHeight) * 0.9 - d.getBBox().height / 2),
        h === null &&
          ((h = l.isCircular
            ? j > 20 && j < 160
              ? 'left'
              : j > 200 && j < 340
              ? 'right'
              : 'center'
            : 'center'),
          d.attr({ align: h })),
        (a.x += f.x),
        (a.y += k))
      : (a = a.call(this, b, c, d, g, f, e, i, n));
    return a;
  });
  o(u, 'getMarkPath', function(a, b, c, d, g, f, e) {
    var i = this.axis;
    i.isRadial
      ? ((a = i.getPosition(this.pos, i.center[2] / 2 + d)), (b = ['M', b, c, 'L', a.x, a.y]))
      : (b = a.call(this, b, c, d, g, f, e));
    return b;
  });
  m.arearange = p(m.area, {
    lineWidth: 1,
    marker: null,
    threshold: null,
    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>: <b>{point.low}</b> - <b>{point.high}</b><br/>',
    },
    trackByArea: !0,
    dataLabels: { verticalAlign: null, xLow: 0, xHigh: 0, yLow: 0, yHigh: 0 },
  });
  h.arearange = j.extendClass(h.area, {
    type: 'arearange',
    pointArrayMap: ['low', 'high'],
    toYData: function(a) {
      return [a.low, a.high];
    },
    pointValKey: 'low',
    getSegments: function() {
      var a = this;
      s(a.points, function(b) {
        if (!a.options.connectNulls && (b.low === null || b.high === null)) b.y = null;
        else if (b.low === null && b.high !== null) b.y = b.high;
      });
      z.prototype.getSegments.call(this);
    },
    translate: function() {
      var a = this.yAxis;
      h.area.prototype.translate.apply(this);
      s(this.points, function(b) {
        var c = b.low,
          d = b.high,
          g = b.plotY;
        d === null && c === null
          ? (b.y = null)
          : c === null
          ? ((b.plotLow = b.plotY = null), (b.plotHigh = a.translate(d, 0, 1, 0, 1)))
          : d === null
          ? ((b.plotLow = g), (b.plotHigh = null))
          : ((b.plotLow = g), (b.plotHigh = a.translate(d, 0, 1, 0, 1)));
      });
    },
    getSegmentPath: function(a) {
      var b,
        c = [],
        d = a.length,
        g = z.prototype.getSegmentPath,
        f,
        e;
      e = this.options;
      var i = e.step;
      for (
        b = HighchartsAdapter.grep(a, function(a) {
          return a.plotLow !== null;
        });
        d--;

      )
        (f = a[d]), f.plotHigh !== null && c.push({ plotX: f.plotX, plotY: f.plotHigh });
      a = g.call(this, b);
      if (i)
        i === !0 && (i = 'left'), (e.step = { left: 'right', center: 'center', right: 'left' }[i]);
      c = g.call(this, c);
      e.step = i;
      e = [].concat(a, c);
      c[0] = 'L';
      this.areaPath = this.areaPath.concat(a, c);
      return e;
    },
    drawDataLabels: function() {
      var a = this.data,
        b = a.length,
        c,
        d = [],
        g = z.prototype,
        f = this.options.dataLabels,
        e,
        i = this.chart.inverted;
      if (f.enabled || this._hasPointLabels) {
        for (c = b; c--; )
          (e = a[c]),
            (e.y = e.high),
            (e.plotY = e.plotHigh),
            (d[c] = e.dataLabel),
            (e.dataLabel = e.dataLabelUpper),
            (e.below = !1),
            i ? ((f.align = 'left'), (f.x = f.xHigh)) : (f.y = f.yHigh);
        g.drawDataLabels.apply(this, arguments);
        for (c = b; c--; )
          (e = a[c]),
            (e.dataLabelUpper = e.dataLabel),
            (e.dataLabel = d[c]),
            (e.y = e.low),
            (e.plotY = e.plotLow),
            (e.below = !0),
            i ? ((f.align = 'right'), (f.x = f.xLow)) : (f.y = f.yLow);
        g.drawDataLabels.apply(this, arguments);
      }
    },
    alignDataLabel: h.column.prototype.alignDataLabel,
    getSymbol: h.column.prototype.getSymbol,
    drawPoints: w,
  });
  m.areasplinerange = p(m.arearange);
  h.areasplinerange = x(h.arearange, {
    type: 'areasplinerange',
    getPointSpline: h.spline.prototype.getPointSpline,
  });
  m.columnrange = p(m.column, m.arearange, { lineWidth: 1, pointRange: null });
  h.columnrange = x(h.arearange, {
    type: 'columnrange',
    translate: function() {
      var a = this,
        b = a.yAxis,
        c;
      q.translate.apply(a);
      s(a.points, function(d) {
        var g = d.shapeArgs,
          f = a.options.minPointLength,
          e;
        d.plotHigh = c = b.translate(d.high, 0, 1, 0, 1);
        d.plotLow = d.plotY;
        e = c;
        d = d.plotY - c;
        d < f && ((f -= d), (d += f), (e -= f / 2));
        g.height = d;
        g.y = e;
      });
    },
    trackerGroups: ['group', 'dataLabels'],
    drawGraph: w,
    pointAttrToOptions: q.pointAttrToOptions,
    drawPoints: q.drawPoints,
    drawTracker: q.drawTracker,
    animate: q.animate,
    getColumnMetrics: q.getColumnMetrics,
  });
  m.gauge = p(m.line, {
    dataLabels: {
      enabled: !0,
      y: 15,
      borderWidth: 1,
      borderColor: 'silver',
      borderRadius: 3,
      style: { fontWeight: 'bold' },
      verticalAlign: 'top',
      zIndex: 2,
    },
    dial: {},
    pivot: {},
    tooltip: { headerFormat: '' },
    showInLegend: !1,
  });
  u = {
    type: 'gauge',
    pointClass: j.extendClass(j.Point, {
      setState: function(a) {
        this.state = a;
      },
    }),
    angular: !0,
    drawGraph: w,
    fixedBox: !0,
    trackerGroups: ['group', 'dataLabels'],
    translate: function() {
      var a = this.yAxis,
        b = this.options,
        c = a.center;
      this.generatePoints();
      s(this.points, function(d) {
        var g = p(b.dial, d.dial),
          f = (v(r(g.radius, 80)) * c[2]) / 200,
          e = (v(r(g.baseLength, 70)) * f) / 100,
          i = (v(r(g.rearLength, 10)) * f) / 100,
          n = g.baseWidth || 3,
          l = g.topWidth || 1,
          k = a.startAngleRad + a.translate(d.y, null, null, null, !0);
        b.wrap === !1 && (k = Math.max(a.startAngleRad, Math.min(a.endAngleRad, k)));
        k = (k * 180) / Math.PI;
        d.shapeType = 'path';
        d.shapeArgs = {
          d: g.path || [
            'M',
            -i,
            -n / 2,
            'L',
            e,
            -n / 2,
            f,
            -l / 2,
            f,
            l / 2,
            e,
            n / 2,
            -i,
            n / 2,
            'z',
          ],
          translateX: c[0],
          translateY: c[1],
          rotation: k,
        };
        d.plotX = c[0];
        d.plotY = c[1];
      });
    },
    drawPoints: function() {
      var a = this,
        b = a.yAxis.center,
        c = a.pivot,
        d = a.options,
        g = d.pivot,
        f = a.chart.renderer;
      s(a.points, function(c) {
        var b = c.graphic,
          g = c.shapeArgs,
          l = g.d,
          k = p(d.dial, c.dial);
        b
          ? (b.animate(g), (g.d = l))
          : (c.graphic = f[c.shapeType](g)
              .attr({
                stroke: k.borderColor || 'none',
                'stroke-width': k.borderWidth || 0,
                fill: k.backgroundColor || 'black',
                rotation: g.rotation,
              })
              .add(a.group));
      });
      c
        ? c.animate({ translateX: b[0], translateY: b[1] })
        : (a.pivot = f
            .circle(0, 0, r(g.radius, 5))
            .attr({
              'stroke-width': g.borderWidth || 0,
              stroke: g.borderColor || 'silver',
              fill: g.backgroundColor || 'black',
            })
            .translate(b[0], b[1])
            .add(a.group));
    },
    animate: function(a) {
      var b = this;
      if (!a)
        s(b.points, function(a) {
          var d = a.graphic;
          d &&
            (d.attr({ rotation: (b.yAxis.startAngleRad * 180) / Math.PI }),
            d.animate({ rotation: a.shapeArgs.rotation }, b.options.animation));
        }),
          (b.animate = null);
    },
    render: function() {
      this.group = this.plotGroup(
        'group',
        'series',
        this.visible ? 'visible' : 'hidden',
        this.options.zIndex,
        this.chart.seriesGroup,
      );
      h.pie.prototype.render.call(this);
      this.group.clip(this.chart.clipRect);
    },
    setData: h.pie.prototype.setData,
    drawTracker: h.column.prototype.drawTracker,
  };
  h.gauge = j.extendClass(h.line, u);
  m.boxplot = p(m.column, {
    fillColor: '#FFFFFF',
    lineWidth: 1,
    medianWidth: 2,
    states: { hover: { brightness: -0.3 } },
    threshold: null,
    tooltip: {
      pointFormat:
        '<span style="color:{series.color};font-weight:bold">{series.name}</span><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>',
    },
    whiskerLength: '50%',
    whiskerWidth: 2,
  });
  h.boxplot = x(h.column, {
    type: 'boxplot',
    pointArrayMap: ['low', 'q1', 'median', 'q3', 'high'],
    toYData: function(a) {
      return [a.low, a.q1, a.median, a.q3, a.high];
    },
    pointValKey: 'high',
    pointAttrToOptions: { fill: 'fillColor', stroke: 'color', 'stroke-width': 'lineWidth' },
    drawDataLabels: w,
    translate: function() {
      var a = this.yAxis,
        b = this.pointArrayMap;
      h.column.prototype.translate.apply(this);
      s(this.points, function(c) {
        s(b, function(b) {
          c[b] !== null && (c[b + 'Plot'] = a.translate(c[b], 0, 1, 0, 1));
        });
      });
    },
    drawPoints: function() {
      var a = this,
        b = a.points,
        c = a.options,
        d = a.chart.renderer,
        g,
        f,
        e,
        i,
        n,
        l,
        k,
        h,
        j,
        m,
        o,
        H,
        p,
        E,
        I,
        q,
        w,
        t,
        v,
        u,
        z,
        y,
        x = a.doQuartiles !== !1,
        B = parseInt(a.options.whiskerLength, 10) / 100;
      s(b, function(b) {
        j = b.graphic;
        z = b.shapeArgs;
        o = {};
        E = {};
        q = {};
        y = b.color || a.color;
        if (b.plotY !== C)
          if (
            ((g = b.pointAttr[b.selected ? 'selected' : '']),
            (w = z.width),
            (t = A(z.x)),
            (v = t + w),
            (u = D(w / 2)),
            (f = A(x ? b.q1Plot : b.lowPlot)),
            (e = A(x ? b.q3Plot : b.lowPlot)),
            (i = A(b.highPlot)),
            (n = A(b.lowPlot)),
            (o.stroke = b.stemColor || c.stemColor || y),
            (o['stroke-width'] = r(b.stemWidth, c.stemWidth, c.lineWidth)),
            (o.dashstyle = b.stemDashStyle || c.stemDashStyle),
            (E.stroke = b.whiskerColor || c.whiskerColor || y),
            (E['stroke-width'] = r(b.whiskerWidth, c.whiskerWidth, c.lineWidth)),
            (q.stroke = b.medianColor || c.medianColor || y),
            (q['stroke-width'] = r(b.medianWidth, c.medianWidth, c.lineWidth)),
            (k = (o['stroke-width'] % 2) / 2),
            (h = t + u + k),
            (m = ['M', h, e, 'L', h, i, 'M', h, f, 'L', h, n, 'z']),
            x &&
              ((k = (g['stroke-width'] % 2) / 2),
              (h = A(h) + k),
              (f = A(f) + k),
              (e = A(e) + k),
              (t += k),
              (v += k),
              (H = ['M', t, e, 'L', t, f, 'L', v, f, 'L', v, e, 'L', t, e, 'z'])),
            B &&
              ((k = (E['stroke-width'] % 2) / 2),
              (i += k),
              (n += k),
              (p = ['M', h - u * B, i, 'L', h + u * B, i, 'M', h - u * B, n, 'L', h + u * B, n])),
            (k = (q['stroke-width'] % 2) / 2),
            (l = D(b.medianPlot) + k),
            (I = ['M', t, l, 'L', v, l, 'z']),
            j)
          )
            b.stem.animate({ d: m }),
              B && b.whiskers.animate({ d: p }),
              x && b.box.animate({ d: H }),
              b.medianShape.animate({ d: I });
          else {
            b.graphic = j = d.g().add(a.group);
            b.stem = d
              .path(m)
              .attr(o)
              .add(j);
            if (B)
              b.whiskers = d
                .path(p)
                .attr(E)
                .add(j);
            if (x)
              b.box = d
                .path(H)
                .attr(g)
                .add(j);
            b.medianShape = d
              .path(I)
              .attr(q)
              .add(j);
          }
      });
    },
  });
  m.errorbar = p(m.boxplot, {
    color: '#000000',
    grouping: !1,
    linkedTo: ':previous',
    tooltip: { pointFormat: m.arearange.tooltip.pointFormat },
    whiskerWidth: null,
  });
  h.errorbar = x(h.boxplot, {
    type: 'errorbar',
    pointArrayMap: ['low', 'high'],
    toYData: function(a) {
      return [a.low, a.high];
    },
    pointValKey: 'high',
    doQuartiles: !1,
    getColumnMetrics: function() {
      return (
        (this.linkedParent && this.linkedParent.columnMetrics) ||
        h.column.prototype.getColumnMetrics.call(this)
      );
    },
  });
  m.waterfall = p(m.column, {
    lineWidth: 1,
    lineColor: '#333',
    dashStyle: 'dot',
    borderColor: '#333',
  });
  h.waterfall = x(h.column, {
    type: 'waterfall',
    upColorProp: 'fill',
    pointArrayMap: ['low', 'y'],
    pointValKey: 'y',
    init: function(a, b) {
      b.stacking = !0;
      h.column.prototype.init.call(this, a, b);
    },
    translate: function() {
      var a = this.options,
        b = this.yAxis,
        c,
        d,
        g,
        f,
        e,
        i,
        n,
        l,
        k;
      c = a.threshold;
      a = (a.borderWidth % 2) / 2;
      h.column.prototype.translate.apply(this);
      l = c;
      g = this.points;
      for (d = 0, c = g.length; d < c; d++) {
        f = g[d];
        e = f.shapeArgs;
        i = this.getStack(d);
        k = i.points[this.index];
        if (isNaN(f.y)) f.y = this.yData[d];
        n = S(l, l + f.y) + k[0];
        e.y = b.translate(n, 0, 1);
        f.isSum || f.isIntermediateSum
          ? ((e.y = b.translate(k[1], 0, 1)), (e.height = b.translate(k[0], 0, 1) - e.y))
          : (l += i.total);
        e.height < 0 && ((e.y += e.height), (e.height *= -1));
        f.plotY = e.y = D(e.y) - a;
        e.height = D(e.height);
        f.yBottom = e.y + e.height;
      }
    },
    processData: function(a) {
      var b = this.yData,
        c = this.points,
        d,
        g = b.length,
        f = this.options.threshold || 0,
        e,
        i,
        h,
        l,
        k,
        j;
      i = e = h = l = f;
      for (j = 0; j < g; j++)
        (k = b[j]),
          (d = c && c[j] ? c[j] : {}),
          k === 'sum' || d.isSum
            ? (b[j] = i)
            : k === 'intermediateSum' || d.isIntermediateSum
            ? ((b[j] = e), (e = f))
            : ((i += k), (e += k)),
          (h = Math.min(i, h)),
          (l = Math.max(i, l));
      z.prototype.processData.call(this, a);
      this.dataMin = h;
      this.dataMax = l;
    },
    toYData: function(a) {
      if (a.isSum) return 'sum';
      else if (a.isIntermediateSum) return 'intermediateSum';
      return a.y;
    },
    getAttribs: function() {
      h.column.prototype.getAttribs.apply(this, arguments);
      var a = this.options,
        b = a.states,
        c = a.upColor || this.color,
        a = j
          .Color(c)
          .brighten(0.1)
          .get(),
        d = p(this.pointAttr),
        g = this.upColorProp;
      d[''][g] = c;
      d.hover[g] = b.hover.upColor || a;
      d.select[g] = b.select.upColor || c;
      s(this.points, function(a) {
        if (a.y > 0 && !a.color) (a.pointAttr = d), (a.color = c);
      });
    },
    getGraphPath: function() {
      var a = this.data,
        b = a.length,
        c = (D(this.options.lineWidth + this.options.borderWidth) % 2) / 2,
        d = [],
        g,
        f,
        e;
      for (e = 1; e < b; e++)
        (f = a[e].shapeArgs),
          (g = a[e - 1].shapeArgs),
          (f = ['M', g.x + g.width, g.y + c, 'L', f.x, g.y + c]),
          a[e - 1].y < 0 && ((f[2] += g.height), (f[5] += g.height)),
          (d = d.concat(f));
      return d;
    },
    getExtremes: w,
    getStack: function(a) {
      var b = this.yAxis.stacks,
        c = this.stackKey;
      this.processedYData[a] < this.options.threshold && (c = '-' + c);
      return b[c][a];
    },
    drawGraph: z.prototype.drawGraph,
  });
  m.bubble = p(m.scatter, {
    dataLabels: {
      inside: !0,
      style: { color: 'white', textShadow: '0px 0px 3px black' },
      verticalAlign: 'middle',
    },
    marker: { lineColor: null, lineWidth: 1 },
    minSize: 8,
    maxSize: '20%',
    tooltip: { pointFormat: '({point.x}, {point.y}), Size: {point.z}' },
    turboThreshold: 0,
    zThreshold: 0,
  });
  h.bubble = x(h.scatter, {
    type: 'bubble',
    pointArrayMap: ['y', 'z'],
    trackerGroups: ['group', 'dataLabelsGroup'],
    pointAttrToOptions: { stroke: 'lineColor', 'stroke-width': 'lineWidth', fill: 'fillColor' },
    applyOpacity: function(a) {
      var b = this.options.marker,
        c = r(b.fillOpacity, 0.5),
        a = a || b.fillColor || this.color;
      c !== 1 &&
        (a = j
          .Color(a)
          .setOpacity(c)
          .get('rgba'));
      return a;
    },
    convertAttribs: function() {
      var a = z.prototype.convertAttribs.apply(this, arguments);
      a.fill = this.applyOpacity(a.fill);
      return a;
    },
    getRadii: function(a, b, c, d) {
      var g,
        f,
        e,
        i = this.zData,
        h = [];
      for (f = 0, g = i.length; f < g; f++)
        (e = b - a), (e = e > 0 ? (i[f] - a) / (b - a) : 0.5), h.push(t.ceil(c + e * (d - c)) / 2);
      this.radii = h;
    },
    animate: function(a) {
      var b = this.options.animation;
      if (!a)
        s(this.points, function(a) {
          var d = a.graphic,
            a = a.shapeArgs;
          d && a && (d.attr('r', 1), d.animate({ r: a.r }, b));
        }),
          (this.animate = null);
    },
    translate: function() {
      var a,
        b = this.data,
        c,
        d,
        g = this.radii;
      h.scatter.prototype.translate.call(this);
      for (a = b.length; a--; )
        (c = b[a]),
          (d = g ? g[a] : 0),
          (c.negative = c.z < (this.options.zThreshold || 0)),
          d >= this.minPxSize / 2
            ? ((c.shapeType = 'circle'),
              (c.shapeArgs = { x: c.plotX, y: c.plotY, r: d }),
              (c.dlBox = { x: c.plotX - d, y: c.plotY - d, width: 2 * d, height: 2 * d }))
            : (c.shapeArgs = c.plotY = c.dlBox = C);
    },
    drawLegendSymbol: function(a, b) {
      var c = v(a.itemStyle.fontSize) / 2;
      b.legendSymbol = this.chart.renderer
        .circle(c, a.baseline - c, c)
        .attr({ zIndex: 3 })
        .add(b.legendGroup);
      b.legendSymbol.isMarker = !0;
    },
    drawPoints: h.column.prototype.drawPoints,
    alignDataLabel: h.column.prototype.alignDataLabel,
  });
  N.prototype.beforePadding = function() {
    var a = this,
      b = this.len,
      c = this.chart,
      d = 0,
      g = b,
      f = this.isXAxis,
      e = f ? 'xData' : 'yData',
      i = this.min,
      h = {},
      j = t.min(c.plotWidth, c.plotHeight),
      k = Number.MAX_VALUE,
      m = -Number.MAX_VALUE,
      o = this.max - i,
      p = b / o,
      q = [];
    this.tickPositions &&
      (s(this.series, function(b) {
        var c = b.options;
        if (b.type === 'bubble' && b.visible && ((a.allowZoomOutside = !0), q.push(b), f))
          s(['minSize', 'maxSize'], function(a) {
            var b = c[a],
              d = /%$/.test(b),
              b = v(b);
            h[a] = d ? (j * b) / 100 : b;
          }),
            (b.minPxSize = h.minSize),
            (b = b.zData),
            b.length &&
              ((k = t.min(
                k,
                t.max(P(b), c.displayNegative === !1 ? c.zThreshold : -Number.MAX_VALUE),
              )),
              (m = t.max(m, Q(b))));
      }),
      s(q, function(a) {
        var b = a[e],
          c = b.length,
          j;
        f && a.getRadii(k, m, h.minSize, h.maxSize);
        if (o > 0)
          for (; c--; )
            (j = a.radii[c]),
              (d = Math.min((b[c] - i) * p - j, d)),
              (g = Math.max((b[c] - i) * p + j, g));
      }),
      q.length &&
        o > 0 &&
        r(this.options.min, this.userMin) === C &&
        r(this.options.max, this.userMax) === C &&
        ((g -= b), (p *= (b + d - g) / b), (this.min += d / p), (this.max += g / p)));
  };
  var y = z.prototype,
    m = j.Pointer.prototype;
  y.toXY = function(a) {
    var b,
      c = this.chart;
    b = a.plotX;
    var d = a.plotY;
    a.rectPlotX = b;
    a.rectPlotY = d;
    a.clientX = ((b / Math.PI) * 180 + this.xAxis.pane.options.startAngle) % 360;
    b = this.xAxis.postTranslate(a.plotX, this.yAxis.len - d);
    a.plotX = a.polarPlotX = b.x - c.plotLeft;
    a.plotY = a.polarPlotY = b.y - c.plotTop;
  };
  y.orderTooltipPoints = function(a) {
    if (
      this.chart.polar &&
      (a.sort(function(a, c) {
        return a.clientX - c.clientX;
      }),
      a[0])
    )
      (a[0].wrappedClientX = a[0].clientX + 360), a.push(a[0]);
  };
  o(h.area.prototype, 'init', K);
  o(h.areaspline.prototype, 'init', K);
  o(h.spline.prototype, 'getPointSpline', function(a, b, c, d) {
    var g, f, e, i, h, j, k;
    if (this.chart.polar) {
      g = c.plotX;
      f = c.plotY;
      a = b[d - 1];
      e = b[d + 1];
      this.connectEnds && (a || (a = b[b.length - 2]), e || (e = b[1]));
      if (a && e)
        (i = a.plotX),
          (h = a.plotY),
          (b = e.plotX),
          (j = e.plotY),
          (i = (1.5 * g + i) / 2.5),
          (h = (1.5 * f + h) / 2.5),
          (e = (1.5 * g + b) / 2.5),
          (k = (1.5 * f + j) / 2.5),
          (b = Math.sqrt(Math.pow(i - g, 2) + Math.pow(h - f, 2))),
          (j = Math.sqrt(Math.pow(e - g, 2) + Math.pow(k - f, 2))),
          (i = Math.atan2(h - f, i - g)),
          (h = Math.atan2(k - f, e - g)),
          (k = Math.PI / 2 + (i + h) / 2),
          Math.abs(i - k) > Math.PI / 2 && (k -= Math.PI),
          (i = g + Math.cos(k) * b),
          (h = f + Math.sin(k) * b),
          (e = g + Math.cos(Math.PI + k) * j),
          (k = f + Math.sin(Math.PI + k) * j),
          (c.rightContX = e),
          (c.rightContY = k);
      d
        ? ((c = ['C', a.rightContX || a.plotX, a.rightContY || a.plotY, i || g, h || f, g, f]),
          (a.rightContX = a.rightContY = null))
        : (c = ['M', g, f]);
    } else c = a.call(this, b, c, d);
    return c;
  });
  o(y, 'translate', function(a) {
    a.call(this);
    if (this.chart.polar && !this.preventPostTranslate)
      for (var a = this.points, b = a.length; b--; ) this.toXY(a[b]);
  });
  o(y, 'getSegmentPath', function(a, b) {
    var c = this.points;
    if (
      this.chart.polar &&
      this.options.connectEnds !== !1 &&
      b[b.length - 1] === c[c.length - 1] &&
      c[0].y !== null
    )
      (this.connectEnds = !0), (b = [].concat(b, [c[0]]));
    return a.call(this, b);
  });
  o(y, 'animate', L);
  o(q, 'animate', L);
  o(y, 'setTooltipPoints', function(a, b) {
    this.chart.polar && F(this.xAxis, { tooltipLen: 360 });
    return a.call(this, b);
  });
  o(q, 'translate', function(a) {
    var b = this.xAxis,
      c = this.yAxis.len,
      d = b.center,
      g = b.startAngleRad,
      f = this.chart.renderer,
      e,
      h;
    this.preventPostTranslate = !0;
    a.call(this);
    if (b.isRadial) {
      b = this.points;
      for (h = b.length; h--; )
        (e = b[h]),
          (a = e.barX + g),
          (e.shapeType = 'path'),
          (e.shapeArgs = {
            d: f.symbols.arc(d[0], d[1], c - e.plotY, null, {
              start: a,
              end: a + e.pointWidth,
              innerR: c - r(e.yBottom, c),
            }),
          }),
          this.toXY(e);
    }
  });
  o(q, 'alignDataLabel', function(a, b, c, d, g, f) {
    if (this.chart.polar) {
      a = (b.rectPlotX / Math.PI) * 180;
      if (d.align === null)
        d.align = a > 20 && a < 160 ? 'left' : a > 200 && a < 340 ? 'right' : 'center';
      if (d.verticalAlign === null)
        d.verticalAlign = a < 45 || a > 315 ? 'bottom' : a > 135 && a < 225 ? 'top' : 'middle';
      y.alignDataLabel.call(this, b, c, d, g, f);
    } else a.call(this, b, c, d, g, f);
  });
  o(m, 'getIndex', function(a, b) {
    var c,
      d = this.chart,
      g;
    d.polar
      ? ((g = d.xAxis[0].center),
        (c = b.chartX - g[0] - d.plotLeft),
        (d = b.chartY - g[1] - d.plotTop),
        (c = 180 - Math.round((Math.atan2(c, d) / Math.PI) * 180)))
      : (c = a.call(this, b));
    return c;
  });
  o(m, 'getCoordinates', function(a, b) {
    var c = this.chart,
      d = { xAxis: [], yAxis: [] };
    c.polar
      ? s(c.axes, function(a) {
          var f = a.isXAxis,
            e = a.center,
            h = b.chartX - e[0] - c.plotLeft,
            e = b.chartY - e[1] - c.plotTop;
          d[f ? 'xAxis' : 'yAxis'].push({
            axis: a,
            value: a.translate(
              f ? Math.PI - Math.atan2(h, e) : Math.sqrt(Math.pow(h, 2) + Math.pow(e, 2)),
              !0,
            ),
          });
        })
      : (d = a.call(this, b));
    return d;
  });
})(Highcharts);
